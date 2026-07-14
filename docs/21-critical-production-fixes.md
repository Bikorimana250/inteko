# Critical Production Fixes — Defense Ready
**Date:** July 13, 2026  
**Defense:** Tomorrow  
**Status:** CRITICAL — Backend Not Starting  
**Root Causes Identified:** 3

---

## CRITICAL ISSUE: Backend Won't Start — Flyway Migration Conflict

### Error Message
```
Error creating bean with name 'flywayInitializer': Found more than one migration with version 5
Offenders:
-> V5__fix_password_hashes.sql (SQL)
-> V5__fix_missing_audit_columns.sql (SQL)
```

### Root Cause
Flyway found TWO migration files with version V5 in `target/classes/db/migration`. This happens because:
1. You renamed `V5__fix_password_hashes.sql` to `V6__fix_password_hashes.sql` in the source directory
2. But the OLD compiled version (`V5__fix_password_hashes.sql`) is still in `target/classes`
3. Maven didn't clean the old file, so both versions exist in the compiled directory

### Fix — IMMEDIATE (5 minutes)
**File: Command line**

```bash
# Clean the target directory to remove old compiled migrations
cd backend
mvn clean

# Then rebuild and start
mvn spring-boot:run
```

This will remove ALL compiled files from `target/classes` and force a fresh build with only the current migration files.

---

## ROOT CAUSE: Why Data Doesn't Persist (H2 vs PostgreSQL)

### Current Situation Analysis

Looking at your configuration:

**`backend/.env`:**
```
DATABASE_URL=jdbc:postgresql://localhost:5432/inteko_db
DATABASE_USERNAME=nelson
DATABASE_PASSWORD=nelson
```

**`application.yml`:**
```yaml
profiles:
  active: ${SPRING_PROFILES_ACTIVE:postgres}  # Defaults to postgres
```

**Your backend IS configured for PostgreSQL by default.**

The issue is NOT that you're using H2 — you're actually trying to use PostgreSQL, but:

1. **PostgreSQL is not running** on your machine, OR
2. **Database `inteko_db` doesn't exist**, OR
3. **User `nelson` doesn't have access** to the database

### Verify PostgreSQL Status

```bash
# Check if PostgreSQL is running (Windows)
sc query postgresql-x64-18
# OR
netstat -an | findstr :5432
```

If PostgreSQL is NOT running or doesn't exist, you have TWO options:

---

## SOLUTION 1: Use PostgreSQL (RECOMMENDED for Defense)

PostgreSQL is a production-grade database. Your data will persist permanently.

### Steps to Set Up PostgreSQL

#### Option A: Install PostgreSQL (if not installed)
1. Download: https://www.postgresql.org/download/windows/
2. Install with default settings
3. Remember the password you set for user `postgres`

#### Option B: Use Docker PostgreSQL (faster)
```bash
# Pull and run PostgreSQL in Docker
docker run --name inteko-postgres -e POSTGRES_PASSWORD=nelson -e POSTGRES_USER=nelson -e POSTGRES_DB=inteko_db -p 5432:5432 -d postgres:15

# Verify it's running
docker ps
```

#### After PostgreSQL is Running

1. Create the database (if using native install):
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE USER nelson WITH PASSWORD 'nelson';
CREATE DATABASE inteko_db OWNER nelson;
GRANT ALL PRIVILEGES ON DATABASE inteko_db TO nelson;
\q
```

2. Your `backend/.env` is already configured correctly:
```
DATABASE_URL=jdbc:postgresql://localhost:5432/inteko_db
DATABASE_USERNAME=nelson
DATABASE_PASSWORD=nelson
```

3. Clean and restart backend:
```bash
cd backend
mvn clean
mvn spring-boot:run
```

**Result:** All data (meetings, users, check-ins) will persist permanently. Flyway will create the schema and seed data automatically on first run.

---

## SOLUTION 2: Use H2 File-Based Database (Quick Fix)

If you can't install PostgreSQL before defense, use H2 in FILE mode (not in-memory).

### Steps

**File: `backend/src/main/resources/application-dev.yml`**

Change line 4 from in-memory to file-based:

```yaml
spring:
  datasource:
    url: jdbc:h2:file:./data/inteko_db;AUTO_SERVER=TRUE  # Changed from jdbc:h2:mem:inteko_db
    username: sa
    password: 
    driver-class-name: org.h2.Driver
```

**File: `backend/.env`**

Set active profile to dev:

```env
SPRING_PROFILES_ACTIVE=dev
DATABASE_URL=jdbc:postgresql://localhost:5432/inteko_db
DATABASE_USERNAME=nelson
DATABASE_PASSWORD=nelson
JWT_SECRET=replace-with-a-secure-random-256-bit-string
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:3000
```

**Create data directory:**

```bash
cd backend
mkdir data
```

**Restart backend:**

```bash
mvn clean
mvn spring-boot:run
```

**Result:** H2 will store data in `backend/data/inteko_db.mv.db` file. Data persists across restarts. Seed data from `DevDataInitializer` will populate on first run.

---

## RECOMMENDED PATH FOR DEFENSE: PostgreSQL with Docker

**Why:**
- Professional (PostgreSQL is industry-standard)
- Fast to set up (5 minutes with Docker)
- Reliable data persistence
- Shows you understand production databases

**Steps:**

```bash
# 1. Start PostgreSQL in Docker
docker run --name inteko-postgres -e POSTGRES_PASSWORD=nelson -e POSTGRES_USER=nelson -e POSTGRES_DB=inteko_db -p 5432:5432 -d postgres:15

# 2. Clean backend build
cd backend
mvn clean

# 3. Verify profile is postgres (already is by default)
# Check backend/.env — SPRING_PROFILES_ACTIVE is not set, so defaults to postgres

# 4. Start backend
mvn spring-boot:run
```

**Expected output:**
```
Flyway Community Edition 9.22.3 by Redgate
Database: jdbc:postgresql://localhost:5432/inteko_db (PostgreSQL 18.0)
Successfully validated 6 migrations
Successfully applied 6 migrations
...
[Dev] Seeded user: admin@inteko.gov.rw (Administrator)
[Dev] Seeded user: jp.uwimana@kinyinya.gov.rw (Sector Official)
...
Started IntekoBackendApplication in X seconds
```

---

## Summary of All Fixes Needed

| # | Issue | Fix | Time |
|---|-------|-----|------|
| 1 | Backend won't start (Flyway duplicate V5) | `mvn clean` | 2 min |
| 2 | Data doesn't persist | Set up PostgreSQL OR switch to H2 file mode | 10 min |
| 3 | Login returns 500 | Will be fixed once backend starts correctly | 0 min |
| 4 | Meetings not saved | Will be fixed once DB is persistent | 0 min |

**Total time:** 12 minutes

---

## What to Do RIGHT NOW (Step-by-Step)

### Step 1: Clean the build (CRITICAL)
```bash
cd C:\Users\User\Documents\inteko\backend
mvn clean
```

### Step 2: Set up database (choose ONE option)

**Option A: Docker PostgreSQL (recommended)**
```bash
docker run --name inteko-postgres -e POSTGRES_PASSWORD=nelson -e POSTGRES_USER=nelson -e POSTGRES_DB=inteko_db -p 5432:5432 -d postgres:15
```

**Option B: H2 File Mode (if Docker not available)**
- Edit `backend/src/main/resources/application-dev.yml` line 4:
  - Change: `url: jdbc:h2:mem:inteko_db`
  - To: `url: jdbc:h2:file:./data/inteko_db;AUTO_SERVER=TRUE`
- Create directory: `mkdir backend\data`
- Edit `backend/.env`: Add `SPRING_PROFILES_ACTIVE=dev` at the top

### Step 3: Start backend
```bash
cd backend
mvn spring-boot:run
```

### Step 4: Verify it works
- Open browser: http://localhost:8080/api/v1/meetings
- Should see: `{"success":true,"data":[],"errorCode":null,"message":null}`
- No 500 error

### Step 5: Test login
- Frontend: http://localhost:3000
- Login: `admin@inteko.gov.rw` / `password123`
- Should succeed

### Step 6: Test meeting creation
- Click "Schedule Assembly"
- Fill in form
- Click "Publish Assembly"
- Refresh page — meeting should still be there

---

## For Defense Presentation

**If panel asks: "Why does your data persist now?"**

> "We use PostgreSQL for data persistence. In the development phase, we tested with H2 in-memory for rapid prototyping, but for the defense build we migrated to PostgreSQL which is production-ready. All meetings, users, attendance records, and resolutions are now stored in a relational database with full ACID compliance. Flyway handles schema migrations and versioning."

This shows:
✅ Understanding of database options  
✅ Professional production setup  
✅ Migration management  
✅ Real persistence

---

## Additional Fixes After Backend Starts

Once the backend is running, there are minor frontend fixes documented in previous analysis files:

- Phone validation normalization (`docs/20-phone-validation-bug.md`)
- Role-based UI restrictions (`docs/12-role-differentiation-analysis.md`)
- Backend integration for issues/resolutions (`docs/16-mock-data-backend-integration-analysis.md`)

**But the CRITICAL fix is getting the backend to start with a persistent database.**

---

## Rollback Plan (If Something Breaks)

If the PostgreSQL or H2 file setup fails:

1. **Quick H2 in-memory fallback:**
```bash
# backend/.env — set profile to dev
SPRING_PROFILES_ACTIVE=dev

# application-dev.yml — keep as in-memory
url: jdbc:h2:mem:inteko_db
```

2. **Restart backend:**
```bash
mvn clean
mvn spring-boot:run
```

3. **Data won't persist, but app will work for demo.**

**Tell panel:** "In this demo build, we use H2 in-memory for rapid iteration. Production deployment uses PostgreSQL with Docker."

---

## Files Modified

| File | Change |
|------|--------|
| Command line | `mvn clean` (removes duplicate migrations) |
| `backend/.env` | Add `SPRING_PROFILES_ACTIVE=dev` if using H2 file mode |
| `application-dev.yml` | Change H2 URL to file mode (if using H2) |

**OR (recommended):**

| Action | Command |
|--------|---------|
| Start PostgreSQL | `docker run --name inteko-postgres -e POSTGRES_PASSWORD=nelson -e POSTGRES_USER=nelson -e POSTGRES_DB=inteko_db -p 5432:5432 -d postgres:15` |
| Clean build | `mvn clean` |
| Start backend | `mvn spring-boot:run` |

**No code changes needed for PostgreSQL option.**

---

## Verification Checklist

- [ ] `mvn clean` completed without errors
- [ ] Database is running (Docker or H2 file directory exists)
- [ ] `mvn spring-boot:run` starts without errors
- [ ] Log shows "Started IntekoBackendApplication"
- [ ] `GET /meetings` returns 200 (not 500)
- [ ] Login works without 500 error
- [ ] Created meeting appears after page refresh
- [ ] Created user appears after page refresh

---

## Expected Log Output (Success)

```
INFO 15552 --- HikariPool-1 - Start completed.
INFO 15552 --- Flyway Community Edition 9.22.3
INFO 15552 --- Database: jdbc:postgresql://localhost:5432/inteko_db
INFO 15552 --- Successfully validated 6 migrations
INFO 15552 --- Current version: 6
INFO 15552 --- Schema history table inteko_db.flyway_schema_history created
INFO 15552 --- Migrating schema to version 1 - initial schema
INFO 15552 --- Migrating schema to version 2 - triggers and views
INFO 15552 --- Migrating schema to version 3 - seed data
INFO 15552 --- Migrating schema to version 4 - additional seed data
INFO 15552 --- Migrating schema to version 5 - fix missing audit columns
INFO 15552 --- Migrating schema to version 6 - fix password hashes
INFO 15552 --- Successfully applied 6 migrations
INFO 15552 --- [Dev] Seeded user: admin@inteko.gov.rw (Administrator)
INFO 15552 --- [Dev] Seeded user: jp.uwimana@kinyinya.gov.rw (Sector Official)
INFO 15552 --- [Dev] Seeded user: m.uwera@kinyinya.gov.rw (Meeting Secretary)
INFO 15552 --- Started IntekoBackendApplication in 25.123 seconds
```

**If you see this, your backend is ready for defense.**
