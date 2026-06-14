package rw.gov.inteko.backend.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ResolutionActionItemResponse {
    private Long id;
    private String itemLabel;
    private Boolean isCompleted;
    private LocalDateTime completedAt;
    private String completedByName;
    private Integer displayOrder;
}
