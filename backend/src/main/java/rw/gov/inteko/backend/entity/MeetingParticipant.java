package rw.gov.inteko.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import rw.gov.inteko.backend.entity.enums.AttendanceStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "meeting_participants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MeetingParticipant {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meeting_id", nullable = false)
    private Meeting meeting;
    
    @Column(name = "participant_name", nullable = false, length = 150)
    private String participantName;
    
    @Column(name = "id_number", length = 16)
    private String idNumber;
    
    @Column(name = "phone", length = 20)
    private String phone;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "village_id")
    private Village village;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "attendance_status", length = 20)
    private AttendanceStatus attendanceStatus = AttendanceStatus.PRESENT;
    
    @Column(name = "checked_in_at")
    private LocalDateTime checkedInAt;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "created_by")
    private Long createdBy;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (attendanceStatus == null) {
            attendanceStatus = AttendanceStatus.PRESENT;
        }
    }
}
