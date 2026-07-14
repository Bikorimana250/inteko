# DEFENSE READY CHECKLIST
**Date:** July 13, 2026  
**Defense:** Tomorrow  
**Estimated Fix Time:** 15 minutes

---

## URGENT: Your Backend Is NOT Starting

### The Error
```
Found more than one migration with version 5
```

### The Fix (3 Commands)

```bash
# 1. Clean the build
cd C:\Users\User\Documents\inteko\backend
mvn clean

# 2. Start PostgreSQL (choose Docker OR H2 below)
docker run --name inteko-postgres -e POSTGRES_PASSWORD=nelson -e POSTGRES_USER=nelson -e POSTGRES_DB=inteko_db -p 5432:5432 -d postgres:15

# 3. Start backend
mvn spring-boot:run
```

**That's it. Your backend will start and data will persist.**

---

## Quick Setup Scripts (Alternative to Manual Commands)

### Option A: PostgreSQL with Docker (RECOMMENDED)
```bash
cd C:\Users\User\Documents\inteko\backend\scripts
setup-postgres-docker.bat
```

Then:
```bash
cd C:\Users\User\Documents\inteko\backend
mvn clean
mvn spring-boot:run
```

### Option B: H2 File Database (No Docker)
```bash
cd C:\Users\User\Documents\inteko\backend\scripts
setup-h2-file.bat
```

Then edit `backend\.env` and add at the top:
```
SPRING_PROFILES_ACTIVE=dev
```

Then:
```bash
cd C:\Users\User\Documents\inteko\backend
mvn clean
mvn spring-boot:run
```

---

## Expected Success Output

When backend starts correctly, you'll see:

```
INFO --- Flyway Community Edition 9.22.3
INFO --- Database: jdbc:postgresql://localhost:5432/inteko_db
INFO --- Successfully validated 6 migrations
INFO --- Successfully applied 6 migrations
INFO --- [Dev] Seeded user: admin@inteko.gov.rw (Administrator)
INFO --- [Dev] Seeded user: jp.uwimana@kinyinya.gov.rw (Sector Official)
INFO --- [Dev] Seeded user: m.uwera@kinyinya.gov.rw (Meeting Secretary)
INFO --- Started IntekoBackendApplication in 25.123 seconds
```

**If you see this, you're defense-ready.**

---

## Test After Backend Starts

1. **Open browser:** http://localhost:8080/api/v1/meetings
   - Should see: `{"success":true,"data":[],...}`
   - NOT: 500 error

2. **Start frontend:**
   ```bash
   cd C:\Users\User\Documents\inteko
   npm run dev
   ```

3. **Test login:** http://localhost:3000
   - Email: `admin@inteko.gov.rw`
   - Password: `password123`
   - Should succeed (NOT 500 error)

4. **Create a meeting:**
   - Schedule a meeting
   - Refresh the page
   - Meeting should STILL BE THERE (data persisted!)

5. **Create a user:**
   - Go to User Management
   - Create new user
   - Refresh the page
   - User should STILL BE THERE (data persisted!)

---

## Why This Works

### The Problem
You had:
- **Flyway conflict:** Two V5 migration files in compiled code
- **In-memory H2:** Data wiped on every restart
- **No persistent database:** Meetings/users disappeared

### The Solution
- **`mvn clean`:** Removes duplicate compiled migrations
- **PostgreSQL:** Industry-standard persistent database
- **Flyway:** Auto-creates schema and seeds data on first run

### The Result
- Backend starts without errors ✅
- Login works ✅
- Meetings persist across restarts ✅
- Users persist across restarts ✅
- Defense-ready ✅

---

## If Something Goes Wrong

### Error: "Docker is not running"
- Open Docker Desktop
- Wait for it to start
- Run the setup script again

### Error: "Port 5432 is already in use"
```bash
# Stop existing PostgreSQL
docker stop inteko-postgres
docker rm inteko-postgres

# Or use different port
docker run --name inteko-postgres ... -p 5433:5432 ...
# Then update backend/.env: DATABASE_URL=jdbc:postgresql://localhost:5433/inteko_db
```

### Error: "mvn: command not found"
- Make sure Maven is in your PATH
- Or use: `C:\Users\User\Downloads\Compressed\apache-maven-3.9.9\bin\mvn.cmd clean`

### Backend still won't start
Use the H2 file option instead:
```bash
cd backend\scripts
setup-h2-file.bat

# Edit backend\.env — add: SPRING_PROFILES_ACTIVE=dev

cd ..
mvn clean
mvn spring-boot:run
```

---

## Final Verification Checklist

- [ ] Backend starts without errors
- [ ] `GET /meetings` returns 200 (not 500)
- [ ] Frontend connects to backend
- [ ] Login succeeds (admin@inteko.gov.rw / password123)
- [ ] Create meeting → refresh → meeting still visible
- [ ] Create user → refresh → user still visible
- [ ] No browser console errors on meeting creation
- [ ] Attendance check-in works

**If all checked, you are DEFENSE READY.**

---

## What Changed From Before

| Before | After |
|--------|-------|
| H2 in-memory (data lost on restart) | PostgreSQL persistent (data saved permanently) |
| Duplicate V5 migrations (backend crash) | Clean build (no duplicates) |
| Login 500 error | Login works |
| Meetings disappear | Meetings persist |
| Users disappear | Users persist |

---

## For Defense Presentation

**Panel:** "How do you persist data?"

**Answer:** "We use PostgreSQL as our relational database, managed through Spring Data JPA. Schema migrations are version-controlled with Flyway, and we have seed data initialization for development. The application supports both PostgreSQL for production and H2 for rapid prototyping, configured through Spring profiles."

**Shows you understand:**
- Production databases
- Schema migration management
- Environment configuration
- Professional development practices

---

## Time to Defense Ready: 15 Minutes

1. Run `mvn clean` — 2 min
2. Start PostgreSQL Docker — 3 min
3. Start backend — 5 min
4. Test login and meeting creation — 5 min

**Total: 15 minutes from broken to defense-ready.**

---

## Next Steps (Optional — Only If Time Permits)

After the backend is working, minor polish fixes from other docs:

1. Phone validation (`docs/20-phone-validation-bug.md`) — 5 min
2. Role-based UI (`docs/12-role-differentiation-analysis.md`) — 15 min
3. Connect issues/resolutions (`docs/16-mock-data-backend-integration-analysis.md`) — 30 min

**But these are OPTIONAL. The critical fix is getting the backend to start with persistent data.**

Focus on backend first. If that works, you have a fully defensible project.
