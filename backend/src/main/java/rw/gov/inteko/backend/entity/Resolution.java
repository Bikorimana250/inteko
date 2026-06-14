package rw.gov.inteko.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import rw.gov.inteko.backend.entity.base.AuditableEntity;
import rw.gov.inteko.backend.entity.enums.ResolutionStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "resolutions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resolution extends AuditableEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "resolution_code", unique = true, nullable = false, length = 20)
    private String resolutionCode;
    
    @Column(name = "title", nullable = false)
    private String title;
    
    @Column(name = "summary", nullable = false, columnDefinition = "TEXT")
    private String summary;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "linked_issue_id")
    private Issue linkedIssue;
    
    @Column(name = "assigned_unit", length = 150)
    private String assignedUnit;
    
    @Column(name = "responsible_officer", length = 150)
    private String responsibleOfficer;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private User assignedTo;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private ResolutionStatus status = ResolutionStatus.ACTIVE;
    
    @Column(name = "progress_percentage")
    private Integer progressPercentage = 0;
    
    @Column(name = "due_date")
    private LocalDate dueDate;
    
    @Column(name = "concluded_at")
    private LocalDateTime concludedAt;
    
    @OneToMany(mappedBy = "resolution", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("display_order ASC")
    @Builder.Default
    private List<ResolutionActionItem> actionItems = new ArrayList<>();
    
    @OneToMany(mappedBy = "resolution", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("created_at DESC")
    @Builder.Default
    private List<ResolutionComment> comments = new ArrayList<>();
    
    @OneToMany(mappedBy = "resolution", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ResolutionDocument> documents = new ArrayList<>();
    
    public void calculateProgress() {
        if (actionItems.isEmpty()) {
            progressPercentage = 0;
            return;
        }
        long completedCount = actionItems.stream()
                .filter(ResolutionActionItem::getIsCompleted)
                .count();
        progressPercentage = (int) ((completedCount * 100.0) / actionItems.size());
    }
}
