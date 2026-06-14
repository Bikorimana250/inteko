package rw.gov.inteko.backend.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ResolutionCommentResponse {
    private Long id;
    private String commentText;
    private String authorName;
    private LocalDateTime createdAt;
}
