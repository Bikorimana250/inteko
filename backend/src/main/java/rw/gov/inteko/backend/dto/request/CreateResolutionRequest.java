package rw.gov.inteko.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateResolutionRequest {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Summary is required")
    private String summary;
    
    private Long linkedIssueId;
    
    private String assignedUnit;
    
    private String responsibleOfficer;
    
    private Long assignedToUserId;
    
    private LocalDate dueDate;
}
