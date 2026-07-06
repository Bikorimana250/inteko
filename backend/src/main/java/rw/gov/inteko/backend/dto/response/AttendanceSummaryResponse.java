package rw.gov.inteko.backend.dto.response;

import java.util.List;

public class AttendanceSummaryResponse {

    private long totalParticipants;
    private double attendanceRate;
    private List<CellRankingItem> topCellRankings;
    private List<MeetingAttendanceItem> meetingAttendances;

    public AttendanceSummaryResponse() {}

    public AttendanceSummaryResponse(long totalParticipants, double attendanceRate,
                                     List<CellRankingItem> topCellRankings,
                                     List<MeetingAttendanceItem> meetingAttendances) {
        this.totalParticipants = totalParticipants;
        this.attendanceRate = attendanceRate;
        this.topCellRankings = topCellRankings;
        this.meetingAttendances = meetingAttendances;
    }

    public long getTotalParticipants() { return totalParticipants; }
    public void setTotalParticipants(long totalParticipants) { this.totalParticipants = totalParticipants; }

    public double getAttendanceRate() { return attendanceRate; }
    public void setAttendanceRate(double attendanceRate) { this.attendanceRate = attendanceRate; }

    public List<CellRankingItem> getTopCellRankings() { return topCellRankings; }
    public void setTopCellRankings(List<CellRankingItem> topCellRankings) { this.topCellRankings = topCellRankings; }

    public List<MeetingAttendanceItem> getMeetingAttendances() { return meetingAttendances; }
    public void setMeetingAttendances(List<MeetingAttendanceItem> meetingAttendances) { this.meetingAttendances = meetingAttendances; }

    // --- Nested: Cell Ranking ---
    public static class CellRankingItem {
        private String cellName;
        private int meetingCount;
        private double attendanceRate;

        public CellRankingItem() {}

        public CellRankingItem(String cellName, int meetingCount, double attendanceRate) {
            this.cellName = cellName;
            this.meetingCount = meetingCount;
            this.attendanceRate = attendanceRate;
        }

        public String getCellName() { return cellName; }
        public void setCellName(String cellName) { this.cellName = cellName; }

        public int getMeetingCount() { return meetingCount; }
        public void setMeetingCount(int meetingCount) { this.meetingCount = meetingCount; }

        public double getAttendanceRate() { return attendanceRate; }
        public void setAttendanceRate(double attendanceRate) { this.attendanceRate = attendanceRate; }
    }

    // --- Nested: Per-meeting attendance row ---
    public static class MeetingAttendanceItem {
        private String meetingId;   // meetingCode e.g. #MTG-2026-001
        private String title;
        private String sectorName;
        private int participants;
        private int targetCount;
        private double attendanceRate;
        private String status;      // SCHEDULED / ONGOING / COMPLETED / POSTPONED

        public MeetingAttendanceItem() {}

        public MeetingAttendanceItem(String meetingId, String title, String sectorName,
                                     int participants, int targetCount,
                                     double attendanceRate, String status) {
            this.meetingId = meetingId;
            this.title = title;
            this.sectorName = sectorName;
            this.participants = participants;
            this.targetCount = targetCount;
            this.attendanceRate = attendanceRate;
            this.status = status;
        }

        public String getMeetingId() { return meetingId; }
        public void setMeetingId(String meetingId) { this.meetingId = meetingId; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getSectorName() { return sectorName; }
        public void setSectorName(String sectorName) { this.sectorName = sectorName; }

        public int getParticipants() { return participants; }
        public void setParticipants(int participants) { this.participants = participants; }

        public int getTargetCount() { return targetCount; }
        public void setTargetCount(int targetCount) { this.targetCount = targetCount; }

        public double getAttendanceRate() { return attendanceRate; }
        public void setAttendanceRate(double attendanceRate) { this.attendanceRate = attendanceRate; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}
