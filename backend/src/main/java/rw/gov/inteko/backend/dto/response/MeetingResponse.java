package rw.gov.inteko.backend.dto.response;

import lombok.Builder;
import lombok.Data;
import rw.gov.inteko.backend.entity.enums.MeetingStatus;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Data
@Builder
public class MeetingResponse {
    private Long id;
    private String meetingCode;
    private String title;
    private String description;
    private LocalDate meetingDate;
    private LocalTime meetingTime;
    private String location;
    private MeetingStatus status;
    private Integer participantsCount;
    private Integer targetCount;
    private Double attendancePercentage;
    private String sectorName;
    private LocalDateTime createdAt;

    // Frontend alignment aliases
    public String getFrontendId() { return meetingCode; }
    public Integer getParticipants() { return participantsCount; }
    public String getSector() { return sectorName; }
}

