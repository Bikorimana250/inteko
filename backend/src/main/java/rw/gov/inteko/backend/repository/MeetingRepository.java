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
    
    @Query("SELECT COUNT(m) FROM Meeting m WHERE m.status = :status AND m.deletedAt IS NULL")
    Long countByStatus(@Param("status") MeetingStatus status);
    
    @Query("SELECT AVG(m.participantsCount * 100.0 / m.targetCount) FROM Meeting m " +
           "WHERE m.status = 'COMPLETED' AND m.targetCount > 0 AND m.deletedAt IS NULL")
    Double getAverageAttendanceRate();
}
