-- Align database enum values with Java @Enumerated(EnumType.STRING) constants.
-- Seed data used Title Case; Java enums use UPPERCASE / SCREAMING_SNAKE_CASE.

-- Step 1: Drop old check constraints (Title Case values)
ALTER TABLE user_accounts DROP CONSTRAINT IF EXISTS user_accounts_role_check;
ALTER TABLE user_accounts DROP CONSTRAINT IF EXISTS user_accounts_status_check;
ALTER TABLE meetings DROP CONSTRAINT IF EXISTS meetings_status_check;
ALTER TABLE meeting_participants DROP CONSTRAINT IF EXISTS meeting_participants_attendance_status_check;
ALTER TABLE issues DROP CONSTRAINT IF EXISTS issues_category_check;
ALTER TABLE issues DROP CONSTRAINT IF EXISTS issues_priority_check;
ALTER TABLE issues DROP CONSTRAINT IF EXISTS issues_status_check;
ALTER TABLE resolutions DROP CONSTRAINT IF EXISTS resolutions_status_check;
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_category_check;
ALTER TABLE documents DROP CONSTRAINT IF EXISTS documents_access_level_check;

-- Step 2: Update data to match Java enum constant names
UPDATE user_accounts SET role = 'ADMINISTRATOR'      WHERE role = 'Administrator';
UPDATE user_accounts SET role = 'SECTOR_OFFICIAL'    WHERE role = 'Sector Official';
UPDATE user_accounts SET role = 'MEETING_SECRETARY'  WHERE role = 'Meeting Secretary';
UPDATE user_accounts SET status = 'ACTIVE'           WHERE status = 'Active';
UPDATE user_accounts SET status = 'INACTIVE'         WHERE status = 'Inactive';

UPDATE meetings SET status = 'SCHEDULED'  WHERE status = 'Scheduled';
UPDATE meetings SET status = 'ONGOING'    WHERE status = 'Ongoing';
UPDATE meetings SET status = 'COMPLETED'  WHERE status = 'Completed';
UPDATE meetings SET status = 'POSTPONED'  WHERE status = 'Postponed';
UPDATE meetings SET status = 'CANCELLED'  WHERE status = 'Cancelled';

UPDATE meeting_participants SET attendance_status = 'PRESENT'  WHERE attendance_status = 'Present';
UPDATE meeting_participants SET attendance_status = 'ABSENT'   WHERE attendance_status = 'Absent';
UPDATE meeting_participants SET attendance_status = 'EXCUSED' WHERE attendance_status = 'Excused';

UPDATE issues SET category = 'INFRASTRUCTURE' WHERE category = 'Infrastructure';
UPDATE issues SET category = 'GOVERNANCE'     WHERE category = 'Governance';
UPDATE issues SET category = 'SOCIAL'         WHERE category = 'Social';
UPDATE issues SET category = 'ECONOMIC'       WHERE category = 'Economic';
UPDATE issues SET category = 'LAND'           WHERE category = 'Land';
UPDATE issues SET priority = 'LOW'            WHERE priority = 'Low';
UPDATE issues SET priority = 'MEDIUM'         WHERE priority = 'Medium';
UPDATE issues SET priority = 'HIGH'           WHERE priority = 'High';
UPDATE issues SET priority = 'CRITICAL'       WHERE priority = 'Critical';
UPDATE issues SET status = 'ACTIVE'           WHERE status = 'Active';
UPDATE issues SET status = 'PROCESSING'       WHERE status = 'Processing';
UPDATE issues SET status = 'RESOLVED'         WHERE status = 'Resolved';
UPDATE issues SET status = 'CLOSED'           WHERE status = 'Closed';
UPDATE issues SET status = 'REJECTED'         WHERE status = 'Rejected';

UPDATE resolutions SET status = 'ACTIVE'      WHERE status = 'Active';
UPDATE resolutions SET status = 'CONCLUDED'   WHERE status = 'Concluded';
UPDATE resolutions SET status = 'ON_HOLD'       WHERE status = 'On Hold';
UPDATE resolutions SET status = 'CANCELLED'   WHERE status = 'Cancelled';

UPDATE notifications SET category = 'MEETING'     WHERE category = 'Meeting';
UPDATE notifications SET category = 'ISSUE'       WHERE category = 'Issue';
UPDATE notifications SET category = 'RESOLUTION'  WHERE category = 'Resolution';
UPDATE notifications SET category = 'SYSTEM'      WHERE category = 'System';

UPDATE documents SET access_level = 'PUBLIC'        WHERE access_level = 'Public';
UPDATE documents SET access_level = 'RESTRICTED'    WHERE access_level = 'Restricted';
UPDATE documents SET access_level = 'CONFIDENTIAL'  WHERE access_level = 'Confidential';

-- Step 3: Re-add check constraints with uppercase values
ALTER TABLE user_accounts ADD CONSTRAINT user_accounts_role_check
    CHECK (role IN ('ADMINISTRATOR', 'SECTOR_OFFICIAL', 'MEETING_SECRETARY'));
ALTER TABLE user_accounts ADD CONSTRAINT user_accounts_status_check
    CHECK (status IN ('ACTIVE', 'INACTIVE'));
ALTER TABLE meetings ADD CONSTRAINT meetings_status_check
    CHECK (status IN ('SCHEDULED', 'ONGOING', 'COMPLETED', 'POSTPONED', 'CANCELLED'));
ALTER TABLE meeting_participants ADD CONSTRAINT meeting_participants_attendance_status_check
    CHECK (attendance_status IN ('PRESENT', 'ABSENT', 'EXCUSED'));
ALTER TABLE issues ADD CONSTRAINT issues_category_check
    CHECK (category IN ('INFRASTRUCTURE', 'GOVERNANCE', 'SOCIAL', 'ECONOMIC', 'LAND'));
ALTER TABLE issues ADD CONSTRAINT issues_priority_check
    CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'));
ALTER TABLE issues ADD CONSTRAINT issues_status_check
    CHECK (status IN ('ACTIVE', 'PROCESSING', 'RESOLVED', 'CLOSED', 'REJECTED'));
ALTER TABLE resolutions ADD CONSTRAINT resolutions_status_check
    CHECK (status IN ('ACTIVE', 'CONCLUDED', 'ON_HOLD', 'CANCELLED'));
ALTER TABLE notifications ADD CONSTRAINT notifications_category_check
    CHECK (category IN ('MEETING', 'ISSUE', 'RESOLUTION', 'SYSTEM'));
ALTER TABLE documents ADD CONSTRAINT documents_access_level_check
    CHECK (access_level IN ('PUBLIC', 'RESTRICTED', 'CONFIDENTIAL'));
