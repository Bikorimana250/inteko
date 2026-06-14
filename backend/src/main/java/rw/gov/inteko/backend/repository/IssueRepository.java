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
    
    @Query("SELECT COUNT(i) FROM Issue i WHERE i.status = :status AND i.deletedAt IS NULL")
    Long countByStatus(@Param("status") IssueStatus status);
    
    @Query("SELECT i.category, COUNT(i) FROM Issue i WHERE i.deletedAt IS NULL GROUP BY i.category")
    List<Object[]> countByCategory();
    
    @Query("SELECT COUNT(i) FROM Issue i WHERE i.assignedTo.id = :userId " +
           "AND i.status IN ('ACTIVE', 'PROCESSING') AND i.deletedAt IS NULL")
    Long countPendingByAssignedTo(@Param("userId") Long userId);
}
