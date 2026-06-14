package rw.gov.inteko.backend.mapper;

import org.springframework.stereotype.Component;
import rw.gov.inteko.backend.dto.response.DocumentResponse;
import rw.gov.inteko.backend.entity.Document;

@Component
public class DocumentMapper {
    public DocumentResponse toResponse(Document document) {
        if (document == null) return null;
        return DocumentResponse.builder()
                .id(document.getId())
                .documentCode(document.getDocumentCode())
                .title(document.getTitle())
                .description(document.getDescription())
                .category(document.getCategory())
                .tags(document.getTags())
                .fileName(document.getFileName())
                .fileSizeBytes(document.getFileSizeBytes())
                .mimeType(document.getMimeType())
                .version(document.getVersion())
                .accessLevel(document.getAccessLevel())
                .downloadCount(document.getDownloadCount())
                .viewCount(document.getViewCount())
                .createdAt(document.getCreatedAt())
                .build();
    }
}
