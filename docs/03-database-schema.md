# Database Schema Design

## Overview

This document defines the complete PostgreSQL database schema for the Inteko y'Abaturage system. The schema supports multi-level geographic hierarchy, role-based access control, meeting management, issue tracking, and resolution management.

## Entity Relationship Diagram

```
users
  ├── meetings (created_by)
  ├── issues (created_by, assigned_to)
  ├── resolutions (created_by, assigned_to)
  └── notifications (user_id)

sectors
  └── cells
      └── villages

meetings
  ├── meeting_participants
  └── meeting_documents

issues
  ├── resolutions
  └── issue_comments

resolutions
  ├── resolution_action_items
  ├── resolution_comments
  └── resolution_documents
```

## Core Tables

### 1. User Accounts Table

```sql
CREATE TABLE user_accounts (
    id BIGSERIAL PRIMARY KEY,
    user_code VARCHAR(20) UNIQUE NOT NULL, -- e.g., "U-001"
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    id_number VARCHAR(16) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    position VARCHAR(150),
    
    -- Role and Access
    role VARCHAR(50) NOT NULL CHECK (role IN ('Administrator', 'Sector Official', 'Meeting Secretary')),
    permissions VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    
    -- Geographic Assignment
    sector_id BIGINT,
    cell_id BIGINT,
    village_id BIGINT,
    
    -- Profile
    avatar_url TEXT,
    last_active_at TIMESTAMP,
    
    -- Audit Fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    deleted_at TIMESTAMP,
    deleted_by BIGINT,
    
    CONSTRAINT fk_user_sector FOREIGN KEY (sector_id) REFERENCES sectors(id),
    CONSTRAINT fk_user_cell FOREIGN KEY (cell_id) REFERENCES cells(id),
    CONSTRAINT fk_user_village FOREIGN KEY (village_id) REFERENCES villages(id)
);

CREATE INDEX idx_user_email ON user_accounts(email);
CREATE INDEX idx_user_code ON user_accounts(user_code);
CREATE INDEX idx_user_role ON user_accounts(role);
CREATE INDEX idx_user_status ON user_accounts(status);
```

### 2. Geographic Hierarchy

#### Sectors Table
```sql
CREATE TABLE sectors (
    id BIGSERIAL PRIMARY KEY,
    sector_code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    
    -- Audit Fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    
    CONSTRAINT fk_sector_created_by FOREIGN KEY (created_by) REFERENCES user_accounts(id),
    CONSTRAINT fk_sector_updated_by FOREIGN KEY (updated_by) REFERENCES user_accounts(id)
);

CREATE INDEX idx_sector_code ON sectors(sector_code);
```

#### Cells Table
```sql
CREATE TABLE cells (
    id BIGSERIAL PRIMARY KEY,
    cell_code VARCHAR(20) UNIQUE NOT NULL, -- e.g., "C-01"
    name VARCHAR(150) NOT NULL,
    sector_id BIGINT NOT NULL,
    description TEXT,
    
    -- Audit Fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    
    CONSTRAINT fk_cell_sector FOREIGN KEY (sector_id) REFERENCES sectors(id) ON DELETE CASCADE,
    CONSTRAINT fk_cell_created_by FOREIGN KEY (created_by) REFERENCES user_accounts(id),
    CONSTRAINT fk_cell_updated_by FOREIGN KEY (updated_by) REFERENCES user_accounts(id)
);

CREATE INDEX idx_cell_sector ON cells(sector_id);
CREATE INDEX idx_cell_code ON cells(cell_code);
```

#### Villages Table
```sql
CREATE TABLE villages (
    id BIGSERIAL PRIMARY KEY,
    village_code VARCHAR(20) UNIQUE NOT NULL, -- e.g., "V-01"
    name VARCHAR(150) NOT NULL,
    cell_id BIGINT NOT NULL,
    leader_name VARCHAR(150),
    leader_avatar_url TEXT,
    population INTEGER DEFAULT 0,
    
    -- Audit Fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    
    CONSTRAINT fk_village_cell FOREIGN KEY (cell_id) REFERENCES cells(id) ON DELETE CASCADE,
    CONSTRAINT fk_village_created_by FOREIGN KEY (created_by) REFERENCES user_accounts(id),
    CONSTRAINT fk_village_updated_by FOREIGN KEY (updated_by) REFERENCES user_accounts(id)
);

CREATE INDEX idx_village_cell ON villages(cell_id);
CREATE INDEX idx_village_code ON villages(village_code);
```

### 3. Meeting Management

#### Meetings Table
```sql
CREATE TABLE meetings (
    id BIGSERIAL PRIMARY KEY,
    meeting_code VARCHAR(30) UNIQUE NOT NULL, -- e.g., "#MTG-2023-089"
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Schedule
    meeting_date DATE NOT NULL,
    meeting_time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    
    -- Status and Tracking
    status VARCHAR(20) NOT NULL DEFAULT 'Scheduled' 
        CHECK (status IN ('Scheduled', 'Ongoing', 'Completed', 'Postponed', 'Cancelled')),
    participants_count INTEGER DEFAULT 0,
    target_count INTEGER NOT NULL DEFAULT 0,
    
    -- Geographic Context
    sector_id BIGINT NOT NULL,
    
    -- Audit Fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL,
    updated_by BIGINT,
    deleted_at TIMESTAMP,
    deleted_by BIGINT,
    
    CONSTRAINT fk_meeting_sector FOREIGN KEY (sector_id) REFERENCES sectors(id),
    CONSTRAINT fk_meeting_created_by FOREIGN KEY (created_by) REFERENCES user_accounts(id),
    CONSTRAINT fk_meeting_updated_by FOREIGN KEY (updated_by) REFERENCES user_accounts(id)
);

CREATE INDEX idx_meeting_code ON meetings(meeting_code);
CREATE INDEX idx_meeting_status ON meetings(status);
CREATE INDEX idx_meeting_date ON meetings(meeting_date);
CREATE INDEX idx_meeting_sector ON meetings(sector_id);
```

#### Meeting Participants Table
```sql
CREATE TABLE meeting_participants (
    id BIGSERIAL PRIMARY KEY,
    meeting_id BIGINT NOT NULL,
    participant_name VARCHAR(150) NOT NULL,
    id_number VARCHAR(16),
    phone VARCHAR(20),
    village_id BIGINT,
    attendance_status VARCHAR(20) DEFAULT 'Present' 
        CHECK (attendance_status IN ('Present', 'Absent', 'Excused')),
    checked_in_at TIMESTAMP,
    
    -- Audit Fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    
    CONSTRAINT fk_participant_meeting FOREIGN KEY (meeting_id) REFERENCES meetings(id) ON DELETE CASCADE,
    CONSTRAINT fk_participant_village FOREIGN KEY (village_id) REFERENCES villages(id),
    CONSTRAINT fk_participant_created_by FOREIGN KEY (created_by) REFERENCES user_accounts(id)
);

CREATE INDEX idx_participant_meeting ON meeting_participants(meeting_id);
CREATE INDEX idx_participant_id_number ON meeting_participants(id_number);
```

#### Meeting Documents Table
```sql
CREATE TABLE meeting_documents (
    id BIGSERIAL PRIMARY KEY,
    meeting_id BIGINT NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    document_type VARCHAR(50), -- e.g., "Minutes", "Agenda", "Attendance"
    file_path TEXT NOT NULL,
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    
    -- Audit Fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL,
    
    CONSTRAINT fk_meeting_doc_meeting FOREIGN KEY (meeting_id) REFERENCES meetings(id) ON DELETE CASCADE,
    CONSTRAINT fk_meeting_doc_created_by FOREIGN KEY (created_by) REFERENCES user_accounts(id)
);

CREATE INDEX idx_meeting_doc_meeting ON meeting_documents(meeting_id);
```

### 4. Issue Tracking

#### Issues Table
```sql
CREATE TABLE issues (
    id BIGSERIAL PRIMARY KEY,
    issue_code VARCHAR(20) UNIQUE NOT NULL, -- e.g., "I-001"
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Categorization
    category VARCHAR(50) NOT NULL 
        CHECK (category IN ('Infrastructure', 'Governance', 'Social', 'Economic', 'Land')),
    priority VARCHAR(20) DEFAULT 'Medium' 
        CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    status VARCHAR(20) NOT NULL DEFAULT 'Active' 
        CHECK (status IN ('Active', 'Processing', 'Resolved', 'Closed', 'Rejected')),
    
    -- Reporter Information
    reporter_name VARCHAR(150) NOT NULL,
    reporter_phone VARCHAR(20),
    reporter_id_number VARCHAR(16),
    
    -- Assignment
    assigned_to BIGINT,
    assigned_at TIMESTAMP,
    
    -- Geographic Context
    sector_id BIGINT,
    cell_id BIGINT,
    village_id BIGINT,
    
    -- Resolution
    resolved_at TIMESTAMP,
    resolution_summary TEXT,
    
    -- Audit Fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    deleted_at TIMESTAMP,
    deleted_by BIGINT,
    
    CONSTRAINT fk_issue_assigned_to FOREIGN KEY (assigned_to) REFERENCES user_accounts(id),
    CONSTRAINT fk_issue_sector FOREIGN KEY (sector_id) REFERENCES sectors(id),
    CONSTRAINT fk_issue_cell FOREIGN KEY (cell_id) REFERENCES cells(id),
    CONSTRAINT fk_issue_village FOREIGN KEY (village_id) REFERENCES villages(id),
    CONSTRAINT fk_issue_created_by FOREIGN KEY (created_by) REFERENCES user_accounts(id),
    CONSTRAINT fk_issue_updated_by FOREIGN KEY (updated_by) REFERENCES user_accounts(id)
);

CREATE INDEX idx_issue_code ON issues(issue_code);
CREATE INDEX idx_issue_status ON issues(status);
CREATE INDEX idx_issue_category ON issues(category);
CREATE INDEX idx_issue_assigned_to ON issues(assigned_to);
CREATE INDEX idx_issue_created_at ON issues(created_at);
```

#### Issue Comments Table
```sql
CREATE TABLE issue_comments (
    id BIGSERIAL PRIMARY KEY,
    issue_id BIGINT NOT NULL,
    comment_text TEXT NOT NULL,
    
    -- Audit Fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL,
    
    CONSTRAINT fk_issue_comment_issue FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE,
    CONSTRAINT fk_issue_comment_created_by FOREIGN KEY (created_by) REFERENCES user_accounts(id)
);

CREATE INDEX idx_issue_comment_issue ON issue_comments(issue_id);
CREATE INDEX idx_issue_comment_created_at ON issue_comments(created_at DESC);
```

### 5. Resolution Management

#### Resolutions Table
```sql
CREATE TABLE resolutions (
    id BIGSERIAL PRIMARY KEY,
    resolution_code VARCHAR(20) UNIQUE NOT NULL, -- e.g., "RES-012"
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    
    -- Linking
    linked_issue_id BIGINT,
    
    -- Assignment
    assigned_unit VARCHAR(150), -- e.g., "Environmental & Forestry Unit"
    responsible_officer VARCHAR(150),
    assigned_to BIGINT,
    
    -- Status and Progress
    status VARCHAR(20) NOT NULL DEFAULT 'Active' 
        CHECK (status IN ('Active', 'Concluded', 'On Hold', 'Cancelled')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    
    -- Dates
    due_date DATE,
    concluded_at TIMESTAMP,
    
    -- Audit Fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL,
    updated_by BIGINT,
    deleted_at TIMESTAMP,
    deleted_by BIGINT,
    
    CONSTRAINT fk_resolution_issue FOREIGN KEY (linked_issue_id) REFERENCES issues(id),
    CONSTRAINT fk_resolution_assigned_to FOREIGN KEY (assigned_to) REFERENCES user_accounts(id),
    CONSTRAINT fk_resolution_created_by FOREIGN KEY (created_by) REFERENCES user_accounts(id),
    CONSTRAINT fk_resolution_updated_by FOREIGN KEY (updated_by) REFERENCES user_accounts(id)
);

CREATE INDEX idx_resolution_code ON resolutions(resolution_code);
CREATE INDEX idx_resolution_status ON resolutions(status);
CREATE INDEX idx_resolution_linked_issue ON resolutions(linked_issue_id);
CREATE INDEX idx_resolution_assigned_to ON resolutions(assigned_to);
```

#### Resolution Action Items Table
```sql
CREATE TABLE resolution_action_items (
    id BIGSERIAL PRIMARY KEY,
    resolution_id BIGINT NOT NULL,
    item_label TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    completed_by BIGINT,
    display_order INTEGER DEFAULT 0,
    
    -- Audit Fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_action_item_resolution FOREIGN KEY (resolution_id) REFERENCES resolutions(id) ON DELETE CASCADE,
    CONSTRAINT fk_action_item_completed_by FOREIGN KEY (completed_by) REFERENCES user_accounts(id)
);

CREATE INDEX idx_action_item_resolution ON resolution_action_items(resolution_id);
```

#### Resolution Comments Table
```sql
CREATE TABLE resolution_comments (
    id BIGSERIAL PRIMARY KEY,
    resolution_id BIGINT NOT NULL,
    comment_text TEXT NOT NULL,
    author_name VARCHAR(150) NOT NULL,
    author_role VARCHAR(50),
    
    -- Audit Fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL,
    
    CONSTRAINT fk_resolution_comment_resolution FOREIGN KEY (resolution_id) REFERENCES resolutions(id) ON DELETE CASCADE,
    CONSTRAINT fk_resolution_comment_created_by FOREIGN KEY (created_by) REFERENCES user_accounts(id)
);

CREATE INDEX idx_resolution_comment_resolution ON resolution_comments(resolution_id);
CREATE INDEX idx_resolution_comment_created_at ON resolution_comments(created_at DESC);
```

#### Resolution Documents Table
```sql
CREATE TABLE resolution_documents (
    id BIGSERIAL PRIMARY KEY,
    resolution_id BIGINT NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    
    -- Audit Fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL,
    
    CONSTRAINT fk_resolution_doc_resolution FOREIGN KEY (resolution_id) REFERENCES resolutions(id) ON DELETE CASCADE,
    CONSTRAINT fk_resolution_doc_created_by FOREIGN KEY (created_by) REFERENCES user_accounts(id)
);

CREATE INDEX idx_resolution_doc_resolution ON resolution_documents(resolution_id);
```

### 6. Notification System

#### Notifications Table
```sql
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    notification_code VARCHAR(20) UNIQUE NOT NULL, -- e.g., "N-001"
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Categorization
    category VARCHAR(20) NOT NULL 
        CHECK (category IN ('Meeting', 'Issue', 'Resolution', 'System')),
    
    -- Target
    user_id BIGINT, -- NULL means broadcast to all
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    action_label VARCHAR(100),
    action_url VARCHAR(255),
    
    -- Audit Fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES user_accounts(id) ON DELETE CASCADE
);

CREATE INDEX idx_notification_user ON notifications(user_id);
CREATE INDEX idx_notification_is_read ON notifications(is_read);
CREATE INDEX idx_notification_category ON notifications(category);
CREATE INDEX idx_notification_created_at ON notifications(created_at DESC);
```

### 7. Document Library

#### Documents Table
```sql
CREATE TABLE documents (
    id BIGSERIAL PRIMARY KEY,
    document_code VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Categorization
    category VARCHAR(50) NOT NULL, -- e.g., "Policy", "Report", "Template", "Form"
    tags TEXT[], -- PostgreSQL array type for flexible tagging
    
    -- File Information
    file_path TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    version VARCHAR(20) DEFAULT '1.0',
    
    -- Access Control
    access_level VARCHAR(20) DEFAULT 'Public' 
        CHECK (access_level IN ('Public', 'Restricted', 'Confidential')),
    allowed_roles TEXT[], -- Array of allowed roles
    
    -- Statistics
    download_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    
    -- Audit Fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL,
    updated_by BIGINT,
    deleted_at TIMESTAMP,
    deleted_by BIGINT,
    
    CONSTRAINT fk_document_created_by FOREIGN KEY (created_by) REFERENCES user_accounts(id),
    CONSTRAINT fk_document_updated_by FOREIGN KEY (updated_by) REFERENCES user_accounts(id)
);

CREATE INDEX idx_document_code ON documents(document_code);
CREATE INDEX idx_document_category ON documents(category);
CREATE INDEX idx_document_access_level ON documents(access_level);
CREATE INDEX idx_document_tags ON documents USING GIN(tags);
```

## Audit Trail Table (Optional but Recommended)

```sql
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id BIGINT NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    
    -- User Context
    performed_by BIGINT,
    ip_address INET,
    user_agent TEXT,
    
    -- Timestamp
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_audit_performed_by FOREIGN KEY (performed_by) REFERENCES user_accounts(id)
);

CREATE INDEX idx_audit_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_record_id ON audit_logs(record_id);
CREATE INDEX idx_audit_performed_by ON audit_logs(performed_by);
CREATE INDEX idx_audit_created_at ON audit_logs(created_at DESC);
```

## Triggers for Automatic Updated_At

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at column
CREATE TRIGGER update_user_accounts_updated_at BEFORE UPDATE ON user_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON meetings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_issues_updated_at BEFORE UPDATE ON issues
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resolutions_updated_at BEFORE UPDATE ON resolutions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Views for Common Queries

```sql
-- Active Users View
CREATE VIEW active_users_view AS
SELECT 
    u.id,
    u.user_code,
    u.first_name || ' ' || u.last_name AS full_name,
    u.email,
    u.role,
    u.position,
    s.name AS sector_name,
    c.name AS cell_name,
    v.name AS village_name,
    u.last_active_at
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
    m.status,
    m.participants_count,
    m.target_count,
    CASE 
        WHEN m.target_count > 0 THEN (m.participants_count::FLOAT / m.target_count * 100)
        ELSE 0 
    END AS attendance_percentage,
    s.name AS sector_name
FROM meetings m
LEFT JOIN sectors s ON m.sector_id = s.id
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
    u.first_name || ' ' || u.last_name AS assigned_to_name,
    s.name AS sector_name,
    c.name AS cell_name,
    v.name AS village_name,
    i.created_at
FROM issues i
LEFT JOIN user_accounts u ON i.assigned_to = u.id
LEFT JOIN sectors s ON i.sector_id = s.id
LEFT JOIN cells c ON i.cell_id = c.id
LEFT JOIN villages v ON i.village_id = v.id
WHERE i.deleted_at IS NULL;
```

## Next Steps

→ `04-entity-models.md` - Create JPA entity classes based on this schema
