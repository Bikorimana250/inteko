package rw.gov.inteko.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import rw.gov.inteko.backend.entity.base.AuditableEntity;
import rw.gov.inteko.backend.entity.enums.MeetingStatus;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "meetings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Meeting extends AuditableEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "meeting_code", unique = true, nullable = false, length = 30)
    private String meetingCode;
    
    @Column(name = "title", nullable = false)
    private String title;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "meeting_date", nullable = false)
    private LocalDate meetingDate;
    
    @Column(name = "meeting_time", nullable = false)
    private LocalTime meetingTime;
    
    @Column(name = "location", nullable = false)
    private String location;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private MeetingStatus status = MeetingStatus.SCHEDULED;
    
    @Column(name = "participants_count")
    private Integer participantsCount = 0;
    
    @Column(name = "target_count", nullable = false)
    private Integer targetCount = 0;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sector_id", nullable = false)
    private Sector sector;
    
    @OneToMany(mappedBy = "meeting", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<MeetingParticipant> participants = new ArrayList<>();
    
    @OneToMany(mappedBy = "meeting", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<MeetingDocument> documents = new ArrayList<>();
    
    @Transient
    public Double getAttendancePercentage() {
        if (targetCount == null || targetCount == 0) {
            return 0.0;
        }
        return (participantsCount.doubleValue() / targetCount) * 100;
    }
}
