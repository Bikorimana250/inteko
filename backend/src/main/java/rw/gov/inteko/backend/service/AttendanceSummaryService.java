package rw.gov.inteko.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import rw.gov.inteko.backend.dto.response.AttendanceSummaryResponse;
import rw.gov.inteko.backend.dto.response.AttendanceSummaryResponse.CellRankingItem;
import rw.gov.inteko.backend.dto.response.AttendanceSummaryResponse.MeetingAttendanceItem;
import rw.gov.inteko.backend.entity.Meeting;
import rw.gov.inteko.backend.repository.MeetingParticipantRepository;
import rw.gov.inteko.backend.repository.MeetingRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AttendanceSummaryService {

    private final MeetingRepository meetingRepository;
    private final MeetingParticipantRepository participantRepository;

    public AttendanceSummaryResponse getSummary() {
        // 1. Total participants — count actual rows in meeting_participants
        long totalParticipants = participantRepository.count();

        // 2. Build a map of meetingId -> actual participant count from the participants table
        Map<Long, Long> participantCountByMeeting = new HashMap<>();
        for (Object[] row : participantRepository.countParticipantsPerMeeting()) {
            participantCountByMeeting.put(((Number) row[0]).longValue(), ((Number) row[1]).longValue());
        }

        // 3. Compute overall attendance rate from actual data
        List<Meeting> allMeetings = meetingRepository.findAllActiveMeetings();
        long totalTarget = allMeetings.stream()
                .mapToLong(m -> m.getTargetCount() != null ? m.getTargetCount() : 0)
                .sum();
        double attendanceRate = totalTarget > 0
                ? Math.round((totalParticipants * 100.0 / totalTarget) * 10.0) / 10.0
                : 0.0;

        // 4. Top sector rankings based on actual participants
        List<Object[]> rankingRows = participantRepository.findTopSectorRankingsByActualParticipants();
        List<CellRankingItem> rankings = rankingRows.stream()
                .limit(3)
                .map(row -> {
                    String sectorName = (String) row[0];
                    int meetingCount = ((Number) row[1]).intValue();
                    double rate = row[2] != null ? Math.round(((Number) row[2]).doubleValue() * 10.0) / 10.0 : 0.0;
                    return new CellRankingItem(sectorName, meetingCount, rate);
                })
                .collect(Collectors.toList());

        // 5. Per-meeting rows — use actual participant counts
        List<MeetingAttendanceItem> meetingItems = allMeetings.stream()
                .map(m -> {
                    long actualParticipants = participantCountByMeeting.getOrDefault(m.getId(), 0L);
                    int target = m.getTargetCount() != null ? m.getTargetCount() : 0;
                    double ratio = target > 0
                            ? Math.round((actualParticipants * 100.0 / target) * 10.0) / 10.0
                            : 0.0;
                    String sectorName = m.getSector() != null ? m.getSector().getName() : "";
                    return new MeetingAttendanceItem(
                            m.getMeetingCode(),
                            m.getTitle(),
                            sectorName,
                            (int) actualParticipants,
                            target,
                            ratio,
                            m.getStatus().name()
                    );
                })
                .collect(Collectors.toList());

        return new AttendanceSummaryResponse(totalParticipants, attendanceRate, rankings, meetingItems);
    }
}
