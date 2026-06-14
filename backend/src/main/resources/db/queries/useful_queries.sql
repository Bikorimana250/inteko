-- =====================================================
-- Inteko y'Abaturage - Useful SQL Queries
-- Common queries for development and debugging
-- =====================================================

-- =====================================================
-- USER QUERIES
-- =====================================================

-- List all active users with their roles and geographic assignments
SELECT 
    user_code,
    first_name || ' ' || last_name AS full_name,
    email,
    role,
    position,
    s.name AS sector,
    c.name AS cell,
    v.name AS village,
    status
FROM user_accounts u
LEFT JOIN sectors s ON u.sector_id = s.id
LEFT JOIN cells c ON u.cell_id = c.id
LEFT JOIN villages v ON u.village_id = v.id
WHERE u.deleted_at IS NULL
ORDER BY u.role, u.last_name;

-- Count users by role
SELECT 
    role,
    COUNT(*) AS user_count,
    COUNT(CASE WHEN status = 'Active' THEN 1 END) AS active_count,
    COUNT(CASE WHEN status = 'Inactive' THEN 1 END) AS inactive_count
FROM user_accounts
WHERE deleted_at IS NULL
GROUP BY role;

-- =====================================================
-- GEOGRAPHIC QUERIES
-- =====================================================

-- Complete geographic hierarchy with counts
SELECT 
    s.sector_code,
    s.name AS sector_name,
    COUNT(DISTINCT c.id) AS cell_count,
    COUNT(DISTINCT v.id) AS village_count,
    SUM(v.population) AS total_population,
    COUNT(DISTINCT u.id) AS user_count
FROM sectors s
LEFT JOIN cells c ON c.sector_id = s.id
LEFT JOIN villages v ON v.cell_id = c.id
LEFT JOIN user_accounts u ON u.sector_id = s.id AND u.deleted_at IS NULL
GROUP BY s.id, s.sector_code, s.name
ORDER BY s.sector_code;

-- Villages with their leaders and population
SELECT 
    s.name AS sector,
    c.name AS cell,
    v.village_code,
    v.name AS village,
    v.leader_name,
    v.population
FROM villages v
JOIN cells c ON v.cell_id = c.id
JOIN sectors s ON c.sector_id = s.id
ORDER BY s.name, c.name, v.name;

-- =====================================================
-- MEETING QUERIES
-- =====================================================

-- Meeting attendance summary
SELECT 
    meeting_code,
    title,
    meeting_date,
    status,
    target_count,
    participants_count,
    ROUND((participants_count::NUMERIC / NULLIF(target_count, 0) * 100), 2) AS attendance_rate,
    sector_name
FROM meeting_statistics_view
ORDER BY meeting_date DESC;

-- Upcoming meetings
SELECT 
    meeting_code,
    title,
    meeting_date,
    meeting_time,
    location,
    status,
    sector_name
FROM meeting_statistics_view
WHERE meeting_date >= CURRENT_DATE AND status IN ('Scheduled', 'Ongoing')
ORDER BY meeting_date, meeting_time;

-- Meeting participation by village
SELECT 
    v.name AS village,
    COUNT(mp.id) AS participant_count
FROM meeting_participants mp
JOIN villages v ON mp.village_id = v.id
GROUP BY v.name
ORDER BY participant_count DESC;

-- =====================================================
-- ISSUE QUERIES
-- =====================================================

-- Active issues by category and priority
SELECT 
    category,
    priority,
    COUNT(*) AS issue_count
FROM issues
WHERE status IN ('Active', 'Processing') AND deleted_at IS NULL
GROUP BY category, priority
ORDER BY 
    CASE priority 
        WHEN 'Critical' THEN 1 
        WHEN 'High' THEN 2 
        WHEN 'Medium' THEN 3 
        WHEN 'Low' THEN 4 
    END,
    category;

-- Issues by geographic location
SELECT 
    s.name AS sector,
    c.name AS cell,
    COUNT(*) AS issue_count,
    COUNT(CASE WHEN i.status = 'Active' THEN 1 END) AS active,
    COUNT(CASE WHEN i.status = 'Resolved' THEN 1 END) AS resolved
FROM issues i
LEFT JOIN sectors s ON i.sector_id = s.id
LEFT JOIN cells c ON i.cell_id = c.id
WHERE i.deleted_at IS NULL
GROUP BY s.name, c.name
ORDER BY issue_count DESC;

-- Average resolution time by category (in days)
SELECT 
    category,
    COUNT(*) AS total_issues,
    COUNT(CASE WHEN resolved_at IS NOT NULL THEN 1 END) AS resolved_count,
    ROUND(AVG(EXTRACT(EPOCH FROM (resolved_at - created_at))/86400), 2) AS avg_resolution_days
FROM issues
WHERE deleted_at IS NULL
GROUP BY category
ORDER BY avg_resolution_days DESC NULLS LAST;

-- Issues assigned to specific user
SELECT 
    issue_code,
    title,
    category,
    priority,
    status,
    created_at,
    assigned_to
FROM issues
WHERE assigned_to = 2 -- Replace with actual user ID
  AND deleted_at IS NULL
ORDER BY 
    CASE priority 
        WHEN 'Critical' THEN 1 
        WHEN 'High' THEN 2 
        WHEN 'Medium' THEN 3 
        WHEN 'Low' THEN 4 
    END,
    created_at DESC;

-- =====================================================
-- RESOLUTION QUERIES
-- =====================================================

-- Active resolutions with progress
SELECT 
    resolution_code,
    title,
    status,
    progress_percentage,
    action_items_completion_percentage,
    assigned_unit,
    due_date,
    CASE 
        WHEN due_date < CURRENT_DATE THEN 'Overdue'
        WHEN due_date = CURRENT_DATE THEN 'Due Today'
        WHEN due_date <= CURRENT_DATE + INTERVAL '7 days' THEN 'Due Soon'
        ELSE 'On Track'
    END AS status_indicator
FROM resolution_progress_view
WHERE status IN ('Active', 'On Hold')
ORDER BY due_date;

-- Resolution completion rate by assigned unit
SELECT 
    assigned_unit,
    COUNT(*) AS total_resolutions,
    COUNT(CASE WHEN status = 'Concluded' THEN 1 END) AS concluded,
    ROUND(AVG(progress_percentage), 2) AS avg_progress,
    COUNT(CASE WHEN due_date < CURRENT_DATE AND status != 'Concluded' THEN 1 END) AS overdue
FROM resolutions
WHERE deleted_at IS NULL
GROUP BY assigned_unit
ORDER BY total_resolutions DESC;

-- Resolutions with incomplete action items
SELECT 
    r.resolution_code,
    r.title,
    COUNT(rai.id) AS total_items,
    COUNT(CASE WHEN rai.is_completed THEN 1 END) AS completed_items,
    COUNT(CASE WHEN NOT rai.is_completed THEN 1 END) AS pending_items
FROM resolutions r
LEFT JOIN resolution_action_items rai ON r.id = rai.resolution_id
WHERE r.status = 'Active' AND r.deleted_at IS NULL
GROUP BY r.id, r.resolution_code, r.title
HAVING COUNT(CASE WHEN NOT rai.is_completed THEN 1 END) > 0
ORDER BY pending_items DESC;

-- =====================================================
-- NOTIFICATION QUERIES
-- =====================================================

-- Unread notifications by user
SELECT 
    u.user_code,
    u.first_name || ' ' || u.last_name AS user_name,
    COUNT(*) AS unread_count
FROM notifications n
JOIN user_accounts u ON n.user_id = u.id
WHERE n.is_read = FALSE
GROUP BY u.user_code, u.first_name, u.last_name
ORDER BY unread_count DESC;

-- Recent notifications (last 7 days)
SELECT 
    notification_code,
    title,
    category,
    user_name,
    is_read,
    created_at
FROM unread_notifications_view
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY created_at DESC
LIMIT 50;

-- =====================================================
-- DOCUMENT QUERIES
-- =====================================================

-- Documents by category
SELECT 
    category,
    COUNT(*) AS document_count,
    SUM(file_size_bytes) AS total_size_bytes,
    ROUND(SUM(file_size_bytes)::NUMERIC / 1024 / 1024, 2) AS total_size_mb
FROM documents
WHERE deleted_at IS NULL
GROUP BY category
ORDER BY document_count DESC;

-- Most viewed/downloaded documents
SELECT 
    document_code,
    title,
    category,
    view_count,
    download_count,
    created_by_name,
    created_at
FROM document_library_view
ORDER BY (view_count + download_count) DESC
LIMIT 20;

-- =====================================================
-- AUDIT QUERIES
-- =====================================================

-- Recent audit log activity
SELECT 
    al.table_name,
    al.action,
    al.record_id,
    u.first_name || ' ' || u.last_name AS performed_by,
    al.created_at
FROM audit_logs al
LEFT JOIN user_accounts u ON al.performed_by = u.id
ORDER BY al.created_at DESC
LIMIT 100;

-- Audit trail for specific record
SELECT 
    action,
    old_values,
    new_values,
    changed_fields,
    performed_by,
    created_at
FROM audit_logs
WHERE table_name = 'issues' AND record_id = 1
ORDER BY created_at DESC;

-- Activity summary by user
SELECT 
    u.user_code,
    u.first_name || ' ' || u.last_name AS user_name,
    COUNT(*) AS total_actions,
    COUNT(CASE WHEN al.action = 'INSERT' THEN 1 END) AS inserts,
    COUNT(CASE WHEN al.action = 'UPDATE' THEN 1 END) AS updates,
    COUNT(CASE WHEN al.action = 'DELETE' THEN 1 END) AS deletes
FROM audit_logs al
JOIN user_accounts u ON al.performed_by = u.id
WHERE al.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY u.user_code, u.first_name, u.last_name
ORDER BY total_actions DESC;

-- =====================================================
-- DASHBOARD STATISTICS
-- =====================================================

-- System overview statistics
SELECT 
    'Total Users' AS metric,
    COUNT(*)::TEXT AS value
FROM user_accounts WHERE deleted_at IS NULL AND status = 'Active'
UNION ALL
SELECT 'Total Issues', COUNT(*)::TEXT FROM issues WHERE deleted_at IS NULL
UNION ALL
SELECT 'Active Issues', COUNT(*)::TEXT FROM issues WHERE status IN ('Active', 'Processing') AND deleted_at IS NULL
UNION ALL
SELECT 'Total Resolutions', COUNT(*)::TEXT FROM resolutions WHERE deleted_at IS NULL
UNION ALL
SELECT 'Active Resolutions', COUNT(*)::TEXT FROM resolutions WHERE status = 'Active' AND deleted_at IS NULL
UNION ALL
SELECT 'Total Meetings', COUNT(*)::TEXT FROM meetings WHERE deleted_at IS NULL
UNION ALL
SELECT 'Upcoming Meetings', COUNT(*)::TEXT FROM meetings WHERE meeting_date >= CURRENT_DATE AND status = 'Scheduled'
UNION ALL
SELECT 'Unread Notifications', COUNT(*)::TEXT FROM notifications WHERE is_read = FALSE;

-- Monthly activity trends
SELECT 
    DATE_TRUNC('month', created_at) AS month,
    COUNT(*) AS issues_created,
    COUNT(CASE WHEN status = 'Resolved' THEN 1 END) AS issues_resolved
FROM issues
WHERE created_at >= CURRENT_DATE - INTERVAL '12 months'
  AND deleted_at IS NULL
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;
