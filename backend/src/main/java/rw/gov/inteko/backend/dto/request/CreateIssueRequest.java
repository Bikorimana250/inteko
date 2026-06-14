package rw.gov.inteko.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import rw.gov.inteko.backend.entity.enums.IssueCategory;
import rw.gov.inteko.backend.entity.enums.IssuePriority;
import rw.gov.inteko.backend.validation.ValidRwandaPhone;
import rw.gov.inteko.backend.validation.ValidNationalId;

@Data
public class CreateIssueRequest {
    
    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 255, message = "Title must be between 5 and 255 characters")
    private String title;
    
    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;
    
    @NotNull(message = "Category is required")
    private IssueCategory category;
    
    @NotNull(message = "Priority is required")
    private IssuePriority priority;
    
    @NotBlank(message = "Reporter name is required")
    @Size(max = 150, message = "Reporter name cannot exceed 150 characters")
    private String reporterName;
    
    @ValidRwandaPhone
    private String reporterPhone;
    
    @ValidNationalId
    private String reporterIdNumber;
    
    @Positive(message = "Sector ID must be positive")
    private Long sectorId;
    
    private Long cellId;
    private Long villageId;
}
