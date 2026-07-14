-- V8: Repair broken enum constraints from failed V7 migration
-- Drops ALL enum constraints, force-updates all data, re-adds correct constraints

-- =====================================================
-- 1. DROP ALL ENUM CHECK CONSTRAINTS (safe - idempotent)
-- =====================================================
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

-- =====================================================
-- 2. FORCE UPDATE ALL DATA TO UPPERCASE (Java enum names)
-- =====================================================
UPDATE user_accounts SET role = 'ADMINISTRATOR'     WHERE UPPER(role) = 'ADMINISTRATOR';
UPDATE user_accounts SET role = 'SECTOR_OFFICIAL'   WHERE UPPER(REPLACE(role, ' ', '_')) = 'SECTOR_OFFICIAL';
UPDATE user_accounts SET role = 'MEETING_SECRETARY' WHERE UPPER(REPLACE(role, ' ', '_')) = 'MEETING_SECRETARY';
UPDATE user_accounts SET status = 'ACTIVE'          WHERE UPPER(status) = 'ACTIVE';
UPDATE user_accounts SET status = 'INACTIVE'        WHERE UPPER(status) = 'INACTIVE';

UPDATE meetings SET status = 'SCHEDULED' WHERE UPPER(status) = 'SCHEDULED';
UPDATE meetings SET status = 'ONGOING'   WHERE UPPER(status) = 'ONGOING';
UPDATE meetings SET status = 'COMPLETED' WHERE UPPER(status) = 'COMPLETED';
UPDATE meetings SET status = 'POSTPONED' WHERE UPPER(status) = 'POSTPONED';
UPDATE meetings SET status = 'CANCELLED' WHERE UPPER(status) = 'CANCELLED';

UPDATE meeting_participants SET attendance_status = 'PRESENT' WHERE UPPER(attendance_status) = 'PRESENT';
UPDATE meeting_participants SET attendance_status = 'ABSENT'  WHERE UPPER(attendance_status) = 'ABSENT';
UPDATE meeting_participants SET attendance_status = 'EXCUSED' WHERE UPPER(attendance_status) = 'EXCUSED';

UPDATE issues SET category = 'INFRASTRUCTURE' WHERE UPPER(category) = 'INFRASTRUCTURE';
UPDATE issues SET category = 'GOVERNANCE'     WHERE UPPER(category) = 'GOVERNANCE';
UPDATE issues SET category = 'SOCIAL'         WHERE UPPER(category) = 'SOCIAL';
UPDATE issues SET category = 'ECONOMIC'       WHERE UPPER(category) = 'ECONOMIC';
UPDATE issues SET category = 'LAND'           WHERE UPPER(category) = 'LAND';
UPDATE issues SET priority = 'LOW'            WHERE UPPER(priority) = 'LOW';
UPDATE issues SET priority = 'MEDIUM'         WHERE UPPER(priority) = 'MEDIUM';
UPDATE issues SET priority = 'HIGH'           WHERE UPPER(priority) = 'HIGH';
UPDATE issues SET priority = 'CRITICAL'       WHERE UPPER(priority) = 'CRITICAL';
UPDATE issues SET status = 'ACTIVE'           WHERE UPPER(status) = 'ACTIVE';
UPDATE issues SET status = 'PROCESSING'       WHERE UPPER(status) = 'PROCESSING';
UPDATE issues SET status = 'RESOLVED'         WHERE UPPER(status) = 'RESOLVED';
UPDATE issues SET status = 'CLOSED'           WHERE UPPER(status) = 'CLOSED';
UPDATE issues SET status = 'REJECTED'         WHERE UPPER(status) = 'REJECTED';

UPDATE resolutions SET status = 'ACTIVE'     WHERE UPPER(status) = 'ACTIVE';
UPDATE resolutions SET status = 'CONCLUDED'  WHERE UPPER(status) = 'CONCLUDED';
UPDATE resolutions SET status = 'ON_HOLD'    WHERE UPPER(REPLACE(status, ' ', '_')) = 'ON_HOLD';
UPDATE resolutions SET status = 'CANCELLED'  WHERE UPPER(status) = 'CANCELLED';

UPDATE notifications SET category = 'MEETING'    WHERE UPPER(category) = 'MEETING';
UPDATE notifications SET category = 'ISSUE'      WHERE UPPER(category) = 'ISSUE';
UPDATE notifications SET category = 'RESOLUTION' WHERE UPPER(category) = 'RESOLUTION';
UPDATE notifications SET category = 'SYSTEM'     WHERE UPPER(category) = 'SYSTEM';

UPDATE documents SET access_level = 'PUBLIC'       WHERE UPPER(access_level) = 'PUBLIC';
UPDATE documents SET access_level = 'RESTRICTED'   WHERE UPPER(access_level) = 'RESTRICTED';
UPDATE documents SET access_level = 'CONFIDENTIAL' WHERE UPPER(access_level) = 'CONFIDENTIAL';

-- =====================================================
-- 3. RE-ADD CORRECT CHECK CONSTRAINTS (uppercase)
-- =====================================================
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
