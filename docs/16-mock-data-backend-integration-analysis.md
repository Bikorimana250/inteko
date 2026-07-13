# Mock Data & Backend Integration Analysis
**Date:** July 12, 2026  
**Defense:** Wednesday  
**Status:** Analysis Only — No Code Changes  

---

## Overview

The system currently has a split architecture: **meetings and attendance are fully backend-connected**, but **everything else uses frontend mock data** from `src/data.ts` stored in localStorage. The `APP_DATA_VERSION` fix we applied correctly clears stale localStorage — but this also wiped the mock data that was filling those pages, leaving them empty.

This document maps every data source across every page and proposes what to connect to the backend vs what to keep as-is.

---

## Full Data Source Inventory

### Page: Meeting List
**File:** `src/components/MeetingListView.tsx`  
**Data source:** `meetings` state from `App.tsx` → loaded via `fetchMeetings()` from `GET /meetings`  
**Status:** ✅ **FULLY CONNECTED TO BACKEND**  
**Notes:** `createMeeting()` calls `POST /meetings`, check-in calls `POST /meetings/{id}/participants`. All persisted. No mock data.

---

### Page: Attendance Summary (My Attendance Records)
**File:** `src/components/AttendanceSummaryView.tsx`  
**Data source:** `fetchAttendanceSummary()` → `GET /attendance/summary` → `AttendanceSummaryService`  
**Status:** ✅ **FULLY CONNECTED TO BACKEND**  
**Notes:** Reads from the DB. No localStorage or mock data involved.

---

### Page: Citizen Issues
**File:** Referenced in `App.tsx` as `IssueTrackingView`  
**Data source:** `issues` state from `App.tsx` → initialized from localStorage → falls back to `INITIAL_ISSUES` in `src/data.ts`  
**Status:** ❌ **MOCK DATA — NOT BACKEND CONNECTED**

`INITIAL_ISSUES` in `src/data.ts`:
```typescript
export const INITIAL_ISSUES: CitizenIssue[] = [
  { id: 'I-01', title: 'Road repair requests in Kacyiru', ... },
  { id: 'I-02', title: 'Land dispute boundary conflict', ... },
  { id: 'I-03', title: 'Clean water point breakdown', ... },
  { id: 'I-04', title: 'Irrigation equipment missing funding', ... }
];
```

After `APP_DATA_VERSION` clears localStorage, these mock issues are reloaded from `INITIAL_ISSUES` on fresh load — so they should still appear. If they disappeared, it's because `inteko_issues_registry` was cleared but the app re-initializes from `INITIAL_ISSUES` correctly.

**The backend has:** `IssueController` with `GET /issues`, `POST /issues`, `PATCH /issues/{id}/assign`, `PATCH /issues/{id}/resolve`. Issues seeded in `V3__seed_data.sql` (I-001 through I-004).

**What's missing in `src/api.ts`:**
```typescript
// NOT PRESENT:
export const fetchIssues = (): Promise<IssueApiResponse[]> => get<IssueApiResponse[]>('/issues');
```

---

### Page: Resolution Tracking
**File:** Referenced in `App.tsx` as `ResolutionTrackingView`  
**Data source:** `resolutions` state from `App.tsx` → initialized from localStorage → falls back to hardcoded array in `App.tsx` itself (not even in `data.ts`)  
**Status:** ❌ **MOCK DATA — NOT BACKEND CONNECTED**

The fallback in `App.tsx` is:
```typescript
const [resolutions, setResolutions] = useState<any[]>(() => {
  const saved = localStorage.getItem('inteko_resolutions_registry');
  if (saved) return JSON.parse(saved);
  return [
    { id: 'RES-012', title: 'Seedling Reforestation Directive', ... },
    { id: 'RES-005', title: 'Local Security Patrol Funding', ... }
  ];
});
```

After `APP_DATA_VERSION` clears localStorage but `inteko_resolutions_registry` is NOT cleared (only `inteko_users_registry` is cleared), this data should still be in localStorage. If it disappeared, it's because the localStorage clear was broader than intended.

**The backend has:** `ResolutionController` with `GET /resolutions`. Seeded in `V3__seed_data.sql`.

**What's missing in `src/api.ts`:**
```typescript
// NOT PRESENT:
export const fetchResolutions = (): Promise<ResolutionApiResponse[]> => get<ResolutionApiResponse[]>('/resolutions');
```

---

### Page: Notifications
**File:** Referenced in `App.tsx` as `NotificationCenterView`  
**Data source:** `notifications` state from `App.tsx` → `INITIAL_NOTIFICATIONS` in `src/data.ts`  
**Status:** ❌ **MOCK DATA — NOT BACKEND CONNECTED**

`INITIAL_NOTIFICATIONS` in `src/data.ts` has 5 hardcoded notifications.  
**The backend has:** `NotificationController` with `GET /notifications`. Seeded in `V3__seed_data.sql`.

---

### Page: Reports & Analytics
**File:** `src/components/ReportsAnalyticsView.tsx`  
**Data source:** `meetings` + `issues` + `users` passed as props from `App.tsx`  
**Status:** ⚠️ **PARTIALLY CONNECTED — uses frontend state**

- `meetings` → loaded from backend ✅
- `issues` → from localStorage/mock ❌
- `users` → from localStorage/mock ❌

The chart data (monthly participation index, sector resolution index) is **completely hardcoded** in `ReportsAnalyticsView.tsx`:
```tsx
// Hardcoded chart points — not from any data source:
<path d="M 10,180 L 60,150 L 120,165 L 180,120 L 240,140 L 300,90 L 360,70 L 420,110 L 485,45 ..." />

// Hardcoded sector percentages:
{ label: 'Gasabo Sector Index', value: 94.2 },
{ label: 'Kicukiro Sector Index', value: 88.0 },
{ label: 'Nyarugenge Sector Index', value: 75.1 },
{ label: 'Remera Sector Index', value: 92.0 },
```

The KPI cards (total meetings, avg attendance, resolution rate) DO compute from real data passed as props — but only as accurate as the `meetings`/`issues` state they receive.

---

### Page: User Management / Create User / Edit User
**File:** `ManageUsersView`, `CreateUserView`, `EditUserView`  
**Data source:** `users` state from `App.tsx` → `INITIAL_USERS` in `src/data.ts`  
**Status:** ❌ **MOCK DATA — NOT BACKEND CONNECTED**

`INITIAL_USERS` has 4 users. These are frontend-only.  
**The backend has:** `UserController` with `GET /users`, `POST /users` (admin only).

**Important:** When admin creates a user via the UI, it's added to frontend state only — never sent to the backend.

---

### Page: Cells & Villages
**File:** `CellsVillagesView`  
**Data source:** `cells` state from `App.tsx` → `INITIAL_CELLS` in `src/data.ts`  
**Status:** ❌ **MOCK DATA — NOT BACKEND CONNECTED**

`INITIAL_CELLS` has 5 cells with 9 villages.  
**The backend has:** `GeographicController` with `GET /geography/sectors`, `GET /geography/sectors/{id}/cells`, `GET /geography/cells/{id}/villages`. Seeded in `V3__seed_data.sql`.

---

### Page: Dashboard (Admin & Sector Official)
**File:** `DashboardView`, `SectorOfficialDashboardView`  
**Data source:** `meetings`, `issues`, `users`, `resolutions` all passed as props  
**Status:** ⚠️ **PARTIALLY CONNECTED** — meetings are real, rest is mock

---

### Page: Document Library
**File:** `src/components/DocumentLibraryView.tsx`  
**Data source:** `initialDocs` array hardcoded inside the component itself  
**Status:** ❌ **FULLY HARDCODED IN COMPONENT**

The documents don't use `src/data.ts` or localStorage at all — they are defined directly in the component as a `useState` initial value. No backend connection. No `GET /documents` call exists in `src/api.ts`.

**The backend has:** `DocumentController`. Seeded in `V3__seed_data.sql`.

---

## Why Data Disappeared After APP_DATA_VERSION Fix

The `APP_DATA_VERSION` check added to `App.tsx` only clears `inteko_users_registry`:

```typescript
const APP_DATA_VERSION = '2';
if (localStorage.getItem('inteko_data_version') !== APP_DATA_VERSION) {
  localStorage.removeItem('inteko_users_registry');
  localStorage.setItem('inteko_data_version', APP_DATA_VERSION);
}
```

This should NOT have cleared issues, resolutions, notifications, meetings, or cells. However, if the user manually cleared localStorage (as advised multiple times during debugging), ALL keys were wiped — including `inteko_issues_registry`, `inteko_resolutions_registry`, etc.

After a full localStorage clear:
- Issues → re-initializes from `INITIAL_ISSUES` ✅ (4 mock issues should appear)
- Resolutions → re-initializes from hardcoded array in `App.tsx` ✅ (2 mock resolutions should appear)
- Notifications → re-initializes from `INITIAL_NOTIFICATIONS` ✅ (5 mock notifications should appear)
- Meetings → fetched from backend ✅ (real meetings from DB)
- Users → re-initializes from `INITIAL_USERS` ✅ (4 mock users should appear)

**If data is still missing after a fresh load, it means either:**
1. The backend is returning an error that crashes the component
2. The `APP_DATA_VERSION` check is inadvertently running on every render (it shouldn't — it's inside the component body but outside `useState`, so it runs once per mount)

---

## What Needs to Be Fixed for Defense

### Priority 1: Issues, Resolutions, Notifications — Connect to Backend

These three are the most visible mock pages. The backend already has the data seeded. The fix requires:

1. **`src/api.ts`** — Add 3 fetch functions:
   - `fetchIssues()` → `GET /issues`
   - `fetchResolutions()` → `GET /resolutions`  
   - `fetchNotifications()` → `GET /notifications/unread` or `GET /notifications`

2. **`src/App.tsx`** — Replace localStorage fallback initialization with backend calls:
   ```typescript
   // Instead of localStorage → INITIAL_ISSUES:
   useEffect(() => {
     fetchIssues().then(setIssues).catch(() => {}); // keep local fallback on error
   }, []);
   ```

This will show the real seeded data from `V3__seed_data.sql` (I-001 through I-004, RES-001 through RES-003, N-001 through N-003) instead of the frontend mock arrays.

**Risk:** LOW — same pattern already used for meetings. Fallback to mock data if backend fails.

---

### Priority 2: Reports & Analytics — Fix Hardcoded Chart

**File:** `src/components/ReportsAnalyticsView.tsx`

The chart coordinates and sector percentages are hardcoded SVG values. For defense, these should at minimum be replaced with values computed from the real `meetings` prop data.

The KPI cards already compute correctly from props. The sector breakdown bars can be computed from the meetings data grouped by sector name.

**Risk:** LOW — only changes ReportsAnalyticsView, doesn't touch any other component.

---

### Priority 3: User Management — Connect to Backend (Optional)

`GET /users` exists in the backend. Connecting it would show the 7 seeded users instead of the 4 frontend mock users.

**Risk:** MEDIUM — the Create User form sends to local state only. If the list comes from the backend but creates go to local state, the newly created user won't appear in the list after refresh.

**Recommendation:** Connect the list fetch but keep creation local for now. Or skip entirely — not the most important demo path.

---

### Priority 4: Cells & Villages — Keep Mock (Skip)

`INITIAL_CELLS` is used by `CellsVillagesView`. The backend has geographic data but connecting it requires reworking the `CivilCell` type. Too risky for defense.

**Recommendation:** Keep mock data. Explain as "geographic hierarchy uses representative demonstration data."

---

## Files to Modify

| File | Change | Priority |
|------|--------|----------|
| `src/api.ts` | Add `fetchIssues()`, `fetchResolutions()`, `fetchNotifications()` | HIGH |
| `src/App.tsx` | Add `useEffect` calls to load issues, resolutions, notifications from backend on mount | HIGH |
| `src/components/ReportsAnalyticsView.tsx` | Replace hardcoded sector percentages with values computed from meetings prop | MEDIUM |
| `src/App.tsx` | Optionally add `fetchUsers()` call on mount | LOW |

**Total files:** 3  
**Estimated time:** 1.5 hours  
**Risk level:** LOW-MEDIUM  
**Backend restart required:** NO

---

## API Endpoint Mapping

These endpoints already exist in the backend and are compatible:

| Data | Backend Endpoint | Response | Auth Required |
|------|-----------------|----------|--------------|
| Issues | `GET /issues` | list of issues | Yes (authenticated) |
| Resolutions | `GET /resolutions` | list of resolutions | Yes (authenticated) |
| Notifications | `GET /notifications` | list of notifications | Yes (authenticated) |
| Users | `GET /users` | list of users | Yes (authenticated) |

All require a JWT token — these will use `getAuthHeaders()` from `api.ts` automatically via the `get()` helper.

---

## Type Mapping Needed

The frontend `CitizenIssue` type in `src/types.ts` is simple:
```typescript
{ id, title, category, status, reporter, time }
```

The backend `IssueResponse` will have more fields. The `fetchIssues()` function should map backend fields to the frontend type — same pattern used for meetings in `fetchMeetings()`.

Same applies for resolutions and notifications — the frontend `resolutions` state uses a local `any[]` type, so mapping is flexible.

---

## Summary for Defense

After these fixes, the data flow will be:

| Page | Data Source |
|------|------------|
| Meeting List | ✅ Backend DB |
| Attendance Summary | ✅ Backend DB |
| Citizen Issues | ✅ Backend DB (after fix) |
| Resolution Tracking | ✅ Backend DB (after fix) |
| Notifications | ✅ Backend DB (after fix) |
| Reports & Analytics | ✅ Computed from real meeting data |
| User Management | ⚠️ Backend list, local create |
| Cells & Villages | ❌ Mock data (acceptable) |
| Document Library | ❌ Mock data (acceptable) |

This gives 7/9 pages fully or mostly connected to the backend — strong enough for defense.
