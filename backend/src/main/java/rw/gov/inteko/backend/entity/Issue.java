package rw.gov.inteko.backend.entity;

import jakarta.persistence.*;
import rw.gov.inteko.backend.entity.base.AuditableEntity;
import rw.gov.inteko.backend.entity.enums.IssueCategory;
import rw.gov.inteko.backend.entity.enums.IssuePriority;
import rw.gov.inteko.backend.entity.enums.IssueStatus;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "issues")
public class Issue extends AuditableEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "issue_code", unique = true, nullable = false, length = 20)
    private String issueCode;
    
    @Column(name = "title", nullable = false)
    private String title;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false, length = 50)
    private IssueCategory category;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "priority", length = 20)
    private IssuePriority priority = IssuePriority.MEDIUM;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private IssueStatus status = IssueStatus.ACTIVE;
    
    @Column(name = "reporter_name", nullable = false, length = 150)
    private String reporterName;
    
    @Column(name = "reporter_phone", length = 20)
    private String reporterPhone;
    
    @Column(name = "reporter_id_number", length = 16)
    private String reporterIdNumber;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private User assignedTo;
    
    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sector_id")
    private Sector sector;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cell_id")
    private Cell cell;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "village_id")
    private Village village;
    
    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;
    
    @Column(name = "resolution_summary", columnDefinition = "TEXT")
    private String resolutionSummary;
    
    @OneToMany(mappedBy = "issue", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<IssueComment> comments = new ArrayList<>();
    
    @OneToMany(mappedBy = "linkedIssue", cascade = CascadeType.ALL)
    private List<Resolution> resolutions = new ArrayList<>();

    public Issue() {
    }

    public Issue(Long id, String issueCode, String title, String description, IssueCategory category, IssuePriority priority, IssueStatus status, String reporterName, String reporterPhone, String reporterIdNumber, User assignedTo, LocalDateTime assignedAt, Sector sector, Cell cell, Village village, LocalDateTime resolvedAt, String resolutionSummary, List<IssueComment> comments, List<Resolution> resolutions) {
        this.id = id;
        this.issueCode = issueCode;
        this.title = title;
        this.description = description;
        this.category = category;
        this.priority = priority != null ? priority : IssuePriority.MEDIUM;
        this.status = status != null ? status : IssueStatus.ACTIVE;
        this.reporterName = reporterName;
        this.reporterPhone = reporterPhone;
        this.reporterIdNumber = reporterIdNumber;
        this.assignedTo = assignedTo;
        this.assignedAt = assignedAt;
        this.sector = sector;
        this.cell = cell;
        this.village = village;
        this.resolvedAt = resolvedAt;
        this.resolutionSummary = resolutionSummary;
        this.comments = comments != null ? comments : new ArrayList<>();
        this.resolutions = resolutions != null ? resolutions : new ArrayList<>();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIssueCode() {
        return issueCode;
    }

    public void setIssueCode(String issueCode) {
        this.issueCode = issueCode;
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

    public IssueCategory getCategory() {
        return category;
    }

    public void setCategory(IssueCategory category) {
        this.category = category;
    }

    public IssuePriority getPriority() {
        return priority;
    }

    public void setPriority(IssuePriority priority) {
        this.priority = priority;
    }

    public IssueStatus getStatus() {
        return status;
    }

    public void setStatus(IssueStatus status) {
        this.status = status;
    }

    public String getReporterName() {
        return reporterName;
    }

    public void setReporterName(String reporterName) {
        this.reporterName = reporterName;
    }

    public String getReporterPhone() {
        return reporterPhone;
    }

    public void setReporterPhone(String reporterPhone) {
        this.reporterPhone = reporterPhone;
    }

    public String getReporterIdNumber() {
        return reporterIdNumber;
    }

    public void setReporterIdNumber(String reporterIdNumber) {
        this.reporterIdNumber = reporterIdNumber;
    }

    public User getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(User assignedTo) {
        this.assignedTo = assignedTo;
    }

    public LocalDateTime getAssignedAt() {
        return assignedAt;
    }

    public void setAssignedAt(LocalDateTime assignedAt) {
        this.assignedAt = assignedAt;
    }

    public Sector getSector() {
        return sector;
    }

    public void setSector(Sector sector) {
        this.sector = sector;
    }

    public Cell getCell() {
        return cell;
    }

    public void setCell(Cell cell) {
        this.cell = cell;
    }

    public Village getVillage() {
        return village;
    }

    public void setVillage(Village village) {
        this.village = village;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public String getResolutionSummary() {
        return resolutionSummary;
    }

    public void setResolutionSummary(String resolutionSummary) {
        this.resolutionSummary = resolutionSummary;
    }

    public List<IssueComment> getComments() {
        return comments;
    }

    public void setComments(List<IssueComment> comments) {
        this.comments = comments;
    }

    public List<Resolution> getResolutions() {
        return resolutions;
    }

    public void setResolutions(List<Resolution> resolutions) {
        this.resolutions = resolutions;
    }

    public static IssueBuilder builder() {
        return new IssueBuilder();
    }

    public static class IssueBuilder {
        private Long id;
        private String issueCode;
        private String title;
        private String description;
        private IssueCategory category;
        private IssuePriority priority = IssuePriority.MEDIUM;
        private IssueStatus status = IssueStatus.ACTIVE;
        private String reporterName;
        private String reporterPhone;
        private String reporterIdNumber;
        private User assignedTo;
        private LocalDateTime assignedAt;
        private Sector sector;
        private Cell cell;
        private Village village;
        private LocalDateTime resolvedAt;
        private String resolutionSummary;
        private List<IssueComment> comments = new ArrayList<>();
        private List<Resolution> resolutions = new ArrayList<>();

        public IssueBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public IssueBuilder issueCode(String issueCode) {
            this.issueCode = issueCode;
            return this;
        }

        public IssueBuilder title(String title) {
            this.title = title;
            return this;
        }

        public IssueBuilder description(String description) {
            this.description = description;
            return this;
        }

        public IssueBuilder category(IssueCategory category) {
            this.category = category;
            return this;
        }

        public IssueBuilder priority(IssuePriority priority) {
            this.priority = priority;
            return this;
        }

        public IssueBuilder status(IssueStatus status) {
            this.status = status;
            return this;
        }

        public IssueBuilder reporterName(String reporterName) {
            this.reporterName = reporterName;
            return this;
        }

        public IssueBuilder reporterPhone(String reporterPhone) {
            this.reporterPhone = reporterPhone;
            return this;
        }

        public IssueBuilder reporterIdNumber(String reporterIdNumber) {
            this.reporterIdNumber = reporterIdNumber;
            return this;
        }

        public IssueBuilder assignedTo(User assignedTo) {
            this.assignedTo = assignedTo;
            return this;
        }

        public IssueBuilder assignedAt(LocalDateTime assignedAt) {
            this.assignedAt = assignedAt;
            return this;
        }

        public IssueBuilder sector(Sector sector) {
            this.sector = sector;
            return this;
        }

        public IssueBuilder cell(Cell cell) {
            this.cell = cell;
            return this;
        }

        public IssueBuilder village(Village village) {
            this.village = village;
            return this;
        }

        public IssueBuilder resolvedAt(LocalDateTime resolvedAt) {
            this.resolvedAt = resolvedAt;
            return this;
        }

        public IssueBuilder resolutionSummary(String resolutionSummary) {
            this.resolutionSummary = resolutionSummary;
            return this;
        }

        public IssueBuilder comments(List<IssueComment> comments) {
            this.comments = comments;
            return this;
        }

        public IssueBuilder resolutions(List<Resolution> resolutions) {
            this.resolutions = resolutions;
            return this;
        }

        public Issue build() {
            return new Issue(id, issueCode, title, description, category, priority, status, reporterName, reporterPhone, reporterIdNumber, assignedTo, assignedAt, sector, cell, village, resolvedAt, resolutionSummary, comments, resolutions);
        }
    }
}
