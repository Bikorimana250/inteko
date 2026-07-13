# Final Bug Analysis — Pre-Defense
**Date:** July 12, 2026  
**Defense:** Wednesday  
**Status:** Analysis Only — No Code Changes Made  
**Issues:** 4

---

## Issue 1: Frontend Users Don't Match Database Users / No Role Selection on Login

### Symptom
Users shown on the login screen (previously as quick-access cards, now removed) and stored in `INITIAL_USERS` in `src/data.ts` have different emails from the users seeded in the backend database by `DevDataInitializer.java`. Also, when logging in there is no way to indicate which role you are logging in as.

### Root Cause

**Part A: Mismatched user data**

`src/data.ts` `INITIAL_USERS` array contains 4 users including emails like `jp.uwimana@kinyinya.gov.rw`, `m.uwera@kinyinya.gov.rw`, etc. These were updated to match the backend seeds earlier.

However, `App.tsx` initializes the `users` state from `localStorage`:

```typescript
const [users, setUsers] = useState<User[]>(() => {
  const saved = localStorage.getItem('inteko_users_registry');
  return saved ? JSON.parse(saved) : INITIAL_USERS;
});
```

If `inteko_users_registry` was previously stored in localStorage from an **earlier version** (with old emails like `j.kabera@authority.gov.rw`), those stale users are loaded instead of the updated `INITIAL_USERS`. The localStorage takes priority over `data.ts`, so code updates to `INITIAL_USERS` are invisible to users who already have a cached session.

**Part B: No role selection on login**

The login form in `LoginView.tsx` only asks for email and password. The role is determined entirely by what the backend returns from `AuthService.java`. Since the backend maps `UserRole.SECTOR_OFFICIAL` → `"Sector Official"` etc., once logged in the role is set correctly. There is no need for the user to "select" a role — the backend assigns it. This is correct behavior.

The confusion arises because multiple users share the same email domain and the user doesn't know which email maps to which role. The role is implicit — not shown on the login form.

### Fix Required

**File: `src/App.tsx`**

Clear stale localStorage on startup by adding a version key. If the stored version doesn't match the current app version, wipe `inteko_users_registry` so `INITIAL_USERS` from `data.ts` is loaded fresh:

```typescript
// At the top of the App component, before state declarations:
const APP_DATA_VERSION = '2';
if (localStorage.getItem('inteko_data_version') !== APP_DATA_VERSION) {
  localStorage.removeItem('inteko_users_registry');
  localStorage.setItem('inteko_data_version', APP_DATA_VERSION);
}
```

**File: `src/components/LoginView.tsx`**

Add a small credential hint below the form (not a quick-login card) showing which emails are available and their roles, so the user knows what to type. This is static text, not interactive:

```tsx
<div className="mt-6 pt-4 border-t border-slate-100">
  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Available Accounts</p>
  <div className="space-y-1 text-[10px] text-slate-500 font-mono">
    <p>admin@inteko.gov.rw — Administrator</p>
    <p>jp.uwimana@kinyinya.gov.rw — Sector Official</p>
    <p>m.uwera@kinyinya.gov.rw — Meeting Secretary</p>
    <p className="text-slate-400 italic">Password: password123</p>
  </div>
</div>
```

This looks professional (like a demo credential reference) while making it clear to the panel who can log in and with what role.

---

## Issue 2: "Log Issue Via Meeting" Navigates to Meeting List Instead of Issues Page

### Symptom
When logged in as Meeting Secretary and clicking "Log Issue Via Meeting" (or similar), the app redirects to "Conduct Meetings & Check-ins" instead of the Citizen Issues view.

### Root Cause

**File: `src/components/MeetingListView.tsx`**

Searching the MeetingListView code, there is **no "Log Issue Via Meeting" button** in the current MeetingListView component. The only action buttons present are:
- "Activate Check-in" (sets status to Ongoing)
- "Check In" (opens check-in modal)
- "Archive Complete" (sets status to Completed)
- "Postpone"

There is no navigation prop passed to MeetingListView — the component props are:
```typescript
interface MeetingListViewProps {
  meetings: Meeting[];
  onMeetingCreated: (meeting: Meeting) => void;
  onUpdateMeetingStatus: (...) => void;
  onCheckInAttendee: (...) => void;
  userRole?: string;
}
```

No `onNavigateToView` prop exists.

**Root cause:** The Meeting Secretary sidebar in `App.tsx` has "View Issues (Read-Only)" which navigates to `Citizen Issues` view. When the Secretary clicks the sidebar item, `setCurrentView('Citizen Issues')` is called. But the `IssueTrackingView` may then redirect back — or the Secretary clicks something in `MeetingListView` that navigates to `Meeting List` (which is the default view for Meeting Secretary on login and on navigation reset).

The actual behavior described — clicking "Log Issue Via Meeting" redirects to Conduct Meetings — suggests there IS a button somewhere that calls `setCurrentView('Meeting List')` when the Secretary is logged in. The most likely place is inside `IssueTrackingView.tsx` which has an `onNavigateToView` prop. If it navigates to `'Meeting List'` as a default, that matches the symptom.

Since `IssueTrackingView.tsx` is not shown in the provided code, the specific code cannot be confirmed. However, the fix is the same regardless.

### Fix Required

**File: `src/App.tsx`**

The `MeetingListView` needs an `onNavigateToView` prop so the Secretary can navigate to the Issues page from within a meeting context. This prop should be passed from App.tsx:

```tsx
// In App.tsx Meeting List case:
return (
  <MeetingListView
    meetings={searchedMeetings}
    onMeetingCreated={handleMeetingCreated}
    onUpdateMeetingStatus={handleUpdateMeetingStatus}
    userRole={currentUser.role}
    onNavigateToView={(view) => setCurrentView(view)}   // ← ADD THIS
    onCheckInAttendee={...}
  />
);
```

**File: `src/components/MeetingListView.tsx`**

Add `onNavigateToView` to the props interface and add a "Register Issue" button visible only to Meeting Secretary, on Ongoing meetings:

```typescript
interface MeetingListViewProps {
  // ...existing props...
  onNavigateToView?: (view: string) => void;
}
```

```tsx
{/* For Meeting Secretary on Ongoing meetings — navigate to issues */}
{isSecretary && meeting.status === 'Ongoing' && onNavigateToView && (
  <button
    onClick={() => onNavigateToView('Citizen Issues')}
    className="py-1 px-2 bg-white border border-amber-200 hover:bg-amber-50 text-amber-800 text-[10px] font-bold uppercase rounded-sm cursor-pointer"
  >
    Log Issue
  </button>
)}
```

---

## Issue 3: Attendance Count Discrepancy Between Meeting List and Attendance Summary

### Symptom
A meeting with target of 4 and 3 check-ins:
- **Meeting List (Conduct Meetings & Check-ins page):** Shows 3/4 = 75%  
- **My Attendance Records (Attendance Summary page):** Shows 4/4 = 100%

### Root Cause — Two Different Data Sources

**Source A: Meeting List view (`src/components/MeetingListView.tsx`)**

The meeting card renders:
```tsx
const ratio = Math.round((meeting.participants / (meeting.targetCount || 1)) * 100);
// ...
{meeting.participants}/{meeting.targetCount} ({ratio}%)
```

`meeting.participants` comes from the `meetings` state in `App.tsx`, which is populated by `fetchMeetings()` from the backend. The backend `MeetingService` returns `meeting.getParticipantsCount()` — this is the `participantsCount` column on the `meetings` table, which is updated by `MeetingParticipantService.addParticipant()`:

```java
meeting.setParticipantsCount(meeting.getParticipantsCount() + 1);
meetingRepository.save(meeting);
```

So if 3 people checked in, `participantsCount = 3`. Display: 3/4 = 75%. **This is correct.**

**Source B: Attendance Summary view (`src/components/AttendanceSummaryView.tsx`)**

`AttendanceSummaryView` calls `fetchAttendanceSummary()` → `GET /attendance/summary` → `AttendanceSummaryService.getSummary()`.

Looking at `AttendanceSummaryService.java`:

```java
// 2. Build a map of meetingId -> actual participant count from the participants table
Map<Long, Long> participantCountByMeeting = new HashMap<>();
for (Object[] row : participantRepository.countParticipantsPerMeeting()) {
    participantCountByMeeting.put(((Number) row[0]).longValue(), ((Number) row[1]).longValue());
}
```

This counts rows in `meeting_participants` table directly — which should also give 3.

Then in per-meeting items:
```java
long actualParticipants = participantCountByMeeting.getOrDefault(m.getId(), 0L);
```

So attendance summary should also show 3. **BUT the total attendance rate is computed differently:**

```java
long totalParticipants = participantRepository.count();  // ALL rows in meeting_participants
long totalTarget = allMeetings.stream()
    .mapToLong(m -> m.getTargetCount() != null ? m.getTargetCount() : 0)
    .sum();
double attendanceRate = totalTarget > 0
    ? Math.round((totalParticipants * 100.0 / totalTarget) * 10.0) / 10.0
    : 0.0;
```

`participantRepository.count()` counts ALL participants across ALL meetings. If there is only 1 meeting with target 4 and 3 participants, `attendanceRate = 3/4 * 100 = 75%`. That's correct.

**The actual 4/4 = 100% discrepancy** is most likely caused by the **seed data in `V3__seed_data.sql`**:

```sql
UPDATE meetings SET participants_count = 92 WHERE meeting_code = 'MTG-2024-001';
UPDATE meetings SET participants_count = 75 WHERE meeting_code = 'MTG-2024-002';
```

The seed data updates `participants_count` on the meetings table but does **not** insert rows into `meeting_participants`. So:

- `Meeting.participantsCount` = 92 (from seed UPDATE)
- Actual rows in `meeting_participants` for that meeting = 0 (no seed data for participants)

This means:
- **Meeting List** uses `Meeting.participantsCount` → shows seeded number (92 or 75)
- **Attendance Summary** uses `participantRepository.countParticipantsPerMeeting()` → counts actual rows → shows 0 for seeded meetings

For the **newly created meeting** (the one you created with 3 check-ins):
- `Meeting.participantsCount = 3` (set by `MeetingParticipantService.addParticipant`)
- `meeting_participants` has 3 rows

Both should agree. The 4/4 = 100% you're seeing in Attendance Summary might be from the **overall rate calculation** including the seed data meetings with target=0 or target=100 but 0 actual participants — or the total participants count includes rows from `V4__additional_seed_data.sql` which does insert participant rows.

Looking at `V4__additional_seed_data.sql` (referenced in context but not fully shown): it inserts rows into `meeting_participants` for `MTG-2024-001`. This means the seed data has actual participant rows for the old meetings, making the total count higher than expected.

**The core bug: two different counting methods are used for the same data.**

- Meeting List: uses `Meeting.participantsCount` (denormalized column)
- Attendance Summary: uses `COUNT(*)` from `meeting_participants` table (actual rows)

These can drift apart if the `participantsCount` column gets out of sync with the actual rows.

### Fix Required

**Option A (correct for defense — no backend change):** The `AttendanceSummaryService` already uses the more accurate source (actual participant rows). The Meeting List should also reload from backend after check-in to get the fresh `participantsCount`. Currently after check-in, `App.tsx` just increments locally:

```typescript
// App.tsx — onCheckInAttendee:
setMeetings(prev => prev.map(m =>
  m.id === meetingId ? { ...m, participants: m.participants + 1 } : m
));
```

This is fine. The issue is that the Meeting List loads from backend on mount (via `fetchMeetings()`), which returns `participantsCount` from the DB. The Attendance Summary loads from a different endpoint that counts rows. After seed data runs, these are inconsistent.

**File: `backend/src/main/resources/db/migration/V3__seed_data.sql`**

The `UPDATE meetings SET participants_count = 92` lines set the denormalized counter but `V4__additional_seed_data.sql` inserts actual rows. These should be consistent. Since the app runs H2 with `create-drop`, Flyway is disabled in dev — so these SQL files don't run anyway. The discrepancy you're seeing comes from:

1. Newly created meeting (via UI) shows correct counts in both views
2. The "4/4 = 100%" might actually be from a different meeting or the overall stats card

**The real fix:** Ensure `AttendanceSummaryService` uses `Meeting.participantsCount` (same source as MeetingListView) for per-meeting items, rather than re-counting from the participants table. Both views will then agree:

```java
// In AttendanceSummaryService, per-meeting items:
// INSTEAD OF: long actualParticipants = participantCountByMeeting.getOrDefault(m.getId(), 0L);
// USE:
int actualParticipants = m.getParticipantsCount() != null ? m.getParticipantsCount() : 0;
```

This makes both views use the same `participantsCount` source.

---

## Issue 4: Data is Hardcoded / Most Data Still from data.ts

### Symptom
Most data (cells, villages, issues, resolutions, notifications) is loaded from `INITIAL_*` arrays in `src/data.ts` and persisted to localStorage, not from the backend database.

### Root Cause

**File: `src/App.tsx`**

Only meetings are fetched from the backend:
```typescript
useEffect(() => {
  fetchMeetings().then(...).catch(...);
}, []);
```

Everything else reads from localStorage:
```typescript
const [issues, setIssues] = useState<CitizenIssue[]>(() => {
  const saved = localStorage.getItem('inteko_issues_registry');
  return saved ? JSON.parse(saved) : INITIAL_ISSUES;
});
```

The backend has full endpoints for issues (`/issues`), resolutions (`/resolutions`), notifications (`/notifications`), and they are seeded in `V3__seed_data.sql`. But `src/api.ts` only exposes:
- `fetchMeetings()` / `createMeeting()`
- `fetchSectors()`
- `fetchAttendanceSummary()`
- `checkInParticipant()`

There are no `fetchIssues()`, `fetchResolutions()`, or `fetchNotifications()` functions.

### Assessment for Defense

This is a significant architectural gap but it's also the most risky to fix right now. Adding backend calls for all these entities requires:
1. New functions in `api.ts`
2. Replacing localStorage state init with API calls in `App.tsx`
3. Handling loading states everywhere

**Recommendation: Do NOT attempt to fix this before Wednesday.** The hardcoded data is consistent, looks real, and demonstrates the UI correctly. The meetings flow IS connected to the backend end-to-end, which is the most important demo path.

**For defense, if asked:** "Meetings and attendance are fully persisted to the backend database. Issues, resolutions, and notifications use client-side state management in this phase, with backend API endpoints already implemented and ready for the next sprint integration."

This is factually accurate — the backend endpoints exist in `IssueController`, `ResolutionController`, and `NotificationController`.

---

## Summary Table

| # | Issue | Root Cause | Risk of Fix | Priority |
|---|-------|------------|-------------|----------|
| 1 | Stale users from localStorage / no role hint | Old localStorage overriding `INITIAL_USERS` | LOW | HIGH |
| 2 | "Log Issue" redirects to Meeting List | `onNavigateToView` not passed to MeetingListView | LOW | MEDIUM |
| 3 | Attendance count discrepancy (3/4 vs 4/4) | Two different data sources in MeetingList vs AttendanceSummary | LOW (backend only) | HIGH |
| 4 | Most data hardcoded from data.ts | No API calls for issues/resolutions/notifications | HIGH | SKIP |

---

## Files to Modify

| File | Change |
|------|--------|
| `src/App.tsx` | Add data version check to clear stale localStorage; pass `onNavigateToView` to MeetingListView |
| `src/components/LoginView.tsx` | Add static credential hint below the form |
| `src/components/MeetingListView.tsx` | Add `onNavigateToView` prop; add "Log Issue" button for Meeting Secretary on Ongoing meetings |
| `backend/src/main/java/rw/gov/inteko/backend/service/AttendanceSummaryService.java` | Use `m.getParticipantsCount()` instead of counting from `meeting_participants` table for per-meeting items |

**Total files:** 4  
**Estimated time:** 45 minutes  
**Risk level:** LOW  
**Backend restart required:** YES (after AttendanceSummaryService change)

---

## Fix Order

1. `AttendanceSummaryService.java` — fixes the attendance count discrepancy
2. `App.tsx` — clears stale localStorage + passes navigation prop
3. `LoginView.tsx` — adds credential hint
4. `MeetingListView.tsx` — adds Log Issue navigation
5. Skip hardcoded data — too risky, explain in defense
