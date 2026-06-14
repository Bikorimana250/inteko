package rw.gov.inteko.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import rw.gov.inteko.backend.dto.response.NotificationResponse;
import rw.gov.inteko.backend.entity.Issue;
import rw.gov.inteko.backend.entity.Notification;
import rw.gov.inteko.backend.entity.enums.NotificationCategory;
import rw.gov.inteko.backend.exception.ResourceNotFoundException;
import rw.gov.inteko.backend.repository.NotificationRepository;
import rw.gov.inteko.backend.mapper.NotificationMapper;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;
    
    @Transactional
    public void createIssueNotification(Issue issue) {
        Notification notification = Notification.builder()
                .notificationCode(generateNotificationCode())
                .title("New Issue Reported")
                .message(String.format("Citizen %s filed a new issue: \"%s\"", 
                        issue.getReporterName(), issue.getTitle()))
                .category(NotificationCategory.ISSUE)
                .isRead(false)
                .build();
        
        notificationRepository.save(notification);
        log.info("Notification created for issue: {}", issue.getIssueCode());
    }
    
    public List<NotificationResponse> getUserNotifications(Long userId) {
        return notificationRepository.findByUserId(userId)
                .stream()
                .map(notificationMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    public List<NotificationResponse> getUnreadNotifications(Long userId) {
        return notificationRepository.findUnreadByUserId(userId)
                .stream()
                .map(notificationMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    public Long getUnreadCount(Long userId) {
        return notificationRepository.countUnreadByUserId(userId);
    }
    
    @Transactional
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        
        notification.setIsRead(true);
        notification.setReadAt(LocalDateTime.now());
        notificationRepository.save(notification);
    }
    
    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsReadForUser(userId);
    }
    
    @Transactional
    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }
    
    private String generateNotificationCode() {
        long count = notificationRepository.count() + 1;
        return String.format("N-%03d", count);
    }
}
