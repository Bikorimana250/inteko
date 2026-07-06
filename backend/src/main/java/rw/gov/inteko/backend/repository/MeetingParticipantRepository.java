package rw.gov.inteko.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import rw.gov.inteko.backend.entity.MeetingParticipant;

import java.util.List;

@Repository
public interface MeetingParticipantRepository extends JpaRepository<MeetingParticipant, Long> {

    List<MeetingParticipant> findByMeetingId(Long meetingId);

    @Query("SELECT COUNT(mp) FROM MeetingParticipant mp WHERE mp.meeting.id = :meetingId")
    Long countByMeetingId(@Param("meetingId") Long meetingId);

    @Query("SELECT COUNT(mp) FROM MeetingParticipant mp " +
           "WHERE mp.meeting.id = :meetingId AND mp.attendanceStatus = 'PRESENT'")
    Long countPresentByMeetingId(@Param("meetingId") Long meetingId);

    boolean existsByMeetingIdAndIdNumber(Long meetingId, String idNumber);

    /** Actual participant counts per meeting from the participants table. Returns [meetingId, count]. */
    @Query("SELECT mp.meeting.id, COUNT(mp) FROM MeetingParticipant mp GROUP BY mp.meeting.id")
    List<Object[]> countParticipantsPerMeeting();

    /** Top sector rankings based on actual participant rows vs meeting target. Returns [sectorName, meetingCount, avgRate]. */
    @Query("SELECT m.sector.name, COUNT(DISTINCT m.id), " +
           "(COUNT(mp) * 100.0 / NULLIF(SUM(m.targetCount), 0)) " +
           "FROM Meeting m LEFT JOIN m.participants mp " +
           "WHERE m.deletedAt IS NULL " +
           "GROUP BY m.sector.name " +
           "ORDER BY (COUNT(mp) * 100.0 / NULLIF(SUM(m.targetCount), 0)) DESC")
    List<Object[]> findTopSectorRankingsByActualParticipants();
}
