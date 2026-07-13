# Issues Analysis Report
**Date:** July 13, 2026
**Status:** Analysis Only — No Code Changes
**Issues Reported:** 7

---

## Issue 1: Browser `alert()` Popups Instead of In-App Notifications

### Symptom
Actions like uploading a document, creating a user, or revoking a document show native browser `alert()` dialogs:
- `"Document uploaded and committed: ... was safely stored in the document vault"`
- `"Revoke document registration state and remove document file permanently from library records?"`
- `"Success! Committed new staff account: Test User 1 assigned with system ID U-05"`

### Root Cause
**File: `src/App.tsx`**

The handlers for these actions call `alert()` and `window.confirm()` directly:

```typescript
// In handleSaveUser:
alert(`Success! Committed new staff account: ${newUser.name} assigned with system ID ${newUser.id}`);

// In handleDeleteUser:
if (window.confirm(`Revoke security credentials and delete administrative user account file permanently?`)) { ... }
```

Similar patterns exist in `handleUpdateUser`. These are native browser dialogs — not React components. They look unprofessional in a defense demo and cannot be styled.

The document library likely has the same pattern inside `DocumentLibraryView.tsx` for upload and delete confirmations.

### What Needs to Change
Replace `alert()` with inline success messages (a toast or a status banner rendered within the React component). Replace `window.confirm()` with an in-component confirmation dialog or a simple inline "are you sure?" toggle state.

**Files affected:** `src/App.tsx`, `src/components/DocumentLibraryView.tsx`

---

## Issue 2: No Way to Create or Resolve an Issue as Sector Official

### Symptom
When logged in as Sector Official, there is no button to create a new issue, and no way to mark an issue as resolved from the UI.

### Root Cause — Two Parts

**Part A: Issue creation**

`IssueTrackingView.tsx` is not shown in the provided files, so its exact contents cannot be confirmed. However, from `src/App.tsx`, the `IssueTrackingView` component receives:

```typescript
<IssueTrackingView
  currentUser={currentUser}
  issues={issues}
  onTriggerEditIssue={...}
  onTriggerViewIssue={...}
  onNavigateToView={...}
/>
```

There is no `onCreateIssue` prop passed from `App.tsx`. The `handleAddLiveIssue` function exists in `App.tsx` but it only generates a **random simulated issue** — it is wired to the "Simulate Issue" button on the Admin Dashboard, not to any real "Create Issue" form in `IssueTrackingView`.

There is also no `POST /issues` call anywhere in `src/api.ts` — `fetchIssues()` exists (GET only). So even if a create form were added to the UI, there is no API function to persist it to the backend.

**Part B: Issue resolution**

Similarly, there is no `onResolveIssue` prop passed to `IssueTrackingView` from `App.tsx`. The backend has `PATCH /issues/{id}/resolve` but there is no corresponding function in `src/api.ts` and no handler in `App.tsx`.

### Summary of Missing Pieces
| Feature | `api.ts` function | `App.tsx` handler | UI prop passed |
|---------|-------------------|-------------------|----------------|
| Create issue | ❌ Missing | ❌ Missing | ❌ Missing |
| Resolve issue | ❌ Missing | ❌ Missing | ❌ Missing |
| Assign issue | ❌ Missing | ❌ Missing | ❌ Missing |

**Files affected:** `src/api.ts`, `src/App.tsx`, `src/components/IssueTrackingView.tsx`

---

## Issue 3: Cannot Add Cells or Villages — Data Is Still Mock

### Symptom
The Cells & Villages page shows data that does not match the database. There is no way to add a cell or village from the UI.

### Root Cause — Two Parts

**Part A: Mock data**

`CellsVillagesView.tsx` receives `cells` as a prop from `App.tsx`. The `cells` state in `App.tsx` is initialized from `INITIAL_CELLS` in `src/data.ts` (or localStorage). The geographic API endpoints (`GET /geography/sectors/{id}/cells`, `GET /geography/cells/{id}/villages`) are never called. The component only displays whatever is in `INITIAL_CELLS` — which, prior to the recent fix, used invented names like "Kacyiru Cell" and "Umutekano Village" that don't match `V3__seed_data.sql`.

The `INITIAL_CELLS` in `src/data.ts` has now been updated to match the seed data, but the component still reads from local state — not from the backend. So after a localStorage clear, it falls back to the correct mock data. After a backend-seeded run, the actual DB data is still not shown.

**Part B: No Add functionality wired**

`handleAddSimulatedVillage` exists in `App.tsx` but is never passed to `CellsVillagesView` as a prop:

```typescript
// In App.tsx, case 'Cells & Villages':
return (
  <CellsVillagesView
    cells={cells}
    // ← no onAddVillage prop passed
  />
);
```

`CellsVillagesView.tsx` has no `onAddVillage` prop in its interface and no Add button in its JSX. The backend has no `POST /geography/cells` or `POST /geography/villages` endpoint visible in the provided code, so there is nothing to call even if the UI had the button.

### Summary
- No backend endpoint for creating cells/villages exists in the shown code
- No prop is passed to connect `handleAddSimulatedVillage` to the view
- The view component has no Add button

**Files affected:** `src/App.tsx`, `src/components/CellsVillagesView.tsx`

---

## Issue 4: Document Upload Produces a Corrupted / Unviewable Download

### Symptom
After uploading a document and then downloading it, the file is corrupted and cannot be opened.

### Root Cause
**File: `src/components/DocumentLibraryView.tsx`**

The document library is entirely frontend-only. There is no actual file upload to a backend endpoint — the "upload" action is simulated. When a file is "uploaded", its metadata (name, size, type) is added to local state, but the actual file binary data is NOT stored anywhere — not in localStorage, not on the backend.

When the user then clicks "Download" on that uploaded document, the `downloadDocumentFile` function runs. This function does not read from a stored file — it generates a synthetic text blob with the document's metadata as its content. As documented in `docs/13-bug-analysis-pre-defense.md`, the blob is created as `text/plain` with the `.pdf` extension (or was, before the fix changed it to `application/octet-stream`).

The result: the downloaded file contains plain text (or nothing meaningful), not the original PDF binary. Opening it in a PDF viewer fails because the binary PDF structure is not there.

There is no `POST /documents/upload` or `GET /documents/{id}/file` endpoint visible in `src/api.ts` — only `fetchDocuments()` (GET list). The backend `DocumentController` is referenced but its full implementation is not shown.

### Why It's Corrupted Specifically
When the user uploads a real PDF, the browser reads it as a `File` object. The current `DocumentLibraryView.tsx` code only stores the file's name and size in state — it does not store the `ArrayBuffer` or `Blob` of the actual file content. So the original bytes are discarded immediately. The download function has no way to reconstruct the original file.

**Files affected:** `src/components/DocumentLibraryView.tsx`, `src/api.ts` (missing upload endpoint)

---

## Issue 5: Created User Exists on Frontend But Not in Database

### Symptom
Admin creates a user via the Create User form. The user appears in the frontend User Management table. Attempting to log in as that user returns "Invalid email or password."

### Root Cause
**File: `src/App.tsx`** — `handleSaveUser` function:

```typescript
const handleSaveUser = (userData: Omit<User, 'id' | 'avatar' | 'lastActive'>) => {
  const nextId = `U-0${users.length + 1}`;
  const newUser: User = {
    ...userData,
    id: nextId,
    avatar: AVATARS.general,
    lastActive: 'Never logged in'
  };
  setUsers(prev => [...prev, newUser]);
  alert(`Success! Committed new staff account: ...`);
  setCurrentView('User Management');
};
```

This function only updates local React state (`setUsers`). It never calls any backend API. There is no `createUser()` function in `src/api.ts`. The backend endpoint `POST /users` exists (confirmed in `SecurityConfig.java`: `ADMINISTRATOR` only) but is never called.

The user is stored in `localStorage` via the `useEffect` that syncs `users` state. Since the backend has no record of this user, logging in via the backend authentication endpoint (`POST /auth/login`) fails with 401 — the email and hashed password do not exist in the `user_accounts` table.

Additionally, the frontend assigns a password directly in the user form data, but this is a plain-text value stored in localStorage — it is never hashed or sent to the backend. Even if the backend were called, a proper `BCrypt` hash would need to be generated server-side.

**Files affected:** `src/App.tsx`, `src/api.ts` (missing `createUser()` function), `src/components/CreateUserView.tsx`

---

## Issue 6: Created Meeting Not Visible in Database

### Symptom
A meeting is created through the UI. It appears on the frontend Meeting List. After checking the database, the meeting is not there.

### Root Cause — Most Likely: JWT Not Sent

**File: `src/components/MeetingListView.tsx`** — `handleSubmit` calls `createMeeting()` from `src/api.ts`, which does a `POST /meetings` with `getAuthHeaders()`.

**File: `src/api.ts`** — `getAuthHeaders()`:
```typescript
function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('inteko_jwt_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}
```

If `inteko_jwt_token` is null (because the user was restored from a stale localStorage session without a token, or because `handleUnauthorized()` cleared it), the `POST /meetings` request goes out with no `Authorization` header. The backend requires `SECTOR_OFFICIAL` role, so it returns 401.

When 401 is returned, `handleUnauthorized()` fires and clears localStorage. The error message appears briefly in `MeetingListView.tsx` state (`setErrorCode(...)`), but because `handleUnauthorized()` cleared `inteko_auth_state`, the app may re-render to show the login page before the user can read the error.

The meeting is then added to local state optimistically (if the flow in `App.tsx` adds it before checking the API result) — so it appears on the frontend despite never reaching the database. After a page refresh, `fetchMeetings()` loads from the backend and the locally-added meeting is gone.

**Secondary possible cause:** The backend is returning a 500 error due to the `AuditableEntity` `nullable=false` issue documented in `docs/14-critical-bugs-pre-defense.md`. If `created_at` or `updated_at` cannot be set on the Meeting entity (same issue as the User entity), the save fails silently.

**To verify:** Open browser DevTools → Network tab → create a meeting → check the `POST /meetings` request. If it shows 401, the JWT is missing. If it shows 500, the backend entity save is failing.

**Files affected:** `src/components/MeetingListView.tsx`, `src/api.ts`, `backend/.../entity/base/AuditableEntity.java`

---

## Summary Table

| # | Problem | Root Cause | Files Affected |
|---|---------|------------|----------------|
| 1 | `alert()` / `confirm()` browser dialogs | Native browser API used instead of React UI | `App.tsx`, `DocumentLibraryView.tsx` |
| 2 | Cannot create or resolve issue as Sector Official | No `POST /issues` or `PATCH /issues/{id}/resolve` in `api.ts`; no handler or prop wired | `api.ts`, `App.tsx`, `IssueTrackingView.tsx` |
| 3 | Cannot add cells/villages; data is mock | No backend geographic write endpoints; `handleAddSimulatedVillage` not wired to view | `App.tsx`, `CellsVillagesView.tsx` |
| 4 | Downloaded document is corrupted | File binary discarded on upload; download generates a synthetic text blob instead | `DocumentLibraryView.tsx` |
| 5 | Created user not in database | `handleSaveUser` only updates local state; no `POST /users` API call; no password hashing | `App.tsx`, `api.ts`, `CreateUserView.tsx` |
| 6 | Created meeting not in database | JWT missing from request (401) OR backend entity save fails (500) | `MeetingListView.tsx`, `api.ts`, `AuditableEntity.java` |

---

## Fix Complexity Assessment

| # | Problem | Complexity | Can Fix Before Defense? |
|---|---------|-----------|------------------------|
| 1 | `alert()` dialogs | LOW — replace with inline state messages | ✅ Yes |
| 2 | Cannot create/resolve issues | HIGH — requires new API functions + backend wiring + UI | ⚠️ Partial (resolve only, if time allows) |
| 3 | Cells/villages mock + no add | MEDIUM — add button needs backend endpoint which doesn't exist | ⚠️ Mock data acceptable for defense |
| 4 | Document download corrupted | HIGH — requires real file storage (backend) or in-memory binary store | ❌ Not before defense without new infrastructure |
| 5 | Created user not in DB | MEDIUM — add `createUser()` to `api.ts`, call from `App.tsx`, backend hashes password | ✅ Feasible if backend endpoint works |
| 6 | Meeting not in DB | LOW — fix JWT presence before submit (already partially addressed) | ✅ Yes, verify JWT is present on submit |

---

## Recommended Action Before Defense

1. **Issue 6 (Meeting not in DB):** Log out completely, clear localStorage manually in DevTools, log back in fresh via the backend. Verify `inteko_jwt_token` exists in localStorage before attempting to create a meeting. If it does and meetings still don't persist, check the backend logs for a 500 on `POST /meetings`.

2. **Issue 1 (Alert dialogs):** Replace `alert()` calls in `App.tsx` with inline state-based success messages. This is the highest-visibility presentation problem with the lowest risk to fix.

3. **Issue 5 (Created user not in DB):** Add a `createUser()` function to `src/api.ts` that calls `POST /users`, and call it from `handleSaveUser` in `App.tsx`. The backend must be running and the logged-in user must be Administrator for this endpoint to work.

4. **Issues 2, 3, 4:** These require either new backend endpoints or significant frontend architecture changes. For defense, document them as "planned for next sprint" and focus the demo on the working meeting and attendance flow.
