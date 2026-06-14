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
