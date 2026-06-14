package rw.gov.inteko.backend.entity;

import jakarta.persistence.*;
import rw.gov.inteko.backend.entity.base.AuditableEntity;
import rw.gov.inteko.backend.entity.enums.AccessLevel;

@Entity
@Table(name = "documents")
public class Document extends AuditableEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "document_code", unique = true, nullable = false, length = 20)
    private String documentCode;
    
    @Column(name = "title", nullable = false)
    private String title;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "category", nullable = false, length = 50)
    private String category;
    
    @Column(name = "tags", columnDefinition = "TEXT[]")
    private String[] tags;
    
    @Column(name = "file_path", nullable = false, columnDefinition = "TEXT")
    private String filePath;
    
    @Column(name = "file_name", nullable = false)
    private String fileName;
    
    @Column(name = "file_size_bytes")
    private Long fileSizeBytes;
    
    @Column(name = "mime_type", length = 100)
    private String mimeType;
    
    @Column(name = "version", length = 20)
    private String version = "1.0";
    
    @Enumerated(EnumType.STRING)
    @Column(name = "access_level", length = 20)
    private AccessLevel accessLevel = AccessLevel.PUBLIC;
    
    @Column(name = "allowed_roles", columnDefinition = "TEXT[]")
    private String[] allowedRoles;
    
    @Column(name = "download_count")
    private Integer downloadCount = 0;
    
    @Column(name = "view_count")
    private Integer viewCount = 0;

    public Document() {
    }

    public Document(Long id, String documentCode, String title, String description, String category, String[] tags, String filePath, String fileName, Long fileSizeBytes, String mimeType, String version, AccessLevel accessLevel, String[] allowedRoles, Integer downloadCount, Integer viewCount) {
        this.id = id;
        this.documentCode = documentCode;
        this.title = title;
        this.description = description;
        this.category = category;
        this.tags = tags;
        this.filePath = filePath;
        this.fileName = fileName;
        this.fileSizeBytes = fileSizeBytes;
        this.mimeType = mimeType;
        this.version = version != null ? version : "1.0";
        this.accessLevel = accessLevel != null ? accessLevel : AccessLevel.PUBLIC;
        this.allowedRoles = allowedRoles;
        this.downloadCount = downloadCount != null ? downloadCount : 0;
        this.viewCount = viewCount != null ? viewCount : 0;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDocumentCode() {
        return documentCode;
    }

    public void setDocumentCode(String documentCode) {
        this.documentCode = documentCode;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String[] getTags() {
        return tags;
    }

    public void setTags(String[] tags) {
        this.tags = tags;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public Long getFileSizeBytes() {
        return fileSizeBytes;
    }

    public void setFileSizeBytes(Long fileSizeBytes) {
        this.fileSizeBytes = fileSizeBytes;
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public AccessLevel getAccessLevel() {
        return accessLevel;
    }

    public void setAccessLevel(AccessLevel accessLevel) {
        this.accessLevel = accessLevel;
    }

    public String[] getAllowedRoles() {
        return allowedRoles;
    }

    public void setAllowedRoles(String[] allowedRoles) {
        this.allowedRoles = allowedRoles;
    }

    public Integer getDownloadCount() {
        return downloadCount;
    }

    public void setDownloadCount(Integer downloadCount) {
        this.downloadCount = downloadCount;
    }

    public Integer getViewCount() {
        return viewCount;
    }

    public void setViewCount(Integer viewCount) {
        this.viewCount = viewCount;
    }
    
    public void incrementDownloadCount() {
        this.downloadCount++;
    }
    
    public void incrementViewCount() {
        this.viewCount++;
    }

    public static DocumentBuilder builder() {
        return new DocumentBuilder();
    }

    public static class DocumentBuilder {
        private Long id;
        private String documentCode;
        private String title;
        private String description;
        private String category;
        private String[] tags;
        private String filePath;
        private String fileName;
        private Long fileSizeBytes;
        private String mimeType;
        private String version = "1.0";
        private AccessLevel accessLevel = AccessLevel.PUBLIC;
        private String[] allowedRoles;
        private Integer downloadCount = 0;
        private Integer viewCount = 0;

        public DocumentBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public DocumentBuilder documentCode(String documentCode) {
            this.documentCode = documentCode;
            return this;
        }

        public DocumentBuilder title(String title) {
            this.title = title;
            return this;
        }

        public DocumentBuilder description(String description) {
            this.description = description;
            return this;
        }

        public DocumentBuilder category(String category) {
            this.category = category;
            return this;
        }

        public DocumentBuilder tags(String[] tags) {
            this.tags = tags;
            return this;
        }

        public DocumentBuilder filePath(String filePath) {
            this.filePath = filePath;
            return this;
        }

        public DocumentBuilder fileName(String fileName) {
            this.fileName = fileName;
            return this;
        }

        public DocumentBuilder fileSizeBytes(Long fileSizeBytes) {
            this.fileSizeBytes = fileSizeBytes;
            return this;
        }

        public DocumentBuilder mimeType(String mimeType) {
            this.mimeType = mimeType;
            return this;
        }

        public DocumentBuilder version(String version) {
            this.version = version;
            return this;
        }

        public DocumentBuilder accessLevel(AccessLevel accessLevel) {
            this.accessLevel = accessLevel;
            return this;
        }

        public DocumentBuilder allowedRoles(String[] allowedRoles) {
            this.allowedRoles = allowedRoles;
            return this;
        }

        public DocumentBuilder downloadCount(Integer downloadCount) {
            this.downloadCount = downloadCount;
            return this;
        }

        public DocumentBuilder viewCount(Integer viewCount) {
            this.viewCount = viewCount;
            return this;
        }

        public Document build() {
            return new Document(id, documentCode, title, description, category, tags, filePath, fileName, fileSizeBytes, mimeType, version, accessLevel, allowedRoles, downloadCount, viewCount);
        }
    }
}
