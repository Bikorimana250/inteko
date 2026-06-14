package rw.gov.inteko.backend.mapper;

import org.springframework.stereotype.Component;
import rw.gov.inteko.backend.dto.response.NotificationResponse;
import rw.gov.inteko.backend.entity.Notification;

@Component
public class NotificationMapper {
    
    public NotificationResponse toResponse(Notification notification) {
        if (notification == null) {
            return null;
        }
        
        return NotificationResponse.builder()
                .id(notification.getId())
                .notificationCode(notification.getNotificationCode())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .category(notification.getCategory())
                .isRead(notification.getIsRead())
                .readAt(notification.getReadAt())
                .actionLabel(notification.getActionLabel())
                .actionUrl(notification.getActionUrl())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
