package rw.gov.inteko.backend.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import rw.gov.inteko.backend.dto.response.ResolutionActionItemResponse;
import rw.gov.inteko.backend.entity.ResolutionActionItem;
import rw.gov.inteko.backend.repository.UserRepository;

@Component
@RequiredArgsConstructor
public class ResolutionActionItemMapper {
    private final UserRepository userRepository;

    public ResolutionActionItemResponse toResponse(ResolutionActionItem item) {
        if (item == null) return null;

        String completedByName = item.getCompletedBy() != null ? 
                userRepository.findById(item.getCompletedBy())
                        .map(u -> u.getFullName())
                        .orElse("Unknown") : null;

        return ResolutionActionItemResponse.builder()
                .id(item.getId())
                .itemLabel(item.getItemLabel())
                .isCompleted(item.getIsCompleted())
                .completedAt(item.getCompletedAt())
                .completedByName(completedByName)
                .displayOrder(item.getDisplayOrder())
                .build();
    }
}
