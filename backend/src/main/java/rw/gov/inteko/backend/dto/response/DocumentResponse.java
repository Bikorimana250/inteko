package rw.gov.inteko.backend.dto.response;

import lombok.Builder;
import lombok.Data;
import rw.gov.inteko.backend.entity.enums.AccessLevel;
import java.time.LocalDateTime;

@Data
@Builder
public class DocumentResponse {
    private Long id;
    private String documentCode;
    private String title;
    private String description;
    private String category;
    private String[] tags;
    private String fileName;
    private Long fileSizeBytes;
    private String mimeType;
    private String version;
    private AccessLevel accessLevel;
    private Integer downloadCount;
    private Integer viewCount;
    private LocalDateTime createdAt;
}
