package rw.gov.inteko.backend.mapper;

import org.springframework.stereotype.Component;
import rw.gov.inteko.backend.dto.response.MeetingResponse;
import rw.gov.inteko.backend.entity.Meeting;

@Component
public class MeetingMapper {
    
    public MeetingResponse toResponse(Meeting meeting) {
        if (meeting == null) {
            return null;
        }
        
        return MeetingResponse.builder()
                .id(meeting.getId())
                .meetingCode(meeting.getMeetingCode())
                .title(meeting.getTitle())
                .description(meeting.getDescription())
                .meetingDate(meeting.getMeetingDate())
                .meetingTime(meeting.getMeetingTime())
                .location(meeting.getLocation())
                .status(meeting.getStatus())
                .participantsCount(meeting.getParticipantsCount())
                .targetCount(meeting.getTargetCount())
                .attendancePercentage(meeting.getAttendancePercentage())
                .sectorName(meeting.getSector() != null ? meeting.getSector().getName() : null)
                .createdAt(meeting.getCreatedAt())
                .build();
    }
}
