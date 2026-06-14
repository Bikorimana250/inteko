package rw.gov.inteko.backend.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import rw.gov.inteko.backend.dto.response.IssueCommentResponse;
import rw.gov.inteko.backend.entity.IssueComment;
import rw.gov.inteko.backend.repository.UserRepository;

@Component
@RequiredArgsConstructor
public class IssueCommentMapper {
    private final UserRepository userRepository;

    public IssueCommentResponse toResponse(IssueComment comment) {
        if (comment == null) return null;
        
        String authorName = userRepository.findById(comment.getCreatedBy())
                .map(u -> u.getFullName())
                .orElse("Unknown");

        return IssueCommentResponse.builder()
                .id(comment.getId())
                .commentText(comment.getCommentText())
                .authorName(authorName)
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
