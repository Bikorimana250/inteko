package rw.gov.inteko.backend.dto.response;

import lombok.Builder;
import lombok.Data;
import rw.gov.inteko.backend.entity.enums.AttendanceStatus;
import java.time.LocalDateTime;

@Data
@Builder
public class MeetingParticipantResponse {
    private Long id;
    private String participantName;
    private String idNumber;
    private String phone;
    private String villageName;
    private AttendanceStatus attendanceStatus;
    private LocalDateTime checkedInAt;
}
