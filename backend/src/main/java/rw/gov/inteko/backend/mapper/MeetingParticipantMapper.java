package rw.gov.inteko.backend.mapper;

import org.springframework.stereotype.Component;
import rw.gov.inteko.backend.dto.response.MeetingParticipantResponse;
import rw.gov.inteko.backend.entity.MeetingParticipant;

@Component
public class MeetingParticipantMapper {
    public MeetingParticipantResponse toResponse(MeetingParticipant participant) {
        if (participant == null) return null;
        return MeetingParticipantResponse.builder()
                .id(participant.getId())
                .participantName(participant.getParticipantName())
                .idNumber(participant.getIdNumber())
                .phone(participant.getPhone())
                .villageName(participant.getVillage() != null ? participant.getVillage().getName() : null)
                .attendanceStatus(participant.getAttendanceStatus())
                .checkedInAt(participant.getCheckedInAt())
                .build();
    }
}
