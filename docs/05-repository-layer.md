# Repository Layer

## Overview

This document defines Spring Data JPA repository interfaces for database operations. These interfaces provide CRUD operations and custom query methods.

## Base Configuration

### Enable JPA Auditing

```java
package rw.gov.inteko.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
public class JpaConfig {
    
    @Bean
    public AuditorAware<Long> auditorProvider() {
        return () -> {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication == null || !authentication.isAuthenticated() 
                || "anonymousUser".equals(authentication.getPrincipal())) {
                return Optional.empty();
            }
            
            // Assuming UserPrincipal has getId() method
            return Optional.of(((UserPrincipal) authentication.getPrincipal()).getId());
        };
    }
}
```

## Repository Interfaces

### 1. User Repository

```java
package rw.gov.inteko.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import rw.gov.inteko.backend.entity.User;
import rw.gov.inteko.backend.entity.enums.UserRole;
import rw.gov.inteko.backend.entity.enums.UserStatus;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Basic queries
    Optional<User> findByEmail(String email);
    
    Optional<User> findByUserCode(String userCode);
    
    Optional<User> findByIdNumber(String idNumber);
    
    boolean existsByEmail(String email);
    
    boolean existsByIdNumber(String idNumber);
    
    boolean existsByUserCode(String userCode);
    
    // Status and role queries
    List<User> findByStatus(UserStatus status);
    
    List<User> findByRole(UserRole role);
    
    List<User> findByStatusAndRole(UserStatus status, UserRole role);
    
    @Query("SELECT u FROM User u WHERE u.deletedAt IS NULL")
    List<User> findAllActiveUsers();
    
    @Query("SELECT u FROM User u WHERE u.status = :status AND u.deletedAt IS NULL")
    List<User> findActiveUsersByStatus(@Param("status") UserStatus status);
    
    // Geographic queries
    @Query("SELECT u FROM User u WHERE u.sector.id = :sectorId AND u.deletedAt IS NULL")
    List<User> findBySector(@Param("sectorId") Long sectorId);
    
    @Query("SELECT u FROM User u WHERE u.cell.id = :cellId AND u.deletedAt IS NULL")
    List<User> findByCell(@Param("cellId") Long cellId);
    
    // Search queries
    @Query("SELECT u FROM User u WHERE u.deletedAt IS NULL AND " +
           "(LOWER(u.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(u.phone) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<User> searchUsers(@Param("keyword") String keyword, Pageable pageable);
    
    // Statistics
    @Query("SELECT COUNT(u) FROM User u WHERE u.status = :status AND u.deletedAt IS NULL")
    Long countByStatus(@Param("status") UserStatus status);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role AND u.deletedAt IS NULL")
    Long countByRole(@Param("role") UserRole role);
}
```

### 2. Geographic Repositories

#### Sector Repository
```java
package rw.gov.inteko.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import rw.gov.inteko.backend.entity.Sector;

import java.util.Optional;

@Repository
public interface SectorRepository extends JpaRepository<Sector, Long> {
    
    Optional<Sector> findBySectorCode(String sectorCode);
    
    Optional<Sector> findByName(String name);
    
    boolean existsBySectorCode(String sectorCode);
    
    @Query("SELECT COUNT(c) FROM Cell c WHERE c.sector.id = :sectorId")
    Long countCellsBySectorId(Long sectorId);
}
```

#### Cell Repository
```java
package rw.gov.inteko.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import rw.gov.inteko.backend.entity.Cell;

import java.util.List;
import java.util.Optional;

@Repository
public interface CellRepository extends JpaRepository<Cell, Long> {
    
    Optional<Cell> findByCellCode(String cellCode);
    
    List<Cell> findBySectorId(Long sectorId);
    
    boolean existsByCellCode(String cellCode);
    
    @Query("SELECT COUNT(v) FROM Village v WHERE v.cell.id = :cellId")
    Long countVillagesByCellId(Long cellId);
}
```

#### Village Repository
```java
package rw.gov.inteko.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import rw.gov.inteko.backend.entity.Village;

import java.util.List;
import java.util.Optional;

@Repository
public interface VillageRepository extends JpaRepository<Village, Long> {
    
    Optional<Village> findByVillageCode(String villageCode);
    
    List<Village> findByCellId(Long cellId);
    
    @Query("SELECT v FROM Village v WHERE v.cell.sector.id = :sectorId")
    List<Village> findBySectorId(Long sectorId);
    
    boolean existsByVillageCode(String villageCode);
    
    @Query("SELECT SUM(v.population) FROM Village v WHERE v.cell.id = :cellId")
    Integer getTotalPopulationByCell(Long cellId);
    
    @Query("SELECT SUM(v.population) FROM Village v WHERE v.cell.sector.id = :sectorId")
    Integer getTotalPopulationBySector(Long sectorId);
}
```

### 3. Meeting Repository

```java
package rw.gov.inteko.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import rw.gov.inteko.backend.entity.Meeting;
import rw.gov.inteko.backend.entity.enums.MeetingStatus;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MeetingRepository extends JpaRepository<Meeting, Long> {
    
    Optional<Meeting> findByMeetingCode(String meetingCode);
    
    @Query("SELECT m FROM Meeting m WHERE m.deletedAt IS NULL ORDER BY m.meetingDate DESC, m.meetingTime DESC")
    List<Meeting> findAllActiveMeetings();
    
    @Query("SELECT m FROM Meeting m WHERE m.status = :status AND m.deletedAt IS NULL")
    List<Meeting> findByStatus(@Param("status") MeetingStatus status);
    
    @Query("SELECT m FROM Meeting m WHERE m.sector.id = :sectorId AND m.deletedAt IS NULL")
    List<Meeting> findBySector(@Param("sectorId") Long sectorId);
    
    @Query("SELECT m FROM Meeting m WHERE m.meetingDate BETWEEN :startDate AND :endDate AND m.deletedAt IS NULL")
    List<Meeting> findByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT m FROM Meeting m WHERE m.meetingDate >= :date AND m.deletedAt IS NULL ORDER BY m.meetingDate ASC, m.meetingTime ASC")
    List<Meeting> findUpcomingMeetings(@Param("date") LocalDate date);
    
    @Query("SELECT m FROM Meeting m WHERE m.deletedAt IS NULL AND " +
           "(LOWER(m.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(m.location) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Meeting> searchMeetings(@Param("keyword") String keyword, Pageable pageable);
    
    // Statistics
    @Query("SELECT COUNT(m) FROM Meeting m WHERE m.status = :status AND m.deletedAt IS NULL")
    Long countByStatus(@Param("status") MeetingStatus status);
    
    @Query("SELECT AVG(m.participantsCount * 100.0 / m.targetCount) FROM Meeting m " +
           "WHERE m.status = 'COMPLETED' AND m.targetCount > 0 AND m.deletedAt IS NULL")
    Double getAverageAttendanceRate();
}
```

### 4. Meeting Participant Repository

```java
package rw.gov.inteko.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import rw.gov.inteko.backend.entity.MeetingParticipant;

import java.util.List;

@Repository
public interface MeetingParticipantRepository extends JpaRepository<MeetingParticipant, Long> {
    
    List<MeetingParticipant> findByMeetingId(Long meetingId);
    
    @Query("SELECT COUNT(mp) FROM MeetingParticipant mp WHERE mp.meeting.id = :meetingId")
    Long countByMeetingId(Long meetingId);
    
    @Query("SELECT COUNT(mp) FROM MeetingParticipant mp " +
           "WHERE mp.meeting.id = :meetingId AND mp.attendanceStatus = 'PRESENT'")
    Long countPresentByMeetingId(Long meetingId);
    
    boolean existsByMeetingIdAndIdNumber(Long meetingId, String idNumber);
}
```

### 5. Issue Repository

```java
package rw.gov.inteko.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import rw.gov.inteko.backend.entity.Issue;
import rw.gov.inteko.backend.entity.enums.IssueCategory;
import rw.gov.inteko.backend.entity.enums.IssueStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {
    
    Optional<Issue> findByIssueCode(String issueCode);
    
    @Query("SELECT i FROM Issue i WHERE i.deletedAt IS NULL ORDER BY i.createdAt DESC")
    List<Issue> findAllActiveIssues();
    
    @Query("SELECT i FROM Issue i WHERE i.status = :status AND i.deletedAt IS NULL")
    List<Issue> findByStatus(@Param("status") IssueStatus status);
    
    @Query("SELECT i FROM Issue i WHERE i.category = :category AND i.deletedAt IS NULL")
    List<Issue> findByCategory(@Param("category") IssueCategory category);
    
    @Query("SELECT i FROM Issue i WHERE i.assignedTo.id = :userId AND i.deletedAt IS NULL")
    List<Issue> findByAssignedTo(@Param("userId") Long userId);
    
    @Query("SELECT i FROM Issue i WHERE i.sector.id = :sectorId AND i.deletedAt IS NULL")
    List<Issue> findBySector(@Param("sectorId") Long sectorId);
    
    @Query("SELECT i FROM Issue i WHERE i.createdAt BETWEEN :startDate AND :endDate AND i.deletedAt IS NULL")
    List<Issue> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, 
                                       @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT i FROM Issue i WHERE i.deletedAt IS NULL AND " +
           "(LOWER(i.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(i.reporterName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(i.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Issue> searchIssues(@Param("keyword") String keyword, Pageable pageable);
    
    // Statistics
    @Query("SELECT COUNT(i) FROM Issue i WHERE i.status = :status AND i.deletedAt IS NULL")
    Long countByStatus(@Param("status") IssueStatus status);
    
    @Query("SELECT i.category, COUNT(i) FROM Issue i WHERE i.deletedAt IS NULL GROUP BY i.category")
    List<Object[]> countByCategory();
    
    @Query("SELECT COUNT(i) FROM Issue i WHERE i.assignedTo.id = :userId " +
           "AND i.status IN ('ACTIVE', 'PROCESSING') AND i.deletedAt IS NULL")
    Long countPendingByAssignedTo(@Param("userId") Long userId);
}
```

### 6. Resolution Repository

```java
package rw.gov.inteko.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import rw.gov.inteko.backend.entity.Resolution;
import rw.gov.inteko.backend.entity.enums.ResolutionStatus;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ResolutionRepository extends JpaRepository<Resolution, Long> {
    
    Optional<Resolution> findByResolutionCode(String resolutionCode);
    
    @Query("SELECT r FROM Resolution r WHERE r.deletedAt IS NULL ORDER BY r.createdAt DESC")
    List<Resolution> findAllActiveResolutions();
    
    @Query("SELECT r FROM Resolution r WHERE r.status = :status AND r.deletedAt IS NULL")
    List<Resolution> findByStatus(@Param("status") ResolutionStatus status);
    
    @Query("SELECT r FROM Resolution r WHERE r.linkedIssue.id = :issueId AND r.deletedAt IS NULL")
    List<Resolution> findByLinkedIssueId(@Param("issueId") Long issueId);
    
    @Query("SELECT r FROM Resolution r WHERE r.assignedTo.id = :userId AND r.deletedAt IS NULL")
    List<Resolution> findByAssignedTo(@Param("userId") Long userId);
    
    @Query("SELECT r FROM Resolution r WHERE r.dueDate < :date " +
           "AND r.status = 'ACTIVE' AND r.deletedAt IS NULL")
    List<Resolution> findOverdueResolutions(@Param("date") LocalDate date);
    
    @Query("SELECT r FROM Resolution r WHERE r.deletedAt IS NULL AND " +
           "(LOWER(r.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(r.summary) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(r.assignedUnit) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Resolution> searchResolutions(@Param("keyword") String keyword, Pageable pageable);
    
    // Statistics
    @Query("SELECT COUNT(r) FROM Resolution r WHERE r.status = :status AND r.deletedAt IS NULL")
    Long countByStatus(@Param("status") ResolutionStatus status);
    
    @Query("SELECT AVG(r.progressPercentage) FROM Resolution r " +
           "WHERE r.status = 'ACTIVE' AND r.deletedAt IS NULL")
    Double getAverageProgress();
    
    @Query("SELECT COUNT(r) FROM Resolution r WHERE r.assignedTo.id = :userId " +
           "AND r.status = 'ACTIVE' AND r.deletedAt IS NULL")
    Long countActiveByAssignedTo(@Param("userId") Long userId);
}
```

### 7. Notification Repository

```java
package rw.gov.inteko.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import rw.gov.inteko.backend.entity.Notification;
import rw.gov.inteko.backend.entity.enums.NotificationCategory;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId ORDER BY n.createdAt DESC")
    List<Notification> findByUserId(@Param("userId") Long userId);
    
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId ORDER BY n.createdAt DESC")
    Page<Notification> findByUserId(@Param("userId") Long userId, Pageable pageable);
    
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND n.isRead = false ORDER BY n.createdAt DESC")
    List<Notification> findUnreadByUserId(@Param("userId") Long userId);
    
    @Query("SELECT n FROM Notification n WHERE n.user IS NULL ORDER BY n.createdAt DESC")
    List<Notification> findBroadcastNotifications();
    
    @Query("SELECT n FROM Notification n WHERE n.category = :category ORDER BY n.createdAt DESC")
    List<Notification> findByCategory(@Param("category") NotificationCategory category);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user.id = :userId AND n.isRead = false")
    Long countUnreadByUserId(@Param("userId") Long userId);
    
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true, n.readAt = CURRENT_TIMESTAMP WHERE n.user.id = :userId")
    void markAllAsReadForUser(@Param("userId") Long userId);
}
```

### 8. Document Repository

```java
package rw.gov.inteko.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import rw.gov.inteko.backend.entity.Document;
import rw.gov.inteko.backend.entity.enums.AccessLevel;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    
    Optional<Document> findByDocumentCode(String documentCode);
    
    @Query("SELECT d FROM Document d WHERE d.deletedAt IS NULL ORDER BY d.createdAt DESC")
    List<Document> findAllActiveDocuments();
    
    @Query("SELECT d FROM Document d WHERE d.category = :category AND d.deletedAt IS NULL")
    List<Document> findByCategory(@Param("category") String category);
    
    @Query("SELECT d FROM Document d WHERE d.accessLevel = :accessLevel AND d.deletedAt IS NULL")
    List<Document> findByAccessLevel(@Param("accessLevel") AccessLevel accessLevel);
    
    @Query("SELECT d FROM Document d WHERE :tag = ANY(d.tags) AND d.deletedAt IS NULL")
    List<Document> findByTag(@Param("tag") String tag);
    
    @Query("SELECT d FROM Document d WHERE d.deletedAt IS NULL AND " +
           "(LOWER(d.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(d.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(d.category) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Document> searchDocuments(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT d FROM Document d WHERE d.deletedAt IS NULL ORDER BY d.downloadCount DESC")
    Page<Document> findMostDownloaded(Pageable pageable);
}
```

## Custom Repository Implementation (Advanced)

For complex queries that can't be expressed with Spring Data JPA query methods:

```java
package rw.gov.inteko.backend.repository.custom;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.*;
import org.springframework.stereotype.Repository;
import rw.gov.inteko.backend.entity.Issue;
import rw.gov.inteko.backend.entity.enums.IssueCategory;
import rw.gov.inteko.backend.entity.enums.IssueStatus;

import java.util.ArrayList;
import java.util.List;

@Repository
public class CustomIssueRepositoryImpl {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    public List<Issue> findIssuesByDynamicCriteria(
            IssueStatus status,
            IssueCategory category,
            Long sectorId,
            Long assignedToId) {
        
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Issue> query = cb.createQuery(Issue.class);
        Root<Issue> issue = query.from(Issue.class);
        
        List<Predicate> predicates = new ArrayList<>();
        
        // Always exclude deleted
        predicates.add(cb.isNull(issue.get("deletedAt")));
        
        if (status != null) {
            predicates.add(cb.equal(issue.get("status"), status));
        }
        
        if (category != null) {
            predicates.add(cb.equal(issue.get("category"), category));
        }
        
        if (sectorId != null) {
            predicates.add(cb.equal(issue.get("sector").get("id"), sectorId));
        }
        
        if (assignedToId != null) {
            predicates.add(cb.equal(issue.get("assignedTo").get("id"), assignedToId));
        }
        
        query.where(predicates.toArray(new Predicate[0]));
        query.orderBy(cb.desc(issue.get("createdAt")));
        
        return entityManager.createQuery(query).getResultList();
    }
}
```

## Next Steps

→ `06-service-layer.md` - Implement business logic layer
