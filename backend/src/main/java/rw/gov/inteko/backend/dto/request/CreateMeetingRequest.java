package rw.gov.inteko.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class CreateMeetingRequest {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    @NotNull(message = "Meeting date is required")
    private LocalDate meetingDate;
    
    @NotNull(message = "Meeting time is required")
    private LocalTime meetingTime;
    
    @NotBlank(message = "Location is required")
    private String location;
    
    @NotNull(message = "Target count is required")
    private Integer targetCount;
    
    @NotNull(message = "Sector ID is required")
    private Long sectorId;
}
