package rw.gov.inteko.backend.dto.response;

import lombok.Builder;
import lombok.Data;
import rw.gov.inteko.backend.entity.enums.IssueCategory;
import rw.gov.inteko.backend.entity.enums.IssuePriority;
import rw.gov.inteko.backend.entity.enums.IssueStatus;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class IssueResponse {
    private Long id;
    private String issueCode;
    private String title;
    private String description;
    private IssueCategory category;
    private IssuePriority priority;
    private IssueStatus status;
    private String reporterName;
    private String reporterPhone;
    private String reporterIdNumber;
    private String assignedToName;
    private LocalDateTime assignedAt;
    private String sectorName;
    private String cellName;
    private String villageName;
    private LocalDateTime resolvedAt;
    private String resolutionSummary;
    private LocalDateTime createdAt;
    private List<IssueCommentResponse> comments;

    // Frontend alignment aliases
    public String getFrontendId() { return issueCode; }
    public String getReporter() { return reporterName; }
    public String getTime() { return createdAt != null ? createdAt.toString() : null; }
    public String getLocation() { 
        return (sectorName != null ? sectorName : "") + 
               (cellName != null ? " / " + cellName : "") + 
               (villageName != null ? " / " + villageName : "");
    }
}
