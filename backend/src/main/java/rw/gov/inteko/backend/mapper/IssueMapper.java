package rw.gov.inteko.backend.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import rw.gov.inteko.backend.dto.response.IssueResponse;
import rw.gov.inteko.backend.entity.Issue;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class IssueMapper {
    private final IssueCommentMapper issueCommentMapper;
    
    public IssueResponse toResponse(Issue issue) {
        if (issue == null) {
            return null;
        }
        
        return IssueResponse.builder()
                .id(issue.getId())
                .issueCode(issue.getIssueCode())
                .title(issue.getTitle())
                .description(issue.getDescription())
                .category(issue.getCategory())
                .priority(issue.getPriority())
                .status(issue.getStatus())
                .reporterName(issue.getReporterName())
                .reporterPhone(issue.getReporterPhone())
                .reporterIdNumber(issue.getReporterIdNumber())
                .assignedToName(issue.getAssignedTo() != null ? issue.getAssignedTo().getFullName() : null)
                .assignedAt(issue.getAssignedAt())
                .sectorName(issue.getSector() != null ? issue.getSector().getName() : null)
                .cellName(issue.getCell() != null ? issue.getCell().getName() : null)
                .villageName(issue.getVillage() != null ? issue.getVillage().getName() : null)
                .resolvedAt(issue.getResolvedAt())
                .resolutionSummary(issue.getResolutionSummary())
                .createdAt(issue.getCreatedAt())
                .comments(issue.getComments() != null ? 
                        issue.getComments().stream().map(issueCommentMapper::toResponse).collect(Collectors.toList()) : null)
                .build();
    }
}
