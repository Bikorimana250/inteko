-- =====================================================
-- Inteko y'Abaturage - Fix Audit Columns
-- Version: 5.0
-- Description: Add missing deleted_at and deleted_by columns to geographic tables
-- =====================================================

ALTER TABLE sectors ADD COLUMN deleted_at TIMESTAMP;
ALTER TABLE sectors ADD COLUMN deleted_by BIGINT;

ALTER TABLE cells ADD COLUMN deleted_at TIMESTAMP;
ALTER TABLE cells ADD COLUMN deleted_by BIGINT;

ALTER TABLE villages ADD COLUMN deleted_at TIMESTAMP;
ALTER TABLE villages ADD COLUMN deleted_by BIGINT;

-- Add foreign key constraints for deleted_by
ALTER TABLE sectors ADD CONSTRAINT fk_sector_deleted_by FOREIGN KEY (deleted_by) REFERENCES user_accounts(id);
ALTER TABLE cells ADD CONSTRAINT fk_cell_deleted_by FOREIGN KEY (deleted_by) REFERENCES user_accounts(id);
ALTER TABLE villages ADD CONSTRAINT fk_village_deleted_by FOREIGN KEY (deleted_by) REFERENCES user_accounts(id);
