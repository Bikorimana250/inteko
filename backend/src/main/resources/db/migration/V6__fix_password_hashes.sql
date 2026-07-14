-- Fix password hashes for all seeded users
-- Plain text password: password123
-- BCrypt hash (cost 10): $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL4/nO3q

UPDATE user_accounts
SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL4/nO3q'
WHERE user_code IN ('U-001', 'U-002', 'U-003', 'U-004', 'U-005', 'U-006', 'U-007');
