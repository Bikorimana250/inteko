-- =====================================================
-- Inteko y'Abaturage - Triggers and Views
-- Version: 2.0
-- Description: Automatic triggers for timestamp updates and
--              views for common query patterns
-- =====================================================

-- =====================================================
-- 1. TRIGGER FUNCTION FOR updated_at COLUMN
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 2. APPLY TRIGGERS TO ALL TABLES WITH updated_at
-- =====================================================

CREATE TRIGGER update_user_accounts_updated_at 
BEFORE UPDATE ON user_accounts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sectors_updated_at 
BEFORE UPDATE ON sectors
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cells_updated_at 
BEFORE UPDATE ON cells
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_villages_updated_at 
BEFORE UPDATE ON villages
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meetings_updated_at 
BEFORE UPDATE ON meetings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_issues_updated_at 
BEFORE UPDATE ON issues
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resolutions_updated_at 
BEFORE UPDATE ON resolutions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at 
BEFORE UPDATE ON documents
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resolution_action_items_updated_at 
BEFORE UPDATE ON resolution_action_items
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 3. VIEWS FOR COMMON QUERIES
-- =====================================================

-- Active Users View
CREATE VIEW active_users_view AS
SELECT 
    u.id,
    u.user_code,
    u.first_name || ' ' || u.last_name AS full_name,
    u.email,
    u.role,
    u.position,
    u.phone,
    u.id_number,
    s.name AS sector_name,
    s.sector_code,
    c.name AS cell_name,
    c.cell_code,
    v.name AS village_name,
    v.village_code,
    u.last_active_at,
    u.status
FROM user_accounts u
LEFT JOIN sectors s ON u.sector_id = s.id
LEFT JOIN cells c ON u.cell_id = c.id
LEFT JOIN villages v ON u.village_id = v.id
WHERE u.status = 'Active' AND u.deleted_at IS NULL;

-- Meeting Statistics View
CREATE VIEW meeting_statistics_view AS
SELECT 
    m.id,
    m.meeting_code,
    m.title,
    m.meeting_date,
    m.meeting_time,
    m.location,
    m.status,
    m.participants_count,
    m.target_count,
    CASE 
        WHEN m.target_count > 0 THEN ROUND((m.participants_count::NUMERIC / m.target_count * 100), 2)
        ELSE 0 
    END AS attendance_percentage,
    s.name AS sector_name,
    s.sector_code,
    u.first_name || ' ' || u.last_name AS created_by_name,
    m.created_at
FROM meetings m
LEFT JOIN sectors s ON m.sector_id = s.id
LEFT JOIN user_accounts u ON m.created_by = u.id
WHERE m.deleted_at IS NULL;

-- Issue Summary View
CREATE VIEW issue_summary_view AS
SELECT 
    i.id,
    i.issue_code,
    i.title,
    i.category,
    i.status,
    i.priority,
    i.reporter_name,
    i.reporter_phone,
    u.first_name || ' ' || u.last_name AS assigned_to_name,
    u.email AS assigned_to_email,
    s.name AS sector_name,
    s.sector_code,
    c.name AS cell_name,
    c.cell_code,
    v.name AS village_name,
    v.village_code,
    i.created_at,
    i.resolved_at,
    CASE 
        WHEN i.resolved_at IS NOT NULL AND i.created_at IS NOT NULL 
        THEN EXTRACT(EPOCH FROM (i.resolved_at - i.created_at))/86400
        ELSE NULL 
    END AS resolution_days
FROM issues i
LEFT JOIN user_accounts u ON i.assigned_to = u.id
LEFT JOIN sectors s ON i.sector_id = s.id
LEFT JOIN cells c ON i.cell_id = c.id
LEFT JOIN villages v ON i.village_id = v.id
WHERE i.deleted_at IS NULL;

-- Resolution Progress View
CREATE VIEW resolution_progress_view AS
SELECT 
    r.id,
    r.resolution_code,
    r.title,
    r.status,
    r.progress_percentage,
    r.assigned_unit,
    r.responsible_officer,
    u.first_name || ' ' || u.last_name AS assigned_to_name,
    i.issue_code AS linked_issue_code,
    i.title AS linked_issue_title,
    r.due_date,
    r.concluded_at,
    r.created_at,
    COUNT(rai.id) AS total_action_items,
    COUNT(CASE WHEN rai.is_completed = TRUE THEN 1 END) AS completed_action_items,
    CASE 
        WHEN COUNT(rai.id) > 0 
        THEN ROUND((COUNT(CASE WHEN rai.is_completed = TRUE THEN 1 END)::NUMERIC / COUNT(rai.id) * 100), 2)
        ELSE 0 
    END AS action_items_completion_percentage
FROM resolutions r
LEFT JOIN user_accounts u ON r.assigned_to = u.id
LEFT JOIN issues i ON r.linked_issue_id = i.id
LEFT JOIN resolution_action_items rai ON r.id = rai.resolution_id
WHERE r.deleted_at IS NULL
GROUP BY r.id, r.resolution_code, r.title, r.status, r.progress_percentage, 
         r.assigned_unit, r.responsible_officer, u.first_name, u.last_name,
         i.issue_code, i.title, r.due_date, r.concluded_at, r.created_at;

-- Geographic Hierarchy View
CREATE VIEW geographic_hierarchy_view AS
SELECT 
    s.id AS sector_id,
    s.sector_code,
    s.name AS sector_name,
    c.id AS cell_id,
    c.cell_code,
    c.name AS cell_name,
    v.id AS village_id,
    v.village_code,
    v.name AS village_name,
    v.leader_name,
    v.population,
    COUNT(DISTINCT u.id) AS user_count
FROM sectors s
LEFT JOIN cells c ON c.sector_id = s.id
LEFT JOIN villages v ON v.cell_id = c.id
LEFT JOIN user_accounts u ON u.village_id = v.id AND u.deleted_at IS NULL
GROUP BY s.id, s.sector_code, s.name, c.id, c.cell_code, c.name,
         v.id, v.village_code, v.name, v.leader_name, v.population;

-- Unread Notifications View
CREATE VIEW unread_notifications_view AS
SELECT 
    n.id,
    n.notification_code,
    n.title,
    n.message,
    n.category,
    n.user_id,
    u.first_name || ' ' || u.last_name AS user_name,
    u.email AS user_email,
    n.action_label,
    n.action_url,
    n.created_at
FROM notifications n
LEFT JOIN user_accounts u ON n.user_id = u.id
WHERE n.is_read = FALSE
ORDER BY n.created_at DESC;

-- Document Library View
CREATE VIEW document_library_view AS
SELECT 
    d.id,
    d.document_code,
    d.title,
    d.description,
    d.category,
    d.tags,
    d.file_name,
    d.file_size_bytes,
    d.mime_type,
    d.version,
    d.access_level,
    d.download_count,
    d.view_count,
    u.first_name || ' ' || u.last_name AS created_by_name,
    d.created_at,
    d.updated_at
FROM documents d
LEFT JOIN user_accounts u ON d.created_by = u.id
WHERE d.deleted_at IS NULL;

-- =====================================================
-- 4. COMMENTS
-- =====================================================

COMMENT ON TABLE user_accounts IS 'User accounts with role-based access control';
COMMENT ON TABLE sectors IS 'Top-level geographic units';
COMMENT ON TABLE cells IS 'Mid-level geographic units under sectors';
COMMENT ON TABLE villages IS 'Village-level geographic units under cells';
COMMENT ON TABLE meetings IS 'Community meetings and gatherings';
COMMENT ON TABLE meeting_participants IS 'Attendance records for meetings';
COMMENT ON TABLE issues IS 'Community issues and complaints';
COMMENT ON TABLE resolutions IS 'Resolutions and action plans';
COMMENT ON TABLE notifications IS 'System notifications for users';
COMMENT ON TABLE documents IS 'Document library and file management';
COMMENT ON TABLE audit_logs IS 'Audit trail for data changes';

COMMENT ON VIEW active_users_view IS 'Active users with geographic context';
COMMENT ON VIEW meeting_statistics_view IS 'Meeting details with attendance metrics';
COMMENT ON VIEW issue_summary_view IS 'Issue summary with assignment and location';
COMMENT ON VIEW resolution_progress_view IS 'Resolution progress with action item completion';
COMMENT ON VIEW geographic_hierarchy_view IS 'Complete geographic hierarchy with user counts';
