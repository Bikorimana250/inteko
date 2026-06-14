package rw.gov.inteko.backend.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import rw.gov.inteko.backend.dto.response.ResolutionCommentResponse;
import rw.gov.inteko.backend.entity.ResolutionComment;
import rw.gov.inteko.backend.repository.UserRepository;

@Component
@RequiredArgsConstructor
public class ResolutionCommentMapper {
    private final UserRepository userRepository;

    public ResolutionCommentResponse toResponse(ResolutionComment comment) {
        if (comment == null) return null;

        return ResolutionCommentResponse.builder()
                .id(comment.getId())
                .commentText(comment.getCommentText())
                .authorName(comment.getAuthorName() + (comment.getAuthorRole() != null ? " (" + comment.getAuthorRole() + ")" : ""))
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
