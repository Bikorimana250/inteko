# Enum Mismatch Fix — Defense Ready
**Date:** July 14, 2026  
**Issue:** Database/Code Mismatch  
**Status:** IMMEDIATE FIX REQUIRED

---

## The Problem

**Error:** `No enum constant rw.gov.inteko.backend.entity.enums.MeetingStatus.Scheduled`

Your PostgreSQL database has meeting records with `status = 'Scheduled'` (mixed case), but the Java enum `MeetingStatus` expects `'SCHEDULED'` (uppercase).

This happened because:
1. You had existing data in PostgreSQL from before
2. The enum values were stored as mixed case (`Scheduled`, `Ongoing`, etc.)
3. The Java code expects uppercase (`SCHEDULED`, `ONGOING`, etc.)

---

## The Fix (2 Options)

### Option 1: Update Database (RECOMMENDED)

Run this SQL in your PostgreSQL database:

```sql
-- Update all meeting statuses to uppercase
UPDATE meetings SET status = 'SCHEDULED' WHERE status = 'Scheduled';
UPDATE meetings SET status = 'ONGOING' WHERE status = 'Ongoing';
UPDATE meetings SET status = 'COMPLETED' WHERE status = 'Completed';
UPDATE meetings SET status = 'POSTPONED' WHERE status = 'Postponed';
UPDATE meetings SET status = 'CANCELLED' WHERE status = 'Cancelled';
```

### Option 2: Clear Meetings Table (IF NO IMPORTANT DATA)

If you don't have important meeting data, just clear the table:

```sql
TRUNCATE TABLE meeting_participants CASCADE;
TRUNCATE TABLE meetings CASCADE;
```

Then restart the backend - `DevDataInitializer` will seed fresh data with correct enum values.

---

## How to Run the SQL

### Using pgAdmin
1. Open pgAdmin
2. Connect to your `inteko_db` database
3. Right-click on `inteko_db` → Query Tool
4. Paste the UPDATE commands
5. Click Execute (F5)

### Using psql Command Line
```bash
psql -U nelson -d inteko_db

# Then paste the UPDATE commands
UPDATE meetings SET status = 'SCHEDULED' WHERE status = 'Scheduled';
UPDATE meetings SET status = 'ONGOING' WHERE status = 'Ongoing';
UPDATE meetings SET status = 'COMPLETED' WHERE status = 'Completed';
UPDATE meetings SET status = 'POSTPONED' WHERE status = 'Postponed';
UPDATE meetings SET status = 'CANCELLED' WHERE status = 'Cancelled';

\q
```

---

## After Running SQL

1. **Restart backend** (it's already running, just needs a refresh)
   - Stop current process: Ctrl+C in the terminal
   - Start again: `mvn spring-boot:run` in backend directory

2. **Test the API:**
   ```bash
   # Should return 200 with meeting list (not 500)
   curl http://localhost:8080/api/v1/meetings
   ```

3. **Test login:**
   - Open frontend: http://localhost:3000
   - Login with: `admin@inteko.gov.rw` / `password123`
   - Should work without 500 error

---

## Why This Works

Java enums are case-sensitive. The PostgreSQL `status` column stores text, but Hibernate tries to match it exactly to the enum constant name:

- Database: `'Scheduled'` → ❌ No match
- Enum: `SCHEDULED` → ❌ No match
- **After fix:**
- Database: `'SCHEDULED'` → ✅ Perfect match
- Enum: `SCHEDULED` → ✅ Perfect match

---

## Verification

After the fix, check that meetings load:

```bash
curl http://localhost:8080/api/v1/meetings
```

Should return something like:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "meetingCode": "MTG-2024-001",
      "title": "Monthly Sector Assembly",
      "status": "SCHEDULED",
      ...
    }
  ],
  "errorCode": null,
  "message": null
}
```

---

## For Defense

This shows professional understanding of:
- Enum handling in JPA/Hibernate
- Database migrations and data integrity
- Troubleshooting production data issues

**If panel asks why this happened:**
> "This was a data migration issue where existing database records used mixed-case enum values before we standardized on uppercase in the Java application layer. We identified the mismatch through Hibernate's exception handling and corrected it with a targeted SQL UPDATE to ensure data consistency."
