package rw.gov.inteko.backend.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import rw.gov.inteko.backend.dto.response.ResolutionResponse;
import rw.gov.inteko.backend.entity.Resolution;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ResolutionMapper {
    private final ResolutionActionItemMapper actionItemMapper;
    private final ResolutionCommentMapper commentMapper;
    
    public ResolutionResponse toResponse(Resolution resolution) {
        if (resolution == null) {
            return null;
        }
        
        return ResolutionResponse.builder()
                .id(resolution.getId())
                .resolutionCode(resolution.getResolutionCode())
                .title(resolution.getTitle())
                .summary(resolution.getSummary())
                .assignedUnit(resolution.getAssignedUnit())
                .responsibleOfficer(resolution.getResponsibleOfficer())
                .status(resolution.getStatus())
                .progressPercentage(resolution.getProgressPercentage())
                .dueDate(resolution.getDueDate())
                .concludedAt(resolution.getConcludedAt())
                .createdAt(resolution.getCreatedAt())
                .actionItems(resolution.getActionItems() != null ? 
                        resolution.getActionItems().stream().map(actionItemMapper::toResponse).collect(Collectors.toList()) : null)
                .comments(resolution.getComments() != null ? 
                        resolution.getComments().stream().map(commentMapper::toResponse).collect(Collectors.toList()) : null)
                .build();
    }
}
