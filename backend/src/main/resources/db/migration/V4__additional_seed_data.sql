-- =====================================================
-- Inteko y'Abaturage - Additional Seed Data
-- Version: 4.0
-- Description: Add comments and participants to support full testing
-- =====================================================

-- =====================================================
-- 1. SEED ISSUE COMMENTS
-- =====================================================

INSERT INTO issue_comments (issue_id, comment_text, created_by, created_at) VALUES
((SELECT id FROM issues WHERE issue_code = 'I-001'), 'The engineering team has completed the initial survey.', (SELECT id FROM user_accounts WHERE user_code = 'U-002'), CURRENT_TIMESTAMP - INTERVAL '8 days'),
((SELECT id FROM issues WHERE issue_code = 'I-001'), 'Waiting for budget clearance from the district.', (SELECT id FROM user_accounts WHERE user_code = 'U-002'), CURRENT_TIMESTAMP - INTERVAL '5 days'),
((SELECT id FROM issues WHERE issue_code = 'I-002'), 'Emergency repair team has been notified.', (SELECT id FROM user_accounts WHERE user_code = 'U-002'), CURRENT_TIMESTAMP - INTERVAL '4 days');

-- =====================================================
-- 2. SEED RESOLUTION COMMENTS
-- =====================================================

INSERT INTO resolution_comments (resolution_id, comment_text, author_name, author_role, created_by, created_at) VALUES
((SELECT id FROM resolutions WHERE resolution_code = 'RES-001'), 'The materials have been ordered and are expected on site tomorrow.', 'Jean Paul Uwimana', 'Sector Official', (SELECT id FROM user_accounts WHERE user_code = 'U-002'), CURRENT_TIMESTAMP - INTERVAL '2 days'),
((SELECT id FROM resolutions WHERE resolution_code = 'RES-003'), 'Project completed and handed over to the community.', 'Claudine Mukasine', 'Sector Official', (SELECT id FROM user_accounts WHERE user_code = 'U-003'), CURRENT_TIMESTAMP - INTERVAL '2 days');

-- =====================================================
-- 3. SEED MEETING PARTICIPANTS
-- =====================================================

INSERT INTO meeting_participants (meeting_id, participant_name, id_number, phone, village_id, attendance_status, checked_in_at, created_at, created_by) VALUES
-- Meeting MTG-2024-001 (Kinyinya)
((SELECT id FROM meetings WHERE meeting_code = 'MTG-2024-001'), 'Habimana Jean', '1198580012345678', '+250788111222', (SELECT id FROM villages WHERE village_code = 'V-001'), 'Present', CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP - INTERVAL '30 days', (SELECT id FROM user_accounts WHERE user_code = 'U-005')),
((SELECT id FROM meetings WHERE meeting_code = 'MTG-2024-001'), 'Mukamana Marie', '1199080087654321', '+250788222333', (SELECT id FROM villages WHERE village_code = 'V-001'), 'Present', CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP - INTERVAL '30 days', (SELECT id FROM user_accounts WHERE user_code = 'U-005')),
((SELECT id FROM meetings WHERE meeting_code = 'MTG-2024-001'), 'Niyonzima Paul', '1198080023456123', '+250788333444', (SELECT id FROM villages WHERE village_code = 'V-002'), 'Present', CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP - INTERVAL '30 days', (SELECT id FROM user_accounts WHERE user_code = 'U-005')),
((SELECT id FROM meetings WHERE meeting_code = 'MTG-2024-001'), 'Uwase Alice', '1199580045612347', '+250788444555', (SELECT id FROM villages WHERE village_code = 'V-002'), 'Absent', NULL, CURRENT_TIMESTAMP - INTERVAL '30 days', (SELECT id FROM user_accounts WHERE user_code = 'U-005')),

-- Meeting MTG-2024-002 (Remera)
((SELECT id FROM meetings WHERE meeting_code = 'MTG-2024-002'), 'Mugisha David', '1198780044444444', '+250788444555', (SELECT id FROM villages WHERE village_code = 'V-009'), 'Present', CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP - INTERVAL '15 days', (SELECT id FROM user_accounts WHERE user_code = 'U-006')),
((SELECT id FROM meetings WHERE meeting_code = 'MTG-2024-002'), 'Uwimana Emmanuel', '1198080023456123', '+250788333444', (SELECT id FROM villages WHERE village_code = 'V-008'), 'Present', CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP - INTERVAL '15 days', (SELECT id FROM user_accounts WHERE user_code = 'U-006'));
