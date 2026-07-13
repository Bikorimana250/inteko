# Bug Report: Phone Number Validation Failure on User Creation
**Date:** July 13, 2026
**Status:** Analysis + Fix Identified
**Severity:** HIGH — blocks user creation entirely

---

## Symptom

When creating a user via the Create User form, the backend returns HTTP 400:

```
Validation failed for field 'phone': rejected value [0791245679]
Invalid Rwanda phone number format
```

The frontend shows:
> "Account saved locally but backend sync failed: API error 400: ... Invalid Rwanda phone number format"

The user is added to the frontend state but NOT saved to the database, so they cannot log in.

---

## Root Cause

**File: `backend/src/main/java/rw/gov/inteko/backend/dto/request/CreateUserRequest.java`**

The `phone` field has a `@ValidRwandaPhone` custom validation annotation:

```java
@ValidRwandaPhone
@NotBlank(message = "Phone number is required")
private String phone;
```

The validator rejects `0791245679` because it does not match the required international format. Looking at `V3__seed_data.sql`, every seeded phone number uses the `+250XXXXXXXXX` format:

```sql
'+250788123456'
'+250788234567'
'+250788345678'
```

**File: `src/components/CreateUserView.tsx`**

The phone input field has no format hint and no client-side normalization:

```tsx
<input
  type="text"
  required
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  placeholder="+250 788 123 456"
/>
```

The placeholder already shows the correct format (`+250 788 123 456`), but:
1. There is no validation message if the user types a local number like `0791245679`
2. There is no automatic normalization (e.g., converting `07XXXXXXXX` → `+25007XXXXXXXX`)
3. The error only surfaces after the backend rejects the request

---

## What `@ValidRwandaPhone` Likely Accepts

Based on the seed data pattern and the rejection of `0791245679`, the validator requires one of:
- `+250XXXXXXXXX` (international format with country code)
- Possibly `250XXXXXXXXX` (without the `+`)

It does **not** accept:
- `07XXXXXXXXX` (local format without country code)
- Numbers with spaces like `+250 788 123 456` — unclear, but the placeholder uses spaces so it likely strips them or accepts them

---

## Fix

**File: `src/components/CreateUserView.tsx`**

Two changes:

1. Update the placeholder to be unambiguous: `+250788123456`
2. Add client-side normalization in the `handleSubmit` before calling `onSaveUser` — if the user types `07XXXXXXXX`, prepend `+25` to convert it to `+2507XXXXXXXX`
3. Add a format hint label below the field

```tsx
// Normalize phone before submission
const normalizePhone = (raw: string): string => {
  const stripped = raw.replace(/\s+/g, ''); // remove all spaces
  if (stripped.startsWith('07') || stripped.startsWith('08')) {
    return '+25' + stripped; // 07... → +2507...
  }
  if (stripped.startsWith('250') && !stripped.startsWith('+')) {
    return '+' + stripped; // 250... → +250...
  }
  return stripped; // already +250... or other
};

// In handleSubmit, before calling onSaveUser:
const normalizedPhone = normalizePhone(phone);
onSaveUser({ ..., phone: normalizedPhone }, password);
```

This is the lowest-risk fix — no backend changes, no schema changes. The normalization runs only on the frontend before the API call.

---

## Files to Modify

| File | Change |
|------|--------|
| `src/components/CreateUserView.tsx` | Add `normalizePhone()` helper, call it in `handleSubmit`, update placeholder and add format hint |

**Backend change required:** NO  
**Risk level:** LOW — isolated to `CreateUserView.tsx` submit handler  
**Estimated time:** 5 minutes

---

## Verification

After the fix, test with:
- `0791245679` → should be sent as `+250791245679` ✅
- `+250788123456` → unchanged ✅
- `250788123456` → should be sent as `+250788123456` ✅
- `+250 788 123 456` → spaces stripped → `+250788123456` ✅
