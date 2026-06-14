package rw.gov.inteko.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import rw.gov.inteko.backend.dto.response.DashboardStatsResponse;
import rw.gov.inteko.backend.entity.enums.IssueCategory;
import rw.gov.inteko.backend.entity.enums.IssueStatus;
import rw.gov.inteko.backend.entity.enums.MeetingStatus;
import rw.gov.inteko.backend.entity.enums.ResolutionStatus;
import rw.gov.inteko.backend.repository.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final UserRepository userRepository;
    private final MeetingRepository meetingRepository;
    private final IssueRepository issueRepository;
    private final ResolutionRepository resolutionRepository;

    public DashboardStatsResponse getDashboardStats() {
        return buildStats(null);
    }

    public DashboardStatsResponse getSectorStats(Long sectorId) {
        return buildStats(sectorId);
    }

    private DashboardStatsResponse buildStats(Long sectorId) {
        Long totalUsers = sectorId == null ? userRepository.count() : (long) userRepository.findBySector(sectorId).size();
        Long totalMeetings = sectorId == null ? meetingRepository.count() : (long) meetingRepository.findBySector(sectorId).size();
        Long totalIssues = sectorId == null ? issueRepository.count() : (long) issueRepository.findBySector(sectorId).size();
        Long totalResolutions = resolutionRepository.count(); // Resolution doesn't have direct sector link in entity, usually linked via issue

        Double attendanceRate = meetingRepository.getAverageAttendanceRate();
        Double progressRate = resolutionRepository.getAverageProgress();

        Map<String, Long> issuesByCategory = new HashMap<>();
        for (Object[] result : issueRepository.countByCategory()) {
            issuesByCategory.put(((IssueCategory) result[0]).name(), (Long) result[1]);
        }

        Map<String, Long> issuesByStatus = new HashMap<>();
        for (IssueStatus status : IssueStatus.values()) {
            issuesByStatus.put(status.name(), issueRepository.countByStatus(status));
        }

        Map<String, Long> resolutionsByStatus = new HashMap<>();
        for (ResolutionStatus status : ResolutionStatus.values()) {
            resolutionsByStatus.put(status.name(), resolutionRepository.countByStatus(status));
        }

        return DashboardStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalMeetings(totalMeetings)
                .totalIssues(totalIssues)
                .totalResolutions(totalResolutions)
                .attendanceRate(attendanceRate != null ? attendanceRate : 0.0)
                .resolutionRate(progressRate != null ? progressRate : 0.0)
                .issuesByCategory(issuesByCategory)
                .issuesByStatus(issuesByStatus)
                .resolutionsByStatus(resolutionsByStatus)
                .build();
    }
}
