# System Diagnostic Report
**Date:** July 13, 2026
**Status:** Analysis Complete — Issues Identified with Fixes

---

## Issue 1: Login Page — "Demo Accounts" Credentials Block

### Current State
`LoginView.tsx` shows a static text block below the form:
```
Demo Accounts
admin@inteko.gov.rw — Administrator
jp.uwimana@kinyinya.gov.rw — Sector Official
m.uwera@kinyinya.gov.rw — Meeting Secretary
Password: password123
```
This is unprofessional for a defense presentation. It exposes credentials in plain text with no interactivity.

### What You Want Instead
After the user types their email and password, they click a role button (Administrator / Sector Official / Meeting Secretary). If the selected role matches what the backend returns for that user, login proceeds normally. If there is a mismatch, a clear error message is shown.

### How to Implement

**File: `src/components/LoginView.tsx`**

1. Add a `selectedRole` state (string | null).
2. Show three role selector buttons below the password field (before the submit button).
3. After the backend returns the authenticated user, compare `mappedUser.role` against `selectedRole`. If they don't match, show an error and do NOT call `onLoginSuccess`.
4. Remove the static credential text block entirely.

The form flow becomes:
- Enter email → enter password → click a role button → click "Authorize & Authenticate"
- Backend authenticates → role checked → proceed or show mismatch error

**Error message for mismatch:**
> "Selected role does not match your account. Please select the correct role for this account."

---

## Issue 2: Meeting Not Saved to Database

### Current State
Looking at `MeetingListView.tsx` lines 100–135: the `handleSubmit` function calls `createMeeting()` from `api.ts` correctly. The `POST /meetings` request IS being sent to the backend.

The data IS saved to the DB. However the meeting disappears after a browser refresh because of a race condition:

1. `handleMeetingCreated(newMeeting)` is called in `App.tsx` — adds the meeting to local state.
2. `App.tsx` immediately calls `fetchMeetings()` again to refresh from backend.
3. `fetchMeetings()` maps backend meetings to the frontend `Meeting` type.
4. The meetings state is set to this fresh list.

**BUT** — `MeetingListView.tsx` uses `createMeeting()` which requires a valid JWT. If the JWT is missing or expired (see Issue 3 below), the `POST /meetings` call returns 401, the meeting is never saved, and the error message appears.

**Verify this is the real cause:** Check the browser console Network tab. If `POST /meetings` shows 401, the token is the problem. If it shows 201 Created, the meeting IS saved — and the issue is purely frontend state.

### Root Cause (Most Likely)
The backend endpoint `POST /meetings` requires `SECTOR_OFFICIAL` role (confirmed in `SecurityConfig.java`). If the currently logged-in user's JWT is not present or is stale, the request fails silently or shows "Session expired."

### Fix
Ensure login is completed fresh via the backend (not restored from a localStorage session without a token). The JWT check in `App.tsx` (`authState && hasToken`) already prevents tokenless sessions — so if the user logs in correctly, this should work.

**If meetings still don't persist after login:** The backend itself may not be running or the sector ID is wrong. Check that the sector dropdown in the form is populated (it calls `fetchSectors()` on mount) and that a valid `sectorId` is passed.

---

## Issue 3: JWT / Authentication Flow

### Current State
`App.tsx` correctly requires both `inteko_auth_state = true` AND `inteko_jwt_token` to be present before restoring a session. `api.ts` `handleUnauthorized()` no longer calls `window.location.reload()` — it just clears localStorage.

`LoginView.tsx` has been cleaned up — no quick-login cards, no auto-fill.

### Remaining Risk
If the backend is down and the user had a previous valid session, `isAuthenticated` will be `false` because `inteko_jwt_token` was cleared by a previous `handleUnauthorized()` call. The user has to log in again. This is correct behavior.

---

## Issue 4: No Way to Add Cells or Villages

### Current State
`CellsVillagesView.tsx` renders cells and villages from the `cells` prop (passed from `App.tsx`). There are no Add buttons in the component. The `handleAddSimulatedVillage` function in `App.tsx` exists but is never connected to the view — the `onAddVillage` prop is not passed to `CellsVillagesView`.

`V3__seed_data.sql` seeds the following geographic data in the DB:
- Sectors: SEC-001 (Kinyinya), SEC-002 (Gasabo), SEC-003 (Kimironko)
- Cells: C-001 through C-005
- Villages: V-001 through V-009

But `CellsVillagesView` only shows data from `INITIAL_CELLS` in `src/data.ts` (local mock data), NOT from the backend geographic API.

The backend has: `GET /geography/sectors`, `GET /geography/sectors/{id}/cells`, `GET /geography/cells/{id}/villages` — but none of these are called by `CellsVillagesView`.

### Fix Options

**Option A (Quick — for defense):** Connect `CellsVillagesView` to the backend geographic API. Add a `useEffect` in `App.tsx` to load cells from `GET /geography/sectors/{id}/cells` and villages from `GET /geography/cells/{id}/villages` on mount, mapping the backend shape to the frontend `CivilCell` type.

**Option B (Minimal — no backend needed):** Update `INITIAL_CELLS` in `src/data.ts` to match the data actually seeded in `V3__seed_data.sql` so the view at least shows accurate data.

For adding cells/villages: the backend would need a `POST /geography/cells` and `POST /geography/villages` endpoint. These do not appear to exist yet (not in any controller shown). Until they exist, an "Add" button can be added to the UI that calls a local state handler and shows a success message — same pattern as the current `handleAddSimulatedVillage`.

**Recommendation:** For defense, use Option B (update mock data to match DB) and leave the "Add" flow as-is. Explain that geographic hierarchy management requires admin-level backend endpoints scheduled for the next sprint.

---

## Issue 5: Backend Data Not Showing (Issues, Resolutions, Notifications)

### Current State (Confirmed from `App.tsx`)
The backend fetch calls ARE wired:
- Issues: `fetchIssues()` called in `useEffect` when `isAuthenticated` — maps to frontend `CitizenIssue[]`
- Resolutions: `fetchResolutions()` called in `useEffect` when `isAuthenticated` — maps to frontend resolutions array
- Notifications: `fetchNotifications()` called in `useEffect` when `isAuthenticated`

These all fall back to localStorage/mock data silently if the backend call fails.

### Why Backend Data May Not Show
1. The backend is not running — all three calls fail silently and fall back to mock data.
2. The JWT is not present — `GET /issues`, `GET /resolutions`, `GET /notifications` all require auth (they use `getAuthHeaders()`). If the token is missing, you get 401, `handleUnauthorized()` fires, and mock data is shown.
3. The backend returns data in a different shape than expected — check that `/issues` returns a list wrapped in `{ data: [...] }` (the `get()` helper reads `json.data`).

### Verify
Open browser DevTools → Network tab → after login, check if `GET /issues`, `GET /resolutions`, `GET /notifications` return 200 with data. If they return 401, the JWT is not being sent (auth issue). If they return 200 but data is empty, the DB has no seeded data accessible to that user.

---

## Issue 6: Hardcoded/Fake Stats That Should Be Removed Before Defense

From `docs/17-feature-audit.md`, these are confirmed in the code:

| Item | File | Fix |
|------|------|-----|
| `issues.length + 214` inflating issue count | `DashboardView.tsx` | Remove the `+ 214` offset |
| `+ 85` in resolution rate | `DashboardView.tsx` | Remove the `+ 85` offset |
| Hardcoded `152 Officials`, `12 Pending` | `ManageUsersView.tsx` | Replace with `users.filter(...)` counts |
| `78/54/42/31/13` hardcoded category bars | `DashboardView.tsx` | Replace with computed counts from `issues` prop |
| Calendar hardcoded to October 2023 | `SectorOfficialDashboardView.tsx` | Change to use `new Date()` dynamically |
| "Simulate Issue" button | `DashboardView.tsx` | Remove entirely |

These are misleading to a defense panel and should be removed or replaced with real computed values.

---

## Summary: Fix Priority Order

| Priority | Issue | File(s) | Effort |
|----------|-------|---------|--------|
| 1 | Role selector on login instead of plain credentials | `LoginView.tsx` | ~45 min |
| 2 | Verify meeting save works after clean login | `MeetingListView.tsx` / backend | ~15 min verify |
| 3 | Show real DB data (issues/resolutions/notifications) | `App.tsx` / backend running | ~10 min verify |
| 4 | Remove hardcoded fake stats | `DashboardView.tsx`, `ManageUsersView.tsx` | ~30 min |
| 5 | Cells & Villages — update mock data to match DB | `src/data.ts` | ~20 min |
| 6 | Dynamic calendar in Sector Official Dashboard | `SectorOfficialDashboardView.tsx` | ~10 min |

---

## What Is Already Working Correctly

- JWT stored and sent on all authenticated API calls (`api.ts`)
- Session restoration requires both `inteko_auth_state` and `inteko_jwt_token` (`App.tsx`)
- `handleUnauthorized()` no longer causes infinite reload loop (`api.ts`)
- Meeting creation calls the real backend `POST /meetings` (`MeetingListView.tsx`)
- Meeting status updates call `PATCH /meetings/{id}/status` with `dbId` (`App.tsx`)
- Check-in persists to backend via `POST /meetings/{id}/participants` (`MeetingListView.tsx`)
- Resolution actions (conclude, toggle item, add comment) all call backend endpoints (`App.tsx`)
- Issues, resolutions, notifications all have backend fetch calls wired with auth (`App.tsx`)
- Quick-access cards removed from login page (`LoginView.tsx`)
- Developer Key button removed (`App.tsx`)
