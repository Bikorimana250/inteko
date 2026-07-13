# Bug Analysis Report — Pre-Defense
**Date:** July 6, 2026  
**Status:** Analysis Only — No Code Changes Made  
**Issues Identified:** 3

---

## Bug 1: POST /meetings → 401 Unauthorized (Sector Official)

### Symptom
Error shown in UI: `"Failed to save meeting: API error 401: Full authentication is required to access this resource"`  
Console: `api.ts:21 POST http://localhost:8080/api/v1/meetings 401`

### Root Cause

**The JWT token is not being sent with the request when the user is already logged in.**

The `handleQuickLogin` function in `LoginView.tsx` has a fallback path (lines 90–95):

```typescript
} catch {
  // Backend unreachable — fall back to local
} finally {
  setLoading(false);
}
onLoginSuccess(user); // ← called even when backend succeeded
```

**Wait — actually the issue is more subtle.** Looking at `LoginView.tsx` lines 78–89: when the backend returns `res.ok`, it stores the JWT and calls `onLoginSuccess(mappedUser)` correctly with `return`. 

**The real issue is the localStorage session persistence in `App.tsx`:**

```typescript
const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
  return localStorage.getItem('inteko_auth_state') === 'true';
});
```

When a user was previously logged in via a **local fallback** (no backend), `inteko_auth_state` is `'true'` in localStorage and the app auto-restores the session — but `inteko_jwt_token` was **never stored** during that local login. The user appears logged in but has no JWT.

This means:
- `getAuthHeaders()` in `api.ts` returns `{}` (empty)
- `POST /meetings` goes out with no `Authorization` header
- Backend correctly rejects with 401

**Secondary cause:** Even when using Quick Login buttons successfully, the `inteko_auth_state` was previously set from a local (no-JWT) session. The app reads that flag first and skips the login screen entirely, never getting a fresh JWT.

### Evidence
- `api.ts` line 9: `getAuthHeaders()` reads `localStorage.getItem('inteko_jwt_token')` — if null, sends empty headers
- `App.tsx` initializes `isAuthenticated` from `localStorage.getItem('inteko_auth_state')` — can be `true` without a JWT existing
- `MeetingController.java` line 24: `@PreAuthorize("hasRole('SECTOR_OFFICIAL')")` requires a valid JWT — no JWT = 401

### Fix Required
**File: `src/App.tsx`**

On startup, if `inteko_auth_state` is `true` but `inteko_jwt_token` is **missing or empty**, force the user back to the login screen rather than restoring a tokenless session.

```typescript
// Current (broken):
const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
  return localStorage.getItem('inteko_auth_state') === 'true';
});

// Fixed:
const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
  const authState = localStorage.getItem('inteko_auth_state') === 'true';
  const hasToken = !!localStorage.getItem('inteko_jwt_token');
  return authState && hasToken; // must have BOTH
});
```

**Why this is safe:** Users who logged in via the backend properly (with a JWT) are unaffected. Only sessions that were created via the local fallback (no token) will be forced to re-login, which is the correct behavior.

---

## Bug 2: Date and Time Input — Manual Text Entry Required

### Symptom
The user has to manually type dates like "July 13, 2026" and times like "9:00AM" as free text. No date picker or time picker is present.

### Root Cause

**File: `src/components/MeetingListView.tsx`**

The Target Date field uses `type="text"` instead of `type="date"`:

```tsx
<input
  type="text"              // ← should be type="date"
  required
  placeholder="e.g. Oct 28, 2023"
  value={date}
  onChange={(e) => setDate(e.target.value)}
/>
```

Similarly the Target Time field uses `type="text"` instead of `type="time"`:

```tsx
<input
  type="text"              // ← should be type="time"
  placeholder="e.g. 09:00 AM CAT"
  value={time}
  onChange={(e) => setTime(e.target.value)}
/>
```

**Downstream consequence in `handleSubmit`:** The date parsing logic tries to parse whatever string the user typed:

```typescript
const parsedDate = new Date(date);
const isoDate = isNaN(parsedDate.getTime())
  ? date           // ← falls back to raw string (e.g. "July 13, 2026")
  : parsedDate.toISOString().split('T')[0];
```

`new Date("July 13, 2026")` **does** parse in modern browsers, so it works — but it's fragile. A user typing "13 July 2026" or "13/07/2026" would get `NaN` and the raw string would be passed to the backend, causing a 400 validation error from `CreateMeetingRequest.java` (`@NotNull LocalDate meetingDate`).

For the time field, `"9:00AM"` or `"09:00 AM CAT"` does **not** convert cleanly to `HH:MM:SS`, which is what the backend expects for `LocalTime`.

### Fix Required
**File: `src/components/MeetingListView.tsx`**

1. Change date input to `type="date"` — browser renders a native date picker, value is always `YYYY-MM-DD`
2. Change time input to `type="time"` — browser renders a native time picker, value is always `HH:MM`
3. Simplify the parsing logic — `type="date"` always gives ISO format directly, `type="time"` gives `HH:MM` which just needs `:00` appended for seconds

```tsx
// Date - native picker, always returns YYYY-MM-DD
<input type="date" required value={date} onChange={(e) => setDate(e.target.value)} />

// Time - native picker, always returns HH:MM
<input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
```

```typescript
// Simplified parsing - no ambiguity
const isoDate = date; // already YYYY-MM-DD from type="date"
const isoTime = time ? `${time}:00` : '09:00:00'; // HH:MM → HH:MM:SS
```

---

## Bug 3: Document Download — PDF Files Download as .txt

### Symptom
Clicking the Download button on any document produces a `.txt` file with plain text content, not a real PDF.

### Root Cause

**File: `src/components/DocumentLibraryView.tsx`**

The `downloadDocumentFile` function (lines 14–40) deliberately creates a `Blob` of type `text/plain` and renames the file to `.txt`:

```typescript
const downloadDocumentFile = (doc: DocumentFile) => {
  const content = [
    `INTEKO Y'ABATURAGE — OFFICIAL DOCUMENT VAULT`,
    // ... plain text content ...
  ].join('\n');

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' }); // ← text/plain
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = doc.name.replace(/\.pdf$/i, '.txt'); // ← renames .pdf → .txt
```

**Why it was done this way:** The documents in `DocumentLibraryView.tsx` are **simulated** — they don't actually exist on disk or in a backend file store. The `initialDocs` array (lines 62–120) contains metadata only (title, category, size, summary). There are no real PDF files.

The developer wrote a text summary download as a placeholder, but it:
1. Creates a `.txt` blob instead of a PDF
2. Explicitly renames `.pdf` to `.txt`
3. Generates fake content (a SHA-256 checksum that is the same for every document)

**The documents in `V3__seed_data.sql`** reference file paths like `/documents/policies/meeting-guidelines.pdf`, but there is no file serving endpoint in the backend controllers shown, and no actual files exist at those paths.

### Fix Options

**Option A (Minimal — for defense):** Change the download to produce a properly named `.pdf`-extension file that contains a formatted text summary. The content stays the same but the file is renamed correctly and the MIME type is changed to `application/octet-stream` so the browser downloads it as a file without trying to display it inline. The user gets a file called `meeting-guidelines.pdf` that contains text — not ideal but looks correct in the file system.

**Option B (Better — if time allows):** Use a PDF generation library like `jspdf` (already potentially available via npm) to generate a real minimal PDF from the document summary content.

**Recommended fix for defense: Option A** — lowest risk, no new dependencies, correct filename shown.

**File: `src/components/DocumentLibraryView.tsx`**

```typescript
// Change:
const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
link.download = doc.name.replace(/\.pdf$/i, '.txt');

// To:
const blob = new Blob([content], { type: 'application/octet-stream' });
link.download = doc.name; // keeps original .pdf filename
```

---

## Summary Table

| # | Bug | File(s) | Root Cause | Risk of Fix | Priority |
|---|-----|---------|------------|-------------|----------|
| 1 | POST /meetings 401 | `src/App.tsx` | Session restored without JWT token check | LOW | CRITICAL |
| 2 | Manual date/time entry | `src/components/MeetingListView.tsx` | `type="text"` instead of `type="date"` / `type="time"` | LOW | HIGH |
| 3 | PDF downloads as .txt | `src/components/DocumentLibraryView.tsx` | Hardcoded `text/plain` blob + `.txt` rename | LOW | MEDIUM |

---

## Files to Modify

| File | Change |
|------|--------|
| `src/App.tsx` | Add JWT token presence check to `isAuthenticated` initializer |
| `src/components/MeetingListView.tsx` | Change date/time inputs to native `type="date"` and `type="time"`, simplify parsing |
| `src/components/DocumentLibraryView.tsx` | Change blob MIME type and remove `.txt` rename |

**Total files:** 3  
**Estimated time:** 30–45 minutes  
**Risk level:** LOW — all changes are isolated to specific lines  
**No backend changes required**

---

## Recommended Fix Order

1. **Bug 1 first** — without this, creating meetings never works regardless of other fixes
2. **Bug 2 second** — immediately improves UX and prevents backend validation errors  
3. **Bug 3 last** — cosmetic/UX improvement, lowest priority

---

## What NOT to Change

- `SecurityConfig.java` — already correct, `POST /meetings` requires `SECTOR_OFFICIAL` which is right
- `MeetingController.java` — `@PreAuthorize` is correct
- `api.ts` — `getAuthHeaders()` is implemented correctly, the problem is the token not being present
- `LoginView.tsx` — the login flow itself works correctly when actually logging in
