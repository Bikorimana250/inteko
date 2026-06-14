package rw.gov.inteko.backend.dto.response;

import lombok.Builder;
import lombok.Data;
import rw.gov.inteko.backend.entity.enums.NotificationCategory;

import java.time.LocalDateTime;

@Data
@Builder
public class NotificationResponse {
    private Long id;
    private String notificationCode;
    private String title;
    private String message;
    private NotificationCategory category;
    private Boolean isRead;
    private LocalDateTime readAt;
    private String actionLabel;
    private String actionUrl;
    private LocalDateTime createdAt;
}
