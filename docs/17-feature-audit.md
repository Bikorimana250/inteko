# Feature Audit — Frontend vs Backend
**Date:** July 13, 2026
**Purpose:** Identify gaps between frontend and backend for defense prep

---

## Frontend-Only Features (No Backend Support) — TO REMOVE OR FLAG

| Feature | File | Issue |
|---------|------|-------|
| "Simulate Issue" button on Admin dashboard | `DashboardView.tsx` | Creates fake local issue with random data — no backend call |
| "Add Village" button in Cells & Villages | `CellsVillagesView.tsx` | Adds a local fake village — no backend call |
| Bulk CSV import UI in User Management | `ManageUsersView.tsx` | Simulates bulk import with fake log message — no actual import |
| Hardcoded issue category bars on Admin dashboard | `DashboardView.tsx` | 78/54/42/31/13 values are hardcoded, not from DB |
| `issues.length + 214` in KPI card | `DashboardView.tsx` | Hardcoded offset inflating issue count |
| Hardcoded `+ 85` resolved issues in resolution rate | `DashboardView.tsx` | Same — fake number padding |
| `152 Officials`, `12 Pending` in ManageUsers header | `ManageUsersView.tsx` | Hardcoded stats not from backend |
| Calendar in SectorOfficialDashboard shows Oct 2023 dates | `SectorOfficialDashboardView.tsx` | Hardcoded to October 2023, not dynamic |
| Meeting status update (Ongoing/Completed/Postponed) | `App.tsx` → `MeetingListView.tsx` | `handleUpdateMeetingStatus` only updates local state — `PATCH /meetings/{id}/status` exists but is never called |
| Meeting creation | `App.tsx` + `MeetingListView.tsx` | `createMeeting()` API exists and is imported in `api.ts` but `handleAddSimulatedMeeting` in `App.tsx` still uses local state only — this is why created meetings don't persist |
| Toggle user status / delete user | `ManageUsersView.tsx` | Frontend-only — `PATCH /users/{id}/status` and `DELETE /users/{id}` exist in backend |
| Edit user | `EditUserView.tsx` | Frontend-only — `PUT /users/{id}` exists in backend |
| Resolution: approve & close | `ResolutionDetailsView.tsx` | Calls `onApproveAndClose` which only updates local state — `PATCH /resolutions/{id}/conclude` exists |
| Resolution: toggle action item | `ResolutionDetailsView.tsx` | Calls `onToggleActionItem` which updates local array — `PATCH /resolutions/{id}/action-item/{itemId}/toggle` exists |
| Resolution: add comment | `ResolutionDetailsView.tsx` | Calls `onAddComment` which updates local array — `POST /resolutions/{id}/comments` exists |

---

## Backend Features Not in Frontend — TO IMPLEMENT

| Feature | Backend Endpoint | Frontend Action |
|---------|-----------------|-----------------|
| Persist meeting status change | `PATCH /meetings/{id}/status` | Wire `handleUpdateMeetingStatus` to call backend (needs `dbId`) |
| Persist meeting creation | `POST /meetings` | `createMeeting()` already in `api.ts` — `App.tsx` `handleAddSimulatedMeeting` must call it instead of local state |
| Conclude resolution | `PATCH /resolutions/{id}/conclude` | Wire approve button in `ResolutionDetailsView` |
| Toggle resolution action item | `PATCH /resolutions/{id}/action-item/{itemId}/toggle` | Wire checkbox in `ResolutionDetailsView` |
| Add resolution comment | `POST /resolutions/{id}/comments` | Wire comment form in `ResolutionDetailsView` |
| Document library from DB | `GET /documents` | `DocumentLibraryView` uses hardcoded `initialDocs` array — should call `GET /documents` |

---

## Critical Bug: Meeting Not Saved to DB

**Root cause:** `handleAddSimulatedMeeting` in `App.tsx` never calls `createMeeting()` from `api.ts`. It just does `setMeetings(prev => [newMtg, ...prev])`.

**Fix:** Replace `handleAddSimulatedMeeting` with a call to `createMeeting()` and refresh meetings from backend after.

Similarly `handleUpdateMeetingStatus` only calls `setMeetings(...)` — it must also call `PATCH /meetings/{id}/status` using the meeting's `dbId`.

---

## What to Remove (Frontend-Only Fake Features)

These should be removed before defense — they are misleading:

1. `+ 214` and `+ 85` offsets in `DashboardView.tsx` KPI cards
2. Hardcoded `78/54/42/31/13` issue category breakdown bars in `DashboardView.tsx`
3. Hardcoded `152 Officials`, `12 Pending` stats in `ManageUsersView.tsx`
4. "Simulate Issue" button in `DashboardView.tsx`
5. "Add Village" button in `CellsVillagesView.tsx` (creates fake local village)
6. Fake bulk import simulation in `ManageUsersView.tsx`
7. Calendar hardcoded to October 2023 in `SectorOfficialDashboardView.tsx`

---

## Summary

| Category | Count |
|----------|-------|
| Frontend-only fake features to remove | 7 |
| Frontend actions that need backend wiring | 6 |
| Critical bug (meetings not persisting) | 1 |
