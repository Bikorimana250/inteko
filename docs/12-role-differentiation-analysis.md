# Role Differentiation Analysis & Implementation Plan
**Project Defense Preparation Document**  
**Date:** July 6, 2026  
**Status:** Analysis Phase - No Code Changes Yet

---

## Executive Summary

This document analyzes the current role implementation in the Inteko y'Abaturage system and proposes clear differentiation between **Sector Official** and **Meeting Secretary** roles to ensure a professional, defensible system architecture for project presentation.

### Current Problem
Both Sector Official and Meeting Secretary have nearly identical permissions and UI access, making the role distinction unclear and unprofessional for project defense.

### Proposed Solution
Clear functional separation where:
- **Sector Official** = Strategic Manager (oversight, approvals, reporting)
- **Meeting Secretary** = Operational Executor (attendance, documentation)

---

## Current State Analysis

### 1. Backend Role Configuration

**File:** `backend/src/main/java/rw/gov/inteko/backend/config/SecurityConfig.java`

#### Current Permissions:
```
PUBLIC (no auth required):
- GET /geography/**
- GET /meetings/**
- POST /meetings/*/participants
- GET /attendance/**

ADMINISTRATOR only:
- POST /users
- PUT /users/**
- DELETE /users/**

AUTHENTICATED (both roles):
- POST /meetings (requires SECTOR_OFFICIAL OR MEETING_SECRETARY)
- Everything else
```

#### Issues Identified:
1. No distinction between Sector Official and Meeting Secretary on most endpoints
2. Both roles can create meetings
3. No role-based restrictions on issue/resolution management
4. No approval workflow distinctions

---

### 2. Frontend Navigation Structure

**File:** `src/App.tsx` (lines 330-410)

#### Administrator
✅ **Appropriate access:**
- System Dashboard
- User Management
- Create User
- Cells & Villages
- Notifications
- Reports & Analytics
- Documents
- Settings

#### Sector Official
✅ **Has access to:**
- Sector Official Dashboard
- Meeting List
- Attendance Summary
- **Issue Tracking**
- **Resolution Tracking**
- Notifications
- Reports & Analytics
- Documents
- Settings

❌ **Problem:** Too much operational detail access

#### Meeting Secretary
✅ **Has access to:**
- Meeting List
- Attendance Summary
- **Issue Tracking** ← Should be view-only or removed
- **Resolution Tracking** ← Should be view-only or removed
- Notifications
- Documents

❌ **Problem:** Identical to Sector Official except missing dashboard and one analytics page

---

### 3. Functional Overlap Analysis

| Feature | Administrator | Sector Official | Meeting Secretary | **Should Be** |
|---------|---------------|-----------------|-------------------|---------------|
| Create Meetings | ✓ | ✓ | ✓ | Official only |
| Check-in Attendees | ✓ | ✓ | ✓ | Secretary only |
| View Dashboard | ✓ | ✓ | ✗ | Official only |
| Create Issues | ✓ | ✓ | ✓ | Anyone (citizens) |
| Assign Issues | ✓ | ✓ | ✓ | Official only |
| Create Resolutions | ✓ | ✓ | ✓ | Official only |
| Approve Resolutions | ✓ | ✓ | ✗ | Official only |
| View Reports | ✓ | ✓ | ✗ | Official only |
| Manage Users | ✓ | ✗ | ✗ | Admin only ✓ |

---

## Proposed Role Differentiation

### Role Definitions

#### **Sector Official** (Strategic Manager)
**Primary Responsibility:** Sector-level oversight, planning, and approval

**Capabilities:**
1. **Strategic Planning**
   - Schedule and approve meetings
   - Set target attendance counts
   - Review meeting outcomes

2. **Issue & Resolution Management**
   - Assign issues to staff
   - Create resolutions
   - Approve/reject resolutions
   - Track resolution progress

3. **Reporting & Analytics**
   - View sector-wide reports
   - Access performance metrics
   - Export analytics data

4. **Approval Authority**
   - Final approval on resolutions
   - Meeting outcome validation
   - Issue closure authorization

**Cannot:**
- Record individual check-ins (delegates to secretary)
- Create users (admin only)

---

#### **Meeting Secretary** (Operational Executor)
**Primary Responsibility:** Meeting execution and attendance documentation

**Capabilities:**
1. **Meeting Operations**
   - View scheduled meetings
   - Conduct live check-ins
   - Record attendance
   - Mark meeting as completed (operational status only)

2. **Documentation**
   - Access meeting-related documents
   - Upload attendance sheets
   - View notifications

3. **Read-Only Access**
   - View issues (for context during meetings)
   - View resolutions (for follow-up discussions)
   - Cannot create or modify issues/resolutions

**Cannot:**
- Create or schedule meetings
- Assign issues
- Create resolutions
- Approve anything
- Access sector-wide reports
- View dashboard analytics

---

## Implementation Changes Required

### Phase 1: Backend Security (CRITICAL for Defense)

**File:** `SecurityConfig.java`

#### New Authorization Rules:
```java
// Meeting Management
.requestMatchers(HttpMethod.POST, "/meetings").hasRole("SECTOR_OFFICIAL")
.requestMatchers(HttpMethod.PATCH, "/meetings/*/status").hasRole("SECTOR_OFFICIAL")

// Issue Management
.requestMatchers(HttpMethod.POST, "/issues").permitAll() // citizens can report
.requestMatchers(HttpMethod.PATCH, "/issues/*/assign").hasRole("SECTOR_OFFICIAL")
.requestMatchers(HttpMethod.PATCH, "/issues/*/resolve").hasRole("SECTOR_OFFICIAL")

// Resolution Management
.requestMatchers(HttpMethod.POST, "/resolutions").hasRole("SECTOR_OFFICIAL")
.requestMatchers(HttpMethod.PATCH, "/resolutions/**").hasRole("SECTOR_OFFICIAL")

// Check-ins (accessible to both, but secretary is primary user)
.requestMatchers(HttpMethod.POST, "/meetings/*/participants").authenticated()

// Reports & Analytics
.requestMatchers(HttpMethod.GET, "/reports/**").hasAnyRole("ADMINISTRATOR", "SECTOR_OFFICIAL")
.requestMatchers(HttpMethod.GET, "/analytics/**").hasAnyRole("ADMINISTRATOR", "SECTOR_OFFICIAL")
```

**Risk Level:** LOW (only restricts, doesn't break existing)  
**Testing Required:** API endpoint tests with different roles

---

### Phase 2: Frontend Navigation (VISIBLE for Defense)

**File:** `src/App.tsx`

#### Sector Official Sidebar (Enhanced):
```typescript
case 'Sector Official':
  return [
    { 
      group: 'Strategic Overview', 
      items: [
        { view: 'Dashboard', label: 'Sector Dashboard', icon: Layers }
      ] 
    },
    { 
      group: 'Meeting Management', 
      items: [
        { view: 'Meeting List', label: 'Schedule & Manage Meetings', icon: Calendar },
        { view: 'Attendance Summary', label: 'Attendance Reports', icon: Users }
      ] 
    },
    { 
      group: 'Issue & Resolution Management', 
      items: [
        { view: 'Citizen Issues', label: 'Manage Issues', icon: AlertTriangle },
        { view: 'Resolutions', label: 'Resolution Tracking & Approval', icon: FileText }
      ] 
    },
    { 
      group: 'Reports & Documents', 
      items: [
        { view: 'Reports & Analytics', label: 'Sector Performance Reports', icon: Layers },
        { view: 'Documents', label: 'Policy Documents', icon: FileText },
        { view: 'Notifications', label: 'Notifications', icon: Bell }
      ] 
    }
  ];
```

#### Meeting Secretary Sidebar (Simplified):
```typescript
case 'Meeting Secretary':
  return [
    { 
      group: 'Meeting Operations', 
      items: [
        { view: 'Meeting List', label: 'Conduct Meetings & Check-ins', icon: Calendar },
        { view: 'Attendance Summary', label: 'My Attendance Records', icon: Users }
      ] 
    },
    { 
      group: 'Reference Information', 
      items: [
        { view: 'Citizen Issues', label: 'View Issues (Read-Only)', icon: AlertTriangle },
        { view: 'Documents', label: 'Meeting Documents', icon: FileText },
        { view: 'Notifications', label: 'My Notifications', icon: Bell }
      ] 
    }
  ];
```

**Risk Level:** LOW (only hides UI, backend enforces)  
**Visual Impact:** HIGH (clear role distinction)

---

### Phase 3: UI Component Restrictions (POLISH for Defense)

#### MeetingListView.tsx
**Add role-based button visibility:**
```typescript
// Schedule Meeting button - Sector Official only
{currentUser.role === 'Sector Official' && (
  <button onClick={() => setShowScheduleForm(true)}>
    Schedule Assembly
  </button>
)}

// Check-in button - Both roles, but Secretary is primary
<button onClick={() => openCheckIn(meeting.id)}>
  Check In
</button>
```

#### IssueTrackingView.tsx
**Add read-only mode for Meeting Secretary:**
```typescript
const isReadOnly = currentUser.role === 'Meeting Secretary';

// Hide action buttons in read-only mode
{!isReadOnly && (
  <button onClick={handleAssignIssue}>Assign</button>
)}
```

#### ResolutionTrackingView.tsx
**Restrict approval actions:**
```typescript
// Approval button - Sector Official only
{currentUser.role === 'Sector Official' && resolution.status === 'Active' && (
  <button onClick={() => handleApproveResolution(resolution.id)}>
    Approve Resolution
  </button>
)}
```

**Risk Level:** MEDIUM (UI changes, needs testing)  
**Visual Impact:** HIGH (professional role enforcement)

---

## Risk Assessment for Project Defense

### Low Risk Changes (Safe to implement before Wednesday)
✅ Backend SecurityConfig authorization rules  
✅ Sidebar navigation structure  
✅ Role-based button hiding (with backend enforcement)

### Medium Risk Changes (Implement with caution)
⚠️ UI component modifications  
⚠️ Read-only view modes  
⚠️ Conditional rendering logic

### High Risk Changes (DO NOT IMPLEMENT before defense)
❌ Database schema changes  
❌ New entity relationships  
❌ Complex approval workflows  
❌ Data migration scripts

---

## Testing Checklist Before Defense

### Backend API Tests
- [ ] Login as Sector Official → POST /meetings (should succeed)
- [ ] Login as Meeting Secretary → POST /meetings (should fail 403)
- [ ] Login as Sector Official → POST /resolutions (should succeed)
- [ ] Login as Meeting Secretary → POST /resolutions (should fail 403)
- [ ] Login as Meeting Secretary → POST /meetings/{id}/participants (should succeed)

### Frontend Navigation Tests
- [ ] Login as Administrator → See all 8 sidebar items
- [ ] Login as Sector Official → See Dashboard + Management sections
- [ ] Login as Meeting Secretary → See only Operations + Reference
- [ ] Meeting Secretary cannot see "Schedule Assembly" button
- [ ] Sector Official can see "Schedule Assembly" button

### Integration Tests
- [ ] Create meeting as Sector Official → Check in as Meeting Secretary
- [ ] Sector Official assigns issue → Meeting Secretary can view but not modify
- [ ] All existing features still work (no regressions)

---

## Defense Talking Points

### 1. Role Separation Justification
**Question:** "Why do you have two separate roles for meetings?"

**Answer:** 
"In Rwanda's local governance structure, Sector Officials are executive-level managers who handle strategic planning and approvals, while Meeting Secretaries are operational staff who execute meetings and record attendance. This separation follows the principle of least privilege and real-world organizational hierarchy."

### 2. Security Implementation
**Question:** "How do you enforce these role restrictions?"

**Answer:**
"We use Spring Security's `@PreAuthorize` annotations on the backend to enforce role-based access control at the API level. The frontend UI adapts based on roles for user experience, but the backend is the source of truth. Even if someone manipulates the frontend, the API will reject unauthorized requests with a 403 Forbidden response."

### 3. Practical Example
**Question:** "Give me an example of the workflow."

**Answer:**
1. Sector Official logs in → Sees dashboard with sector-wide stats
2. Official schedules a meeting for next week
3. Meeting Secretary logs in → Sees the scheduled meeting
4. On meeting day, Secretary conducts check-ins using mobile device
5. After meeting, Official reviews attendance report and marks outcomes
6. Official can then create resolutions based on meeting discussions

---

## Implementation Timeline

### Monday (Before Defense)
1. **Update SecurityConfig.java** (1 hour)
   - Add role-specific authorization rules
   - Test with curl/Postman

2. **Update App.tsx sidebar** (30 minutes)
   - Modify getSidebarItems() function
   - Test role switching

3. **Test thoroughly** (2 hours)
   - All user roles
   - All key features
   - No regressions

### Tuesday (Day before Defense)
4. **Optional UI polish** (if time permits)
   - Add role-based button visibility
   - Implement read-only modes
   - Only if tests pass

5. **Final verification** (1 hour)
   - Run through full demo scenario
   - Prepare backup database
   - Document any known issues

### Wednesday (Defense Day)
6. **Morning check**
   - Verify backend is running
   - Test login with all roles
   - Have rollback plan ready

---

## Rollback Plan

If anything breaks:

1. **Backend Rollback:**
   ```bash
   git checkout HEAD~1 backend/src/main/java/rw/gov/inteko/backend/config/SecurityConfig.java
   mvn clean install
   ```

2. **Frontend Rollback:**
   ```bash
   git checkout HEAD~1 src/App.tsx
   npm run build
   ```

3. **Nuclear Option:**
   - Use current codebase "as is"
   - Explain roles are "planned for next sprint"
   - Focus on working features

---

## Files to Be Modified (Summary)

### Backend (3 files)
1. `backend/src/main/java/rw/gov/inteko/backend/config/SecurityConfig.java`
2. `backend/src/main/java/rw/gov/inteko/backend/controller/MeetingController.java` (add @PreAuthorize)
3. `backend/src/main/java/rw/gov/inteko/backend/controller/ResolutionController.java` (add @PreAuthorize)

### Frontend (4 files)
1. `src/App.tsx` (getSidebarItems function)
2. `src/components/MeetingListView.tsx` (conditional buttons)
3. `src/components/IssueTrackingView.tsx` (read-only mode)
4. `src/components/ResolutionTrackingView.tsx` (approval restrictions)

### Documentation (1 file)
1. `docs/12-role-differentiation-analysis.md` (this file)

**Total:** 8 files  
**Estimated time:** 4-5 hours  
**Risk level:** LOW-MEDIUM  
**Impact:** HIGH (professional presentation)

---

## Conclusion

This analysis provides a clear, defendable role differentiation strategy that:

✅ Maintains existing functionality  
✅ Follows security best practices  
✅ Reflects real-world organizational structure  
✅ Can be implemented safely before Wednesday  
✅ Has clear rollback options  

**Recommendation:** Implement Phase 1 (Backend) and Phase 2 (Navigation) today/tomorrow. Phase 3 (UI Polish) is optional based on available time and comfort level.

**Final Note:** The current system is already functional and defensible. These changes are enhancements that make the role distinction more professional and clear for presentation purposes.
