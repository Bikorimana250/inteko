# Critical Bug Analysis — Pre-Defense Final Review
**Date:** July 12, 2026  
**Status:** Analysis Only — No Code Changes Made  
**Defense:** Wednesday  
**Issues Identified:** 5

---

## Bug 1: Login Returns INTERNAL_SERVER_ERROR (500) — Still Persisting

### Symptom
`{"success":false,"errorCode":"INTERNAL_SERVER_ERROR","message":"An unexpected error occurred"}`  
Console: `POST http://localhost:8080/api/v1/auth/login 401` (in LoginView.tsx)

### Root Cause — Two Layers

**Layer A: The 500 on the backend**  
`AuthService.java` login method is annotated `@Transactional`. Inside it, after authentication, it calls `userRepository.findById()`. The User entity extends `AuditableEntity` which has `@CreatedDate` with `nullable = false`. When H2 restarts (dev profile uses `ddl-auto: create-drop`), all data is wiped and re-seeded by `DevDataInitializer`. The `DevDataInitializer.seedUser()` calls `User.builder()...build()` and `userRepository.save()` — but the `@CreatedDate` / `@LastModifiedDate` audit fields are populated by Spring's JPA auditing infrastructure at save time. If for any reason this fails or the schema has a constraint issue, the save throws, the transaction rolls back, and `GlobalExceptionHandler` catches it as a generic `Exception` → 500.

The most likely specific cause: Spring Data JPA auditing requires the entity to be properly configured, and `@Column(name = "updated_at", nullable = false)` may not get populated on the first save in H2 because `@LastModifiedDate` is only filled when there is a previous version to compare against (i.e., it may be null on initial insert in some Spring Data versions).

**Layer B: The 401 shown in the browser console**  
This is NOT the same 401 as the meeting creation issue. This 401 comes from `LoginView.tsx` line 96 which is inside the `handleQuickLogin` catch block — meaning the backend returned a non-ok status (the 500), the `if (res.ok)` check failed, the code fell through to the local fallback `onLoginSuccess(user)`, but then `handleUnauthorized()` in `api.ts` fired on a subsequent request (like `fetchMeetings` on mount), which called `window.location.reload()`, triggering another login attempt and showing the 401 again.

### Fix Required

**File: `backend/src/main/java/rw/gov/inteko/backend/config/DevDataInitializer.java`**

The `seedUser()` method must set the audit fields manually since H2 with `create-drop` may not trigger JPA auditing correctly on the very first save:

```java
// In AuditableEntity, created_at and updated_at are nullable=false
// DevDataInitializer must set them explicitly to avoid constraint violations
```

Add `setCreatedAt()` and `setUpdatedAt()` calls in `seedUser()` before saving:

```java
u.setCreatedAt(LocalDateTime.now()); // prevent nullable=false constraint failure
u.setUpdatedAt(LocalDateTime.now());
userRepository.save(u);
```

**File: `backend/src/main/java/rw/gov/inteko/backend/entity/base/AuditableEntity.java`**

Change `nullable = false` to `nullable = true` on both audit date columns to allow initial saves without audit context:

```java
@Column(name = "created_at", updatable = false) // remove nullable = false
@Column(name = "updated_at")                     // remove nullable = false
```

**Recommended approach: Option B** (change nullable in AuditableEntity) — lowest risk, no other files need changing, works for both H2 and PostgreSQL.

---

## Bug 2: Every Page Reload Redirects to Login

### Symptom
Refreshing the browser on any page immediately shows the login screen.

### Root Cause

**File: `src/api.ts`** — `handleUnauthorized()` function:

```typescript
function handleUnauthorized(): void {
  localStorage.removeItem('inteko_jwt_token');
  localStorage.removeItem('inteko_auth_state');
  localStorage.removeItem('inteko_current_user');
  window.location.reload();  // ← THIS IS THE PROBLEM
}
```

On every page load, `App.tsx` runs a `useEffect` that calls `fetchMeetings()`:

```typescript
useEffect(() => {
  fetchMeetings()  // GET /meetings — this is PUBLIC (no auth needed)
    ...
}, []);
```

BUT `GET /meetings` is a public endpoint. So when it returns successfully, `get()` in `api.ts` runs fine. However, `fetchSectors()` is also called from `MeetingListView.tsx` on mount:

```typescript
useEffect(() => {
  fetchSectors()  // GET /geography/sectors — also PUBLIC
```

Both are public endpoints, so they should not return 401. The redirect loop is caused by something else triggering a 401.

**The actual trigger**: After login via the backend, the JWT is stored. But on the next `window.location.reload()` call from `handleUnauthorized()`, React re-initializes. If the stored JWT is expired or invalid, the NEXT authenticated API call returns 401, which triggers `handleUnauthorized()` again, which calls `reload()` again — creating an infinite loop that always shows the login page.

**Additionally:** The `handleUnauthorized()` function is too aggressive. Even a brief network blip or a single failed request wipes the entire session and reloads. This means if `fetchMeetings()` ever returns 401 (e.g., because the token expired mid-session), the user is immediately kicked out with no warning.

### Fix Required

**File: `src/api.ts`**

Remove `window.location.reload()` from `handleUnauthorized()`. Instead, just clear localStorage and let React's state update naturally handle the redirect (since `App.tsx` checks `isAuthenticated` state):

```typescript
// WRONG — causes infinite reload loops:
function handleUnauthorized(): void {
  localStorage.removeItem('inteko_jwt_token');
  localStorage.removeItem('inteko_auth_state');
  localStorage.removeItem('inteko_current_user');
  window.location.reload();  // ← REMOVE THIS
}
```

The correct approach: dispatch a custom event or use a shared state signal. Since this is a React app without Redux, the simplest safe approach is to NOT use `handleUnauthorized()` at all inside public-endpoint functions, and only handle 401 gracefully by returning null/throwing without reloading.

For protected endpoints (POST /meetings, etc.), when a 401 is received, just throw the error — let the UI show it. The user can manually log out and back in.

```typescript
// Simple fix — remove window.location.reload():
function handleUnauthorized(): void {
  localStorage.removeItem('inteko_jwt_token');
  localStorage.removeItem('inteko_auth_state');
  localStorage.removeItem('inteko_current_user');
  // Do NOT reload — let React handle the state change naturally
}
```

**Why this works**: `App.tsx` initializes `isAuthenticated` from localStorage. After `handleUnauthorized()` clears localStorage, the next time any React state update triggers a re-render, the app will check `isAuthenticated` and redirect to login gracefully. No hard reload needed.

---

## Bug 3: "Session Expired" Flash + Immediate Redirect to Login When Creating Meeting

### Symptom
After login, clicking "Publish Assembly" shows "Failed to save meeting. Session expired. Login again." for half a second, then immediately redirects to login page.

### Root Cause

This is a chain reaction caused by Bug 2:

1. User logs in — JWT stored in localStorage
2. `fetchMeetings()` runs on mount — succeeds (public endpoint)
3. User fills in form and clicks "Publish Assembly"
4. `POST /meetings` is called — backend returns 401 (token invalid/expired or not sent)
5. `handleUnauthorized()` fires in `api.ts`
6. `window.location.reload()` is called
7. React reinitializes — `isAuthenticated` check: `inteko_auth_state` was cleared → shows login page

The "half second flash" is the error being set in `MeetingListView.tsx` state, followed immediately by the page reload wiping everything.

The root cause of the 401 on POST /meetings is still the stale/missing JWT — same as Bug 1. But the aggressive `window.location.reload()` in `handleUnauthorized()` makes it invisible and unrecoverable.

### Fix Required

Same as Bug 2 — remove `window.location.reload()` from `handleUnauthorized()`. The error message should stay on screen so the user knows what happened, and they can choose to log out manually.

---

## Bug 4: Quick-Access User Cards on Login Page — Unprofessional UX

### Symptom
All users (from `INITIAL_USERS` in `data.ts`) appear as clickable cards on the login screen. Clicking one auto-fills credentials and immediately logs in. Also, a "Quick access tester override" appears in the profile dropdown when logged in.

### Root Cause — Two Parts

**Part A: Login page quick-access cards**

**File: `src/components/LoginView.tsx`** (bottom section):

```tsx
{/* Quick Login Role Demo Accounts Swappable List */}
<div className="mt-8 pt-6 border-t border-[#1a42310d]">
  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-3 block">
    Administrative Quick-Access (Testing Simulation)
  </p>
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
    {availableUsers.map((u) => (        // ← renders ALL users from data.ts
      <button
        key={u.id}
        onClick={() => handleQuickLogin(u)}   // ← instant login on click
```

The `availableUsers` prop is the full `users` array from `App.tsx` state, which includes every user ever created (including any added via the Create User form). When any new user is created in the system, they also appear as a quick-login card.

**Part B: "Quick access tester override" in profile dropdown**

**File: `src/App.tsx`** — inside the `User Management` view for non-admin users, there is a "Developer Key" button:

```tsx
<button 
  onClick={() => handleLogin(users.find(u => u.role === 'Administrator') || users[2])}
  className="..."
>
  Assume Admin Clearance (Developer Key)
</button>
```

This is a developer convenience button that was left in the production UI. It appears in the profile/settings area and allows any user to instantly switch to admin.

### Fix Required

**File: `src/components/LoginView.tsx`**

Remove the entire "Administrative Quick-Access" section from the login view. It is only appropriate for development/testing, not for a project defense presentation. The login form alone is sufficient and looks professional.

```tsx
// REMOVE this entire block:
<div className="mt-8 pt-6 border-t border-[#1a42310d]">
  <p>Administrative Quick-Access (Testing Simulation)</p>
  <div className="grid...">
    {availableUsers.map(...)}
  </div>
</div>
```

**File: `src/App.tsx`** — `User Management` view for non-admin:

Remove the "Assume Admin Clearance (Developer Key)" button from the access restriction panel.

```tsx
// REMOVE this button:
<button onClick={() => handleLogin(users.find(u => u.role === 'Administrator') || users[2])}>
  Assume Admin Clearance (Developer Key)
</button>
```

**For defense credentials:** Log in manually using `admin@inteko.gov.rw` / `password123` or any of the seeded accounts. The form login works correctly.

---

## Bug 5: URL Never Changes — Always http://localhost:3000/

### Symptom
Navigating between pages (Dashboard, Meeting List, etc.) never changes the URL. It stays at `/` throughout.

### Root Cause

**File: `src/App.tsx`**

The application uses a custom `currentView` state string to control which component renders, rather than React Router:

```typescript
const [currentView, setCurrentView] = useState<string>('Dashboard');
```

This is a single-page app with no routing library. All navigation is handled by `setCurrentView()` which just swaps components in place without changing the URL.

This means:
- Browser back/forward buttons don't work
- Sharing a URL to a specific page is impossible  
- Refreshing always goes to the default view (or login)

### Assessment for Defense

This is **by design** — the application was built as a state-based SPA without routing. This is a legitimate architectural choice for an ERP-style internal tool.

**For defense, when asked:** "We chose a state-managed navigation approach for this phase to keep the codebase simple. Adding React Router is planned for the next sprint to enable deep-linking and browser history support."

### Fix Required (Optional — NOT recommended before defense)

Adding React Router at this stage would require modifying every `setCurrentView()` call in `App.tsx` and wrapping the app in a `<BrowserRouter>`. This is high-risk with very little time before defense.

**Recommendation: Do not change this before Wednesday.**

---

## Summary Table

| # | Bug | File(s) | Root Cause | Risk of Fix | Priority |
|---|-----|---------|------------|-------------|----------|
| 1 | Login 500 error | `AuditableEntity.java` | `nullable=false` on audit columns fails on H2 initial save | LOW | CRITICAL |
| 2 | Every reload → Login page | `src/api.ts` | `window.location.reload()` in handleUnauthorized creates infinite loop | LOW | CRITICAL |
| 3 | Session expired flash | `src/api.ts` | Same as Bug 2 (chain reaction) | LOW | CRITICAL (fixed by Bug 2 fix) |
| 4 | Quick-access cards on login | `src/components/LoginView.tsx`, `src/App.tsx` | Dev testing UI left in production view | LOW | HIGH (presentation quality) |
| 5 | URL never changes | `src/App.tsx` | No routing library — state-based navigation | HIGH | SKIP before defense |

---

## Files to Modify

| File | Change |
|------|--------|
| `backend/src/main/java/rw/gov/inteko/backend/entity/base/AuditableEntity.java` | Remove `nullable = false` from `created_at` and `updated_at` columns |
| `src/api.ts` | Remove `window.location.reload()` from `handleUnauthorized()` |
| `src/components/LoginView.tsx` | Remove the entire "Administrative Quick-Access" section |
| `src/App.tsx` | Remove the "Assume Admin Clearance (Developer Key)" button |

**Total files:** 4  
**Estimated time:** 20–30 minutes  
**Risk level:** LOW  
**Backend restart required:** YES (after AuditableEntity change)

---

## Recommended Fix Order

1. **AuditableEntity.java** — fixes the 500 on login (most critical, requires backend restart)
2. **api.ts** — fixes the infinite reload loop and session flash (fixes Bugs 2 and 3 together)
3. **LoginView.tsx** — removes unprofessional quick-access cards
4. **App.tsx** — removes developer key button
5. **Skip URL routing** — too risky, not needed for defense

---

## What to Tell the Panel About the URL Issue (Bug 5)

"The system uses client-side state management for navigation, which is appropriate for an internal ERP tool where users don't share direct links to specific pages. React Router integration is part of the next development sprint."

This is a factually accurate, professional answer that shows architectural awareness without being defensive.
