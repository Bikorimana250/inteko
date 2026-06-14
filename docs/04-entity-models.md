# JPA Entity Models

## Overview

This document defines the Java entity classes that map to the PostgreSQL database schema using JPA (Java Persistence API) annotations.

## Base Entity Classes

### Abstract Auditable Entity

```java
package rw.gov.inteko.backend.entity.base;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@Setter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class AuditableEntity {
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @CreatedBy
    @Column(name = "created_by")
    private Long createdBy;
    
    @LastModifiedBy
    @Column(name = "updated_by")
    private Long updatedBy;
    
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
    
    @Column(name = "deleted_by")
    private Long deletedBy;
    
    @Transient
    public boolean isDeleted() {
        return deletedAt != null;
    }
}
```

## Core Entity Classes

### 1. User Entity

```java
package rw.gov.inteko.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import rw.gov.inteko.backend.entity.base.AuditableEntity;
import rw.gov.inteko.backend.entity.enums.UserRole;
import rw.gov.inteko.backend.entity.enums.UserStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_accounts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends AuditableEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_code", unique = true, nullable = false, length = 20)
    private String userCode;
    
    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;
    
    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;
    
    @Column(name = "email", unique = true, nullable = false)
    private String email;
    
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;
    
    @Column(name = "id_number", unique = true, nullable = false, length = 16)
    private String idNumber;
    
    @Column(name = "phone", nullable = false, length = 20)
    private String phone;
    
    @Column(name = "position", length = 150)
    private String position;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 50)
    private UserRole role;
    
    @Column(name = "permissions", nullable = false, length = 50)
    private String permissions;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private UserStatus status = UserStatus.ACTIVE;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sector_id")
    private Sector sector;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cell_id")
    private Cell cell;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "village_id")
    private Village village;
    
    @Column(name = "avatar_url", columnDefinition = "TEXT")
    private String avatarUrl;
    
    @Column(name = "last_active_at")
    private LocalDateTime lastActiveAt;
    
    @Transient
    public String getFullName() {
        return firstName + " " + lastName;
    }
    
    @PrePersist
    protected void onCreate() {
        if (status == null) {
            status = UserStatus.ACTIVE;
        }
    }
}
```

### 2. Geographic Entities

#### Sector Entity
```java
package rw.gov.inteko.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import rw.gov.inteko.backend.entity.base.AuditableEntity;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sectors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sector extends AuditableEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "sector_code", unique = true, nullable = false, length = 20)
    private String sectorCode;
    
    @Column(name = "name", nullable = false, length = 150)
    private String name;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @OneToMany(mappedBy = "sector", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Cell> cells = new ArrayList<>();
}
```

#### Cell Entity
```java
package rw.gov.inteko.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import rw.gov.inteko.backend.entity.base.AuditableEntity;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cells")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cell extends AuditableEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "cell_code", unique = true, nullable = false, length = 20)
    private String cellCode;
    
    @Column(name = "name", nullable = false, length = 150)
    private String name;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sector_id", nullable = false)
    private Sector sector;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @OneToMany(mappedBy = "cell", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Village> villages = new ArrayList<>();
}
```

#### Village Entity
```java
package rw.gov.inteko.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import rw.gov.inteko.backend.entity.base.AuditableEntity;

@Entity
@Table(name = "villages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Village extends AuditableEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "village_code", unique = true, nullable = false, length = 20)
    private String villageCode;
    
    @Column(name = "name", nullable = false, length = 150)
    private String name;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cell_id", nullable = false)
    private Cell cell;
    
    @Column(name = "leader_name", length = 150)
    private String leaderName;
    
    @Column(name = "leader_avatar_url", columnDefinition = "TEXT")
    private String leaderAvatarUrl;
    
    @Column(name = "population")
    private Integer population = 0;
}
```

### 3. Meeting Entity

```java
package rw.gov.inteko.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import rw.gov.inteko.backend.entity.base.AuditableEntity;
import rw.gov.inteko.backend.entity.enums.MeetingStatus;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "meetings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Meeting extends AuditableEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "meeting_code", unique = true, nullable = false, length = 30)
    private String meetingCode;
    
    @Column(name = "title", nullable = false)
    private String title;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "meeting_date", nullable = false)
    private LocalDate meetingDate;
    
    @Column(name = "meeting_time", nullable = false)
    private LocalTime meetingTime;
    
    @Column(name = "location", nullable = false)
    private String location;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private MeetingStatus status = MeetingStatus.SCHEDULED;
    
    @Column(name = "participants_count")
    private Integer participantsCount = 0;
    
    @Column(name = "target_count", nullable = false)
    private Integer targetCount = 0;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sector_id", nullable = false)
    private Sector sector;
    
    @OneToMany(mappedBy = "meeting", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<MeetingParticipant> participants = new ArrayList<>();
    
    @OneToMany(mappedBy = "meeting", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<MeetingDocument> documents = new ArrayList<>();
    
    @Transient
    public Double getAttendancePercentage() {
        if (targetCount == null || targetCount == 0) {
            return 0.0;
        }
        return (participantsCount.doubleValue() / targetCount) * 100;
    }
}
```

#### Meeting Participant Entity
```java
package rw.gov.inteko.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import rw.gov.inteko.backend.entity.enums.AttendanceStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "meeting_participants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MeetingParticipant {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meeting_id", nullable = false)
    private Meeting meeting;
    
    @Column(name = "participant_name", nullable = false, length = 150)
    private String participantName;
    
    @Column(name = "id_number", length = 16)
    private String idNumber;
    
    @Column(name = "phone", length = 20)
    private String phone;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "village_id")
    private Village village;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "attendance_status", length = 20)
    private AttendanceStatus attendanceStatus = AttendanceStatus.PRESENT;
    
    @Column(name = "checked_in_at")
    private LocalDateTime checkedInAt;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "created_by")
    private Long createdBy;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (attendanceStatus == null) {
            attendanceStatus = AttendanceStatus.PRESENT;
        }
    }
}
```

### 4. Issue Entity

```java
package rw.gov.inteko.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import rw.gov.inteko.backend.entity.base.AuditableEntity;
import rw.gov.inteko.backend.entity.enums.IssueCategory;
import rw.gov.inteko.backend.entity.enums.IssuePriority;
import rw.gov.inteko.backend.entity.enums.IssueStatus;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "issues")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Issue extends AuditableEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "issue_code", unique = true, nullable = false, length = 20)
    private String issueCode;
    
    @Column(name = "title", nullable = false)
    private String title;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false, length = 50)
    private IssueCategory category;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "priority", length = 20)
    private IssuePriority priority = IssuePriority.MEDIUM;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private IssueStatus status = IssueStatus.ACTIVE;
    
    @Column(name = "reporter_name", nullable = false, length = 150)
    private String reporterName;
    
    @Column(name = "reporter_phone", length = 20)
    private String reporterPhone;
    
    @Column(name = "reporter_id_number", length = 16)
    private String reporterIdNumber;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private User assignedTo;
    
    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sector_id")
    private Sector sector;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cell_id")
    private Cell cell;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "village_id")
    private Village village;
    
    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;
    
    @Column(name = "resolution_summary", columnDefinition = "TEXT")
    private String resolutionSummary;
    
    @OneToMany(mappedBy = "issue", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<IssueComment> comments = new ArrayList<>();
    
    @OneToMany(mappedBy = "linkedIssue", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Resolution> resolutions = new ArrayList<>();
}
```

#### Issue Comment Entity
```java
package rw.gov.inteko.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "issue_comments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IssueComment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issue_id", nullable = false)
    private Issue issue;
    
    @Column(name = "comment_text", nullable = false, columnDefinition = "TEXT")
    private String commentText;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "created_by", nullable = false)
    private Long createdBy;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
```

### 5. Resolution Entity

```java
package rw.gov.inteko.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import rw.gov.inteko.backend.entity.base.AuditableEntity;
import rw.gov.inteko.backend.entity.enums.ResolutionStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "resolutions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resolution extends AuditableEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "resolution_code", unique = true, nullable = false, length = 20)
    private String resolutionCode;
    
    @Column(name = "title", nullable = false)
    private String title;
    
    @Column(name = "summary", nullable = false, columnDefinition = "TEXT")
    private String summary;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "linked_issue_id")
    private Issue linkedIssue;
    
    @Column(name = "assigned_unit", length = 150)
    private String assignedUnit;
    
    @Column(name = "responsible_officer", length = 150)
    private String responsibleOfficer;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private User assignedTo;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private ResolutionStatus status = ResolutionStatus.ACTIVE;
    
    @Column(name = "progress_percentage")
    private Integer progressPercentage = 0;
    
    @Column(name = "due_date")
    private LocalDate dueDate;
    
    @Column(name = "concluded_at")
    private LocalDateTime concludedAt;
    
    @OneToMany(mappedBy = "resolution", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("display_order ASC")
    @Builder.Default
    private List<ResolutionActionItem> actionItems = new ArrayList<>();
    
    @OneToMany(mappedBy = "resolution", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("created_at DESC")
    @Builder.Default
    private List<ResolutionComment> comments = new ArrayList<>();
    
    @OneToMany(mappedBy = "resolution", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ResolutionDocument> documents = new ArrayList<>();
    
    public void calculateProgress() {
        if (actionItems.isEmpty()) {
            progressPercentage = 0;
            return;
        }
        long completedCount = actionItems.stream()
                .filter(ResolutionActionItem::getIsCompleted)
                .count();
        progressPercentage = (int) ((completedCount * 100.0) / actionItems.size());
    }
}
```

#### Resolution Action Item Entity
```java
package rw.gov.inteko.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "resolution_action_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResolutionActionItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resolution_id", nullable = false)
    private Resolution resolution;
    
    @Column(name = "item_label", nullable = false, columnDefinition = "TEXT")
    private String itemLabel;
    
    @Column(name = "is_completed")
    private Boolean isCompleted = false;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    @Column(name = "completed_by")
    private Long completedBy;
    
    @Column(name = "display_order")
    private Integer displayOrder = 0;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (isCompleted == null) {
            isCompleted = false;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

### 6. Notification Entity

```java
package rw.gov.inteko.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import rw.gov.inteko.backend.entity.enums.NotificationCategory;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "notification_code", unique = true, nullable = false, length = 20)
    private String notificationCode;
    
    @Column(name = "title", nullable = false)
    private String title;
    
    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false, length = 20)
    private NotificationCategory category;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(name = "is_read")
    private Boolean isRead = false;
    
    @Column(name = "read_at")
    private LocalDateTime readAt;
    
    @Column(name = "action_label", length = 100)
    private String actionLabel;
    
    @Column(name = "action_url")
    private String actionUrl;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (isRead == null) {
            isRead = false;
        }
    }
}
```

### 7. Document Entity

```java
package rw.gov.inteko.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import rw.gov.inteko.backend.entity.base.AuditableEntity;
import rw.gov.inteko.backend.entity.enums.AccessLevel;

@Entity
@Table(name = "documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Document extends AuditableEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "document_code", unique = true, nullable = false, length = 20)
    private String documentCode;
    
    @Column(name = "title", nullable = false)
    private String title;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "category", nullable = false, length = 50)
    private String category;
    
    @Column(name = "tags", columnDefinition = "TEXT[]")
    private String[] tags;
    
    @Column(name = "file_path", nullable = false, columnDefinition = "TEXT")
    private String filePath;
    
    @Column(name = "file_name", nullable = false)
    private String fileName;
    
    @Column(name = "file_size_bytes")
    private Long fileSizeBytes;
    
    @Column(name = "mime_type", length = 100)
    private String mimeType;
    
    @Column(name = "version", length = 20)
    private String version = "1.0";
    
    @Enumerated(EnumType.STRING)
    @Column(name = "access_level", length = 20)
    private AccessLevel accessLevel = AccessLevel.PUBLIC;
    
    @Column(name = "allowed_roles", columnDefinition = "TEXT[]")
    private String[] allowedRoles;
    
    @Column(name = "download_count")
    private Integer downloadCount = 0;
    
    @Column(name = "view_count")
    private Integer viewCount = 0;
    
    public void incrementDownloadCount() {
        this.downloadCount++;
    }
    
    public void incrementViewCount() {
        this.viewCount++;
    }
}
```

## Enum Classes

### UserRole
```java
package rw.gov.inteko.backend.entity.enums;

public enum UserRole {
    ADMINISTRATOR("Administrator"),
    SECTOR_OFFICIAL("Sector Official"),
    MEETING_SECRETARY("Meeting Secretary");
    
    private final String displayName;
    
    UserRole(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
```

### UserStatus, MeetingStatus, IssueCategory, IssueStatus, ResolutionStatus, NotificationCategory, AttendanceStatus

```java
package rw.gov.inteko.backend.entity.enums;

public enum UserStatus { ACTIVE, INACTIVE }
public enum MeetingStatus { SCHEDULED, ONGOING, COMPLETED, POSTPONED, CANCELLED }
public enum IssueCategory { INFRASTRUCTURE, GOVERNANCE, SOCIAL, ECONOMIC, LAND }
public enum IssuePriority { LOW, MEDIUM, HIGH, CRITICAL }
public enum IssueStatus { ACTIVE, PROCESSING, RESOLVED, CLOSED, REJECTED }
public enum ResolutionStatus { ACTIVE, CONCLUDED, ON_HOLD, CANCELLED }
public enum NotificationCategory { MEETING, ISSUE, RESOLUTION, SYSTEM }
public enum AttendanceStatus { PRESENT, ABSENT, EXCUSED }
public enum AccessLevel { PUBLIC, RESTRICTED, CONFIDENTIAL }
```

## Next Steps

→ `05-repository-layer.md` - Create repository interfaces for data access
