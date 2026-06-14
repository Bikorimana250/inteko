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
    
    @Query("SELECT COUNT(r) FROM Resolution r WHERE r.status = :status AND r.deletedAt IS NULL")
    Long countByStatus(@Param("status") ResolutionStatus status);
    
    @Query("SELECT AVG(r.progressPercentage) FROM Resolution r " +
           "WHERE r.status = 'ACTIVE' AND r.deletedAt IS NULL")
    Double getAverageProgress();
    
    @Query("SELECT COUNT(r) FROM Resolution r WHERE r.assignedTo.id = :userId " +
           "AND r.status = 'ACTIVE' AND r.deletedAt IS NULL")
    Long countActiveByAssignedTo(@Param("userId") Long userId);
}
