package rw.gov.inteko.backend.dto.response;

import lombok.Builder;
import lombok.Data;
import rw.gov.inteko.backend.entity.enums.ResolutionStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ResolutionResponse {
    private Long id;
    private String resolutionCode;
    private String title;
    private String summary;
    private String assignedUnit;
    private String responsibleOfficer;
    private ResolutionStatus status;
    private Integer progressPercentage;
    private LocalDate dueDate;
    private LocalDateTime concludedAt;
    private LocalDateTime createdAt;
    private List<ResolutionActionItemResponse> actionItems;
    private List<ResolutionCommentResponse> comments;
}
