package rw.gov.inteko.backend.dto.response;

import java.util.Map;

public class DashboardStatsResponse {
    private Long totalUsers;
    private Long totalMeetings;
    private Long totalIssues;
    private Long totalResolutions;
    private Double attendanceRate;
    private Double resolutionRate;
    private Map<String, Long> issuesByCategory;
    private Map<String, Long> issuesByStatus;
    private Map<String, Long> resolutionsByStatus;

    public DashboardStatsResponse() {}

    public DashboardStatsResponse(Long totalUsers, Long totalMeetings, Long totalIssues, Long totalResolutions, 
                                 Double attendanceRate, Double resolutionRate, Map<String, Long> issuesByCategory, 
                                 Map<String, Long> issuesByStatus, Map<String, Long> resolutionsByStatus) {
        this.totalUsers = totalUsers;
        this.totalMeetings = totalMeetings;
        this.totalIssues = totalIssues;
        this.totalResolutions = totalResolutions;
        this.attendanceRate = attendanceRate;
        this.resolutionRate = resolutionRate;
        this.issuesByCategory = issuesByCategory;
        this.issuesByStatus = issuesByStatus;
        this.resolutionsByStatus = resolutionsByStatus;
    }

    public static DashboardStatsResponseBuilder builder() {
        return new DashboardStatsResponseBuilder();
    }

    // Getters and Setters
    public Long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(Long totalUsers) { this.totalUsers = totalUsers; }
    public Long getTotalMeetings() { return totalMeetings; }
    public void setTotalMeetings(Long totalMeetings) { this.totalMeetings = totalMeetings; }
    public Long getTotalIssues() { return totalIssues; }
    public void setTotalIssues(Long totalIssues) { this.totalIssues = totalIssues; }
    public Long getTotalResolutions() { return totalResolutions; }
    public void setTotalResolutions(Long totalResolutions) { this.totalResolutions = totalResolutions; }
    public Double getAttendanceRate() { return attendanceRate; }
    public void setAttendanceRate(Double attendanceRate) { this.attendanceRate = attendanceRate; }
    public Double getResolutionRate() { return resolutionRate; }
    public void setResolutionRate(Double resolutionRate) { this.resolutionRate = resolutionRate; }
    public Map<String, Long> getIssuesByCategory() { return issuesByCategory; }
    public void setIssuesByCategory(Map<String, Long> issuesByCategory) { this.issuesByCategory = issuesByCategory; }
    public Map<String, Long> getIssuesByStatus() { return issuesByStatus; }
    public void setIssuesByStatus(Map<String, Long> issuesByStatus) { this.issuesByStatus = issuesByStatus; }
    public Map<String, Long> getResolutionsByStatus() { return resolutionsByStatus; }
    public void setResolutionsByStatus(Map<String, Long> resolutionsByStatus) { this.resolutionsByStatus = resolutionsByStatus; }

    public static class DashboardStatsResponseBuilder {
        private Long totalUsers;
        private Long totalMeetings;
        private Long totalIssues;
        private Long totalResolutions;
        private Double attendanceRate;
        private Double resolutionRate;
        private Map<String, Long> issuesByCategory;
        private Map<String, Long> issuesByStatus;
        private Map<String, Long> resolutionsByStatus;

        public DashboardStatsResponseBuilder totalUsers(Long totalUsers) { this.totalUsers = totalUsers; return this; }
        public DashboardStatsResponseBuilder totalMeetings(Long totalMeetings) { this.totalMeetings = totalMeetings; return this; }
        public DashboardStatsResponseBuilder totalIssues(Long totalIssues) { this.totalIssues = totalIssues; return this; }
        public DashboardStatsResponseBuilder totalResolutions(Long totalResolutions) { this.totalResolutions = totalResolutions; return this; }
        public DashboardStatsResponseBuilder attendanceRate(Double attendanceRate) { this.attendanceRate = attendanceRate; return this; }
        public DashboardStatsResponseBuilder resolutionRate(Double resolutionRate) { this.resolutionRate = resolutionRate; return this; }
        public DashboardStatsResponseBuilder issuesByCategory(Map<String, Long> issuesByCategory) { this.issuesByCategory = issuesByCategory; return this; }
        public DashboardStatsResponseBuilder issuesByStatus(Map<String, Long> issuesByStatus) { this.issuesByStatus = issuesByStatus; return this; }
        public DashboardStatsResponseBuilder resolutionsByStatus(Map<String, Long> resolutionsByStatus) { this.resolutionsByStatus = resolutionsByStatus; return this; }
        public DashboardStatsResponse build() {
            return new DashboardStatsResponse(totalUsers, totalMeetings, totalIssues, totalResolutions, attendanceRate, resolutionRate, issuesByCategory, issuesByStatus, resolutionsByStatus);
        }
    }
}
