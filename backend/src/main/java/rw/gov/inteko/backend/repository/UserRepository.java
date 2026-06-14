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
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByUserCode(String userCode);
    
    Optional<User> findByIdNumber(String idNumber);
    
    boolean existsByEmail(String email);
    
    boolean existsByIdNumber(String idNumber);
    
    boolean existsByUserCode(String userCode);
    
    List<User> findByStatus(UserStatus status);
    
    List<User> findByRole(UserRole role);
    
    List<User> findByStatusAndRole(UserStatus status, UserRole role);
    
    @Query("SELECT u FROM User u WHERE u.deletedAt IS NULL")
    List<User> findAllActiveUsers();
    
    @Query("SELECT u FROM User u WHERE u.status = :status AND u.deletedAt IS NULL")
    List<User> findActiveUsersByStatus(@Param("status") UserStatus status);
    
    @Query("SELECT u FROM User u WHERE u.sector.id = :sectorId AND u.deletedAt IS NULL")
    List<User> findBySector(@Param("sectorId") Long sectorId);
    
    @Query("SELECT u FROM User u WHERE u.cell.id = :cellId AND u.deletedAt IS NULL")
    List<User> findByCell(@Param("cellId") Long cellId);
    
    @Query("SELECT u FROM User u WHERE u.deletedAt IS NULL AND " +
           "(LOWER(u.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(u.phone) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<User> searchUsers(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.status = :status AND u.deletedAt IS NULL")
    Long countByStatus(@Param("status") UserStatus status);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role AND u.deletedAt IS NULL")
    Long countByRole(@Param("role") UserRole role);
}
