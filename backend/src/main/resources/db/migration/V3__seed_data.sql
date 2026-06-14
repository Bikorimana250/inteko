-- =====================================================
-- Inteko y'Abaturage - Seed Data
-- Version: 3.0
-- Description: Initial seed data for development and testing
-- =====================================================

-- =====================================================
-- 1. SEED SECTORS
-- =====================================================

INSERT INTO sectors (sector_code, name, description, created_at) VALUES
('SEC-001', 'Kinyinya', 'Kinyinya Sector in Gasabo District', CURRENT_TIMESTAMP),
('SEC-002', 'Remera', 'Remera Sector in Gasabo District', CURRENT_TIMESTAMP),
('SEC-003', 'Kimironko', 'Kimironko Sector in Gasabo District', CURRENT_TIMESTAMP);

-- =====================================================
-- 2. SEED CELLS
-- =====================================================

INSERT INTO cells (cell_code, name, sector_id, description, created_at) VALUES
-- Kinyinya Sector Cells
('C-001', 'Kamukina', (SELECT id FROM sectors WHERE sector_code = 'SEC-001'), 'Kamukina Cell in Kinyinya', CURRENT_TIMESTAMP),
('C-002', 'Nyagahinga', (SELECT id FROM sectors WHERE sector_code = 'SEC-001'), 'Nyagahinga Cell in Kinyinya', CURRENT_TIMESTAMP),
('C-003', 'Rukiri', (SELECT id FROM sectors WHERE sector_code = 'SEC-001'), 'Rukiri Cell in Kinyinya', CURRENT_TIMESTAMP),

-- Remera Sector Cells
('C-004', 'Nyabisindu', (SELECT id FROM sectors WHERE sector_code = 'SEC-002'), 'Nyabisindu Cell in Remera', CURRENT_TIMESTAMP),
('C-005', 'Kisimenti', (SELECT id FROM sectors WHERE sector_code = 'SEC-002'), 'Kisimenti Cell in Remera', CURRENT_TIMESTAMP),

-- Kimironko Sector Cells
('C-006', 'Kibagabaga', (SELECT id FROM sectors WHERE sector_code = 'SEC-003'), 'Kibagabaga Cell in Kimironko', CURRENT_TIMESTAMP),
('C-007', 'Bibare', (SELECT id FROM sectors WHERE sector_code = 'SEC-003'), 'Bibare Cell in Kimironko', CURRENT_TIMESTAMP);

-- =====================================================
-- 3. SEED VILLAGES
-- =====================================================

INSERT INTO villages (village_code, name, cell_id, leader_name, population, created_at) VALUES
-- Kamukina Cell Villages
('V-001', 'Agatare', (SELECT id FROM cells WHERE cell_code = 'C-001'), 'Jean Baptiste Mukama', 450, CURRENT_TIMESTAMP),
('V-002', 'Kabuye', (SELECT id FROM cells WHERE cell_code = 'C-001'), 'Marie Claire Uwera', 520, CURRENT_TIMESTAMP),
('V-003', 'Rugarama', (SELECT id FROM cells WHERE cell_code = 'C-001'), 'Emmanuel Niyonzima', 380, CURRENT_TIMESTAMP),

-- Nyagahinga Cell Villages
('V-004', 'Gahanga', (SELECT id FROM cells WHERE cell_code = 'C-002'), 'Grace Mukeshimana', 410, CURRENT_TIMESTAMP),
('V-005', 'Kimisagara', (SELECT id FROM cells WHERE cell_code = 'C-002'), 'Patrick Habimana', 495, CURRENT_TIMESTAMP),

-- Rukiri Cell Villages
('V-006', 'Nyamirambo', (SELECT id FROM cells WHERE cell_code = 'C-003'), 'Alice Uwimana', 560, CURRENT_TIMESTAMP),
('V-007', 'Kabeza', (SELECT id FROM cells WHERE cell_code = 'C-003'), 'Joseph Kalisa', 430, CURRENT_TIMESTAMP),

-- Nyabisindu Cell Villages
('V-008', 'Kacyiru', (SELECT id FROM cells WHERE cell_code = 'C-004'), 'Christine Mukamazimpaka', 620, CURRENT_TIMESTAMP),
('V-009', 'Kimihurura', (SELECT id FROM cells WHERE cell_code = 'C-004'), 'David Mugisha', 580, CURRENT_TIMESTAMP),

-- Kisimenti Cell Villages
('V-010', 'Gikondo', (SELECT id FROM cells WHERE cell_code = 'C-005'), 'Sarah Uwamahoro', 490, CURRENT_TIMESTAMP);

-- =====================================================
-- 4. SEED USER ACCOUNTS
-- =====================================================
-- Note: Password for all users is 'password123' hashed with BCrypt
-- Hash: $2a$10$XZq7FZ5Z7qR9QwLvWY4mUO8kGH4aWqJF9XJw8yVqK4qJ5Y2Z7qR9Q

INSERT INTO user_accounts (
    user_code, first_name, last_name, email, password_hash, 
    id_number, phone, position, role, permissions, status,
    sector_id, cell_id, village_id, created_at
) VALUES
-- Administrator
(
    'U-001', 'Admin', 'System', 'admin@inteko.gov.rw',
    '$2a$10$XZq7FZ5Z7qR9QwLvWY4mUO8kGH4aWqJF9XJw8yVqK4qJ5Y2Z7qR9Q',
    '1198780012345678', '+250788123456', 'System Administrator',
    'Administrator', 'ALL', 'Active',
    NULL, NULL, NULL, CURRENT_TIMESTAMP
),

-- Sector Officials
(
    'U-002', 'Jean Paul', 'Uwimana', 'jp.uwimana@kinyinya.gov.rw',
    '$2a$10$XZq7FZ5Z7qR9QwLvWY4mUO8kGH4aWqJF9XJw8yVqK4qJ5Y2Z7qR9Q',
    '1198780012345679', '+250788234567', 'Sector Executive Secretary',
    'Sector Official', 'SECTOR_MANAGE', 'Active',
    (SELECT id FROM sectors WHERE sector_code = 'SEC-001'), NULL, NULL, CURRENT_TIMESTAMP
),
(
    'U-003', 'Claudine', 'Mukasine', 'c.mukasine@remera.gov.rw',
    '$2a$10$XZq7FZ5Z7qR9QwLvWY4mUO8kGH4aWqJF9XJw8yVqK4qJ5Y2Z7qR9Q',
    '1198780012345680', '+250788345678', 'Sector Executive Secretary',
    'Sector Official', 'SECTOR_MANAGE', 'Active',
    (SELECT id FROM sectors WHERE sector_code = 'SEC-002'), NULL, NULL, CURRENT_TIMESTAMP
),
(
    'U-004', 'Emmanuel', 'Nsabimana', 'e.nsabimana@kimironko.gov.rw',
    '$2a$10$XZq7FZ5Z7qR9QwLvWY4mUO8kGH4aWqJF9XJw8yVqK4qJ5Y2Z7qR9Q',
    '1198780012345681', '+250788456789', 'Sector Executive Secretary',
    'Sector Official', 'SECTOR_MANAGE', 'Active',
    (SELECT id FROM sectors WHERE sector_code = 'SEC-003'), NULL, NULL, CURRENT_TIMESTAMP
),

-- Meeting Secretaries
(
    'U-005', 'Marie', 'Uwera', 'm.uwera@kinyinya.gov.rw',
    '$2a$10$XZq7FZ5Z7qR9QwLvWY4mUO8kGH4aWqJF9XJw8yVqK4qJ5Y2Z7qR9Q',
    '1198780012345682', '+250788567890', 'Meeting Secretary',
    'Meeting Secretary', 'MEETING_MANAGE', 'Active',
    (SELECT id FROM sectors WHERE sector_code = 'SEC-001'), 
    (SELECT id FROM cells WHERE cell_code = 'C-001'), NULL, CURRENT_TIMESTAMP
),
(
    'U-006', 'Patrick', 'Habimana', 'p.habimana@remera.gov.rw',
    '$2a$10$XZq7FZ5Z7qR9QwLvWY4mUO8kGH4aWqJF9XJw8yVqK4qJ5Y2Z7qR9Q',
    '1198780012345683', '+250788678901', 'Meeting Secretary',
    'Meeting Secretary', 'MEETING_MANAGE', 'Active',
    (SELECT id FROM sectors WHERE sector_code = 'SEC-002'),
    (SELECT id FROM cells WHERE cell_code = 'C-004'), NULL, CURRENT_TIMESTAMP
),
(
    'U-007', 'Grace', 'Mukeshimana', 'g.mukeshimana@kimironko.gov.rw',
    '$2a$10$XZq7FZ5Z7qR9QwLvWY4mUO8kGH4aWqJF9XJw8yVqK4qJ5Y2Z7qR9Q',
    '1198780012345684', '+250788789012', 'Meeting Secretary',
    'Meeting Secretary', 'MEETING_MANAGE', 'Active',
    (SELECT id FROM sectors WHERE sector_code = 'SEC-003'),
    (SELECT id FROM cells WHERE cell_code = 'C-006'), NULL, CURRENT_TIMESTAMP
);

-- =====================================================
-- 5. SEED MEETINGS
-- =====================================================

INSERT INTO meetings (
    meeting_code, title, description, meeting_date, meeting_time,
    location, status, target_count, sector_id, created_by, created_at
) VALUES
(
    'MTG-2024-001', 'Monthly Community Meeting - January',
    'Regular monthly meeting to discuss community issues and progress',
    '2024-01-15', '14:00:00', 'Kinyinya Sector Office',
    'Completed', 100,
    (SELECT id FROM sectors WHERE sector_code = 'SEC-001'),
    (SELECT id FROM user_accounts WHERE user_code = 'U-002'),
    CURRENT_TIMESTAMP - INTERVAL '30 days'
),
(
    'MTG-2024-002', 'Infrastructure Development Forum',
    'Discussion on upcoming infrastructure projects in the sector',
    '2024-02-20', '10:00:00', 'Remera Community Hall',
    'Completed', 80,
    (SELECT id FROM sectors WHERE sector_code = 'SEC-002'),
    (SELECT id FROM user_accounts WHERE user_code = 'U-003'),
    CURRENT_TIMESTAMP - INTERVAL '15 days'
),
(
    'MTG-2024-003', 'Youth Empowerment Session',
    'Meeting focused on youth employment and entrepreneurship opportunities',
    CURRENT_DATE + INTERVAL '7 days', '15:00:00', 'Kimironko Youth Center',
    'Scheduled', 120,
    (SELECT id FROM sectors WHERE sector_code = 'SEC-003'),
    (SELECT id FROM user_accounts WHERE user_code = 'U-004'),
    CURRENT_TIMESTAMP
);

-- Update participants count for completed meetings
UPDATE meetings SET participants_count = 92 WHERE meeting_code = 'MTG-2024-001';
UPDATE meetings SET participants_count = 75 WHERE meeting_code = 'MTG-2024-002';

-- =====================================================
-- 6. SEED ISSUES
-- =====================================================

INSERT INTO issues (
    issue_code, title, description, category, priority, status,
    reporter_name, reporter_phone, reporter_id_number,
    sector_id, cell_id, village_id, assigned_to, created_by, created_at
) VALUES
(
    'I-001', 'Road Repair Needed on Main Street',
    'The main road in Agatare village has multiple potholes that need urgent repair',
    'Infrastructure', 'High', 'Processing',
    'Jean Baptiste Mukama', '+250788111222', '1198780011111111',
    (SELECT id FROM sectors WHERE sector_code = 'SEC-001'),
    (SELECT id FROM cells WHERE cell_code = 'C-001'),
    (SELECT id FROM villages WHERE village_code = 'V-001'),
    (SELECT id FROM user_accounts WHERE user_code = 'U-002'),
    (SELECT id FROM user_accounts WHERE user_code = 'U-005'),
    CURRENT_TIMESTAMP - INTERVAL '10 days'
),
(
    'I-002', 'Water Supply Interruption',
    'Frequent water supply interruptions in Gahanga village affecting over 100 households',
    'Infrastructure', 'Critical', 'Active',
    'Grace Mukeshimana', '+250788222333', '1198780022222222',
    (SELECT id FROM sectors WHERE sector_code = 'SEC-001'),
    (SELECT id FROM cells WHERE cell_code = 'C-002'),
    (SELECT id FROM villages WHERE village_code = 'V-004'),
    (SELECT id FROM user_accounts WHERE user_code = 'U-002'),
    (SELECT id FROM user_accounts WHERE user_code = 'U-005'),
    CURRENT_TIMESTAMP - INTERVAL '5 days'
),
(
    'I-003', 'Land Dispute Resolution',
    'Boundary dispute between two families needs mediation',
    'Land', 'Medium', 'Active',
    'Christine Mukamazimpaka', '+250788333444', '1198780033333333',
    (SELECT id FROM sectors WHERE sector_code = 'SEC-002'),
    (SELECT id FROM cells WHERE cell_code = 'C-004'),
    (SELECT id FROM villages WHERE village_code = 'V-008'),
    (SELECT id FROM user_accounts WHERE user_code = 'U-003'),
    (SELECT id FROM user_accounts WHERE user_code = 'U-006'),
    CURRENT_TIMESTAMP - INTERVAL '3 days'
),
(
    'I-004', 'Street Lighting Installation',
    'Request for street lights in Kimihurura village for improved security',
    'Infrastructure', 'Medium', 'Resolved',
    'David Mugisha', '+250788444555', '1198780044444444',
    (SELECT id FROM sectors WHERE sector_code = 'SEC-002'),
    (SELECT id FROM cells WHERE cell_code = 'C-004'),
    (SELECT id FROM villages WHERE village_code = 'V-009'),
    (SELECT id FROM user_accounts WHERE user_code = 'U-003'),
    (SELECT id FROM user_accounts WHERE user_code = 'U-006'),
    CURRENT_TIMESTAMP - INTERVAL '20 days'
);

-- Update resolved issue
UPDATE issues 
SET resolved_at = CURRENT_TIMESTAMP - INTERVAL '2 days',
    resolution_summary = 'Street lights have been installed and are now operational'
WHERE issue_code = 'I-004';

-- =====================================================
-- 7. SEED RESOLUTIONS
-- =====================================================

INSERT INTO resolutions (
    resolution_code, title, summary, linked_issue_id,
    assigned_unit, responsible_officer, status, progress_percentage,
    due_date, assigned_to, created_by, created_at
) VALUES
(
    'RES-001', 'Road Maintenance Project - Agatare',
    'Comprehensive road repair project for Main Street in Agatare village',
    (SELECT id FROM issues WHERE issue_code = 'I-001'),
    'Infrastructure & Public Works', 'Eng. Patrick Mugabo',
    'Active', 45,
    CURRENT_DATE + INTERVAL '30 days',
    (SELECT id FROM user_accounts WHERE user_code = 'U-002'),
    (SELECT id FROM user_accounts WHERE user_code = 'U-002'),
    CURRENT_TIMESTAMP - INTERVAL '8 days'
),
(
    'RES-002', 'Water Supply Restoration - Gahanga',
    'Emergency water supply restoration and pipeline upgrade project',
    (SELECT id FROM issues WHERE issue_code = 'I-002'),
    'Water & Sanitation Unit', 'Jean Claude Habimana',
    'Active', 20,
    CURRENT_DATE + INTERVAL '15 days',
    (SELECT id FROM user_accounts WHERE user_code = 'U-002'),
    (SELECT id FROM user_accounts WHERE user_code = 'U-002'),
    CURRENT_TIMESTAMP - INTERVAL '4 days'
),
(
    'RES-003', 'Street Lighting Installation - Kimihurura',
    'Installation of solar-powered street lights in Kimihurura village',
    (SELECT id FROM issues WHERE issue_code = 'I-004'),
    'Infrastructure & Public Works', 'Marie Louise Umutesi',
    'Concluded', 100,
    CURRENT_DATE - INTERVAL '5 days',
    (SELECT id FROM user_accounts WHERE user_code = 'U-003'),
    (SELECT id FROM user_accounts WHERE user_code = 'U-003'),
    CURRENT_TIMESTAMP - INTERVAL '18 days'
);

-- Update concluded resolution
UPDATE resolutions 
SET concluded_at = CURRENT_TIMESTAMP - INTERVAL '2 days'
WHERE resolution_code = 'RES-003';

-- =====================================================
-- 8. SEED RESOLUTION ACTION ITEMS
-- =====================================================

INSERT INTO resolution_action_items (resolution_id, item_label, is_completed, display_order, created_at) VALUES
-- RES-001 Action Items
((SELECT id FROM resolutions WHERE resolution_code = 'RES-001'), 'Site assessment and measurement', TRUE, 1, CURRENT_TIMESTAMP),
((SELECT id FROM resolutions WHERE resolution_code = 'RES-001'), 'Budget approval from district', TRUE, 2, CURRENT_TIMESTAMP),
((SELECT id FROM resolutions WHERE resolution_code = 'RES-001'), 'Contractor selection and procurement', TRUE, 3, CURRENT_TIMESTAMP),
((SELECT id FROM resolutions WHERE resolution_code = 'RES-001'), 'Materials delivery to site', FALSE, 4, CURRENT_TIMESTAMP),
((SELECT id FROM resolutions WHERE resolution_code = 'RES-001'), 'Road repair execution', FALSE, 5, CURRENT_TIMESTAMP),
((SELECT id FROM resolutions WHERE resolution_code = 'RES-001'), 'Quality inspection and sign-off', FALSE, 6, CURRENT_TIMESTAMP),

-- RES-002 Action Items
((SELECT id FROM resolutions WHERE resolution_code = 'RES-002'), 'Pipeline inspection and damage assessment', TRUE, 1, CURRENT_TIMESTAMP),
((SELECT id FROM resolutions WHERE resolution_code = 'RES-002'), 'Emergency repair team deployment', FALSE, 2, CURRENT_TIMESTAMP),
((SELECT id FROM resolutions WHERE resolution_code = 'RES-002'), 'Temporary water supply arrangement', FALSE, 3, CURRENT_TIMESTAMP),
((SELECT id FROM resolutions WHERE resolution_code = 'RES-002'), 'Permanent pipeline replacement', FALSE, 4, CURRENT_TIMESTAMP),

-- RES-003 Action Items (All completed)
((SELECT id FROM resolutions WHERE resolution_code = 'RES-003'), 'Site survey and lighting design', TRUE, 1, CURRENT_TIMESTAMP),
((SELECT id FROM resolutions WHERE resolution_code = 'RES-003'), 'Solar panel and fixture procurement', TRUE, 2, CURRENT_TIMESTAMP),
((SELECT id FROM resolutions WHERE resolution_code = 'RES-003'), 'Installation of lighting poles', TRUE, 3, CURRENT_TIMESTAMP),
((SELECT id FROM resolutions WHERE resolution_code = 'RES-003'), 'Electrical connections and testing', TRUE, 4, CURRENT_TIMESTAMP),
((SELECT id FROM resolutions WHERE resolution_code = 'RES-003'), 'Community handover and training', TRUE, 5, CURRENT_TIMESTAMP);

-- =====================================================
-- 9. SEED NOTIFICATIONS
-- =====================================================

INSERT INTO notifications (
    notification_code, title, message, category, user_id,
    is_read, action_label, action_url, created_at
) VALUES
(
    'N-001', 'New Meeting Scheduled',
    'Youth Empowerment Session scheduled for next week',
    'Meeting', (SELECT id FROM user_accounts WHERE user_code = 'U-007'),
    FALSE, 'View Meeting', '/meetings/MTG-2024-003',
    CURRENT_TIMESTAMP - INTERVAL '2 hours'
),
(
    'N-002', 'Issue Assigned to You',
    'Water Supply Interruption issue has been assigned to you',
    'Issue', (SELECT id FROM user_accounts WHERE user_code = 'U-002'),
    TRUE, 'View Issue', '/issues/I-002',
    CURRENT_TIMESTAMP - INTERVAL '5 days'
),
(
    'N-003', 'Resolution Progress Update',
    'Road Maintenance Project is 45% complete',
    'Resolution', (SELECT id FROM user_accounts WHERE user_code = 'U-002'),
    FALSE, 'View Resolution', '/resolutions/RES-001',
    CURRENT_TIMESTAMP - INTERVAL '1 day'
);

-- =====================================================
-- 10. SEED DOCUMENTS
-- =====================================================

INSERT INTO documents (
    document_code, title, description, category, tags,
    file_path, file_name, file_size_bytes, mime_type,
    access_level, allowed_roles, created_by, created_at
) VALUES
(
    'DOC-001', 'Community Meeting Guidelines',
    'Official guidelines for organizing and conducting community meetings',
    'Policy', ARRAY['guidelines', 'meetings', 'procedures'],
    '/documents/policies/meeting-guidelines.pdf', 'meeting-guidelines.pdf',
    524288, 'application/pdf', 'Public', ARRAY['Administrator', 'Sector Official', 'Meeting Secretary'],
    (SELECT id FROM user_accounts WHERE user_code = 'U-001'),
    CURRENT_TIMESTAMP - INTERVAL '60 days'
),
(
    'DOC-002', 'Issue Reporting Template',
    'Standard template for reporting community issues',
    'Template', ARRAY['template', 'issues', 'reporting'],
    '/documents/templates/issue-report-template.docx', 'issue-report-template.docx',
    102400, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'Public', ARRAY['Administrator', 'Sector Official', 'Meeting Secretary'],
    (SELECT id FROM user_accounts WHERE user_code = 'U-001'),
    CURRENT_TIMESTAMP - INTERVAL '45 days'
),
(
    'DOC-003', 'Annual Community Report 2023',
    'Comprehensive annual report on community activities and achievements',
    'Report', ARRAY['report', 'annual', '2023'],
    '/documents/reports/annual-report-2023.pdf', 'annual-report-2023.pdf',
    2097152, 'application/pdf', 'Public', ARRAY['Administrator', 'Sector Official'],
    (SELECT id FROM user_accounts WHERE user_code = 'U-001'),
    CURRENT_TIMESTAMP - INTERVAL '90 days'
);

-- =====================================================
-- SEED DATA COMPLETE
-- =====================================================
