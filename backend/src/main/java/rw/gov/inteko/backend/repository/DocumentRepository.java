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
    
    @Query(value = "SELECT * FROM documents WHERE :tag = ANY(tags) AND deleted_at IS NULL", nativeQuery = true)
    List<Document> findByTag(@Param("tag") String tag);
    
    @Query("SELECT d FROM Document d WHERE d.deletedAt IS NULL AND " +
           "(LOWER(d.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(d.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(d.category) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Document> searchDocuments(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT d FROM Document d WHERE d.deletedAt IS NULL ORDER BY d.downloadCount DESC")
    Page<Document> findMostDownloaded(Pageable pageable);
}
