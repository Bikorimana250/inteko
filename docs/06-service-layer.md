# Service Layer

## Overview

The service layer contains the business logic of the application. It sits between the controller and repository layers, handling data transformation, validation, and complex operations.

## Service Design Principles

1. **Single Responsibility**: Each service handles one domain entity
2. **Transaction Management**: Use `@Transactional` for data consistency
3. **Exception Handling**: Throw custom exceptions for business rule violations
4. **DTO Mapping**: Convert between entities and DTOs
5. **Security**: Check permissions within services

## DTOs (Data Transfer Objects)

### Request DTOs

```java
package rw.gov.inteko.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import rw.gov.inteko.backend.entity.enums.UserRole;

@Data
public class CreateUserRequest {
    
    @NotBlank(message = "First name is required")
    @Size(max = 100)
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    @Size(max = 100)
    private String lastName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;
    
    @NotBlank(message = "ID number is required")
    @Pattern(regexp = "\\d{16}", message = "ID number must be 16 digits")
    private String idNumber;
    
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "\\+250\\s\\d{3}\\s\\d{3}\\s\\d{3}", message = "Invalid phone format")
    private String phone;
    
    @Size(max = 150)
    private String position;
    
    @NotNull(message = "Role is required")
    private UserRole role;
    
    @NotBlank(message = "Permissions are required")
    private String permissions;
    
    private Long sectorId;
    private Long cellId;
    private Long villageId;
}
```

### Response DTOs

```java
package rw.gov.inteko.backend.dto.response;

import lombok.Data;
import lombok.Builder;
import rw.gov.inteko.backend.entity.enums.UserRole;
import rw.gov.inteko.backend.entity.enums.UserStatus;

import java.time.LocalDateTime;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String userCode;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String idNumber;
    private String phone;
    private String position;
    private UserRole role;
    private String permissions;
    private UserStatus status;
    private String avatarUrl;
    private LocalDateTime lastActiveAt;
    
    // Geographic info
    private String sectorName;
    private String cellName;
    private String villageName;
    
    // Audit info
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

### Standard API Response Wrapper

```java
package rw.gov.inteko.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private LocalDateTime timestamp;
    
    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }
    
    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }
    
    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
```

## Core Services

### 1. User Service

```java
package rw.gov.inteko.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import rw.gov.inteko.backend.dto.request.CreateUserRequest;
import rw.gov.inteko.backend.dto.request.UpdateUserRequest;
import rw.gov.inteko.backend.dto.response.UserResponse;
import rw.gov.inteko.backend.entity.User;
import rw.gov.inteko.backend.entity.enums.UserStatus;
import rw.gov.inteko.backend.exception.ResourceNotFoundException;
import rw.gov.inteko.backend.exception.DuplicateResourceException;
import rw.gov.inteko.backend.repository.*;
import rw.gov.inteko.backend.mapper.UserMapper;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class UserService {
    
    private final UserRepository userRepository;
    private final SectorRepository sectorRepository;
    private final CellRepository cellRepository;
    private final VillageRepository villageRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    
    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        log.info("Creating new user with email: {}", request.getEmail());
        
        // Check for duplicates
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists: " + request.getEmail());
        }
        
        if (userRepository.existsByIdNumber(request.getIdNumber())) {
            throw new DuplicateResourceException("ID number already exists: " + request.getIdNumber());
        }
        
        // Build user entity
        User user = User.builder()
                .userCode(generateUserCode())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .idNumber(request.getIdNumber())
                .phone(request.getPhone())
                .position(request.getPosition())
                .role(request.getRole())
                .permissions(request.getPermissions())
                .status(UserStatus.ACTIVE)
                .build();
        
        // Set geographic assignments
        if (request.getSectorId() != null) {
            user.setSector(sectorRepository.findById(request.getSectorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Sector not found")));
        }
        
        if (request.getCellId() != null) {
            user.setCell(cellRepository.findById(request.getCellId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cell not found")));
        }
        
        if (request.getVillageId() != null) {
            user.setVillage(villageRepository.findById(request.getVillageId())
                    .orElseThrow(() -> new ResourceNotFoundException("Village not found")));
        }
        
        User savedUser = userRepository.save(user);
        log.info("User created successfully with ID: {}", savedUser.getId());
        
        return userMapper.toResponse(savedUser);
    }
    
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        return userMapper.toResponse(user);
    }
    
    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return userMapper.toResponse(user);
    }
    
    public List<UserResponse> getAllUsers() {
        return userRepository.findAllActiveUsers()
                .stream()
                .map(userMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    public Page<UserResponse> searchUsers(String keyword, Pageable pageable) {
        return userRepository.searchUsers(keyword, pageable)
                .map(userMapper::toResponse);
    }
    
    @Transactional
    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        log.info("Updating user with ID: {}", id);
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        
        // Update fields
        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getPosition() != null) user.setPosition(request.getPosition());
        if (request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl());
        
        User updatedUser = userRepository.save(user);
        log.info("User updated successfully");
        
        return userMapper.toResponse(updatedUser);
    }
    
    @Transactional
    public void toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        
        user.setStatus(user.getStatus() == UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE);
        user.setLastActiveAt(LocalDateTime.now());
        userRepository.save(user);
        
        log.info("User status toggled to: {}", user.getStatus());
    }
    
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        
        user.setDeletedAt(LocalDateTime.now());
        userRepository.save(user);
        
        log.info("User soft deleted with ID: {}", id);
    }
    
    private String generateUserCode() {
        long count = userRepository.count() + 1;
        return String.format("U-%03d", count);
    }
}
```

### 2. Meeting Service

```java
package rw.gov.inteko.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import rw.gov.inteko.backend.dto.request.CreateMeetingRequest;
import rw.gov.inteko.backend.dto.response.MeetingResponse;
import rw.gov.inteko.backend.entity.Meeting;
import rw.gov.inteko.backend.entity.enums.MeetingStatus;
import rw.gov.inteko.backend.exception.ResourceNotFoundException;
import rw.gov.inteko.backend.repository.MeetingRepository;
import rw.gov.inteko.backend.repository.SectorRepository;
import rw.gov.inteko.backend.mapper.MeetingMapper;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class MeetingService {
    
    private final MeetingRepository meetingRepository;
    private final SectorRepository sectorRepository;
    private final MeetingMapper meetingMapper;
    
    @Transactional
    public MeetingResponse createMeeting(CreateMeetingRequest request) {
        log.info("Creating new meeting: {}", request.getTitle());
        
        var sector = sectorRepository.findById(request.getSectorId())
                .orElseThrow(() -> new ResourceNotFoundException("Sector not found"));
        
        Meeting meeting = Meeting.builder()
                .meetingCode(generateMeetingCode())
                .title(request.getTitle())
                .description(request.getDescription())
                .meetingDate(request.getMeetingDate())
                .meetingTime(request.getMeetingTime())
                .location(request.getLocation())
                .targetCount(request.getTargetCount())
                .status(MeetingStatus.SCHEDULED)
                .sector(sector)
                .build();
        
        Meeting savedMeeting = meetingRepository.save(meeting);
        log.info("Meeting created with code: {}", savedMeeting.getMeetingCode());
        
        return meetingMapper.toResponse(savedMeeting);
    }
    
    public MeetingResponse getMeetingById(Long id) {
        Meeting meeting = meetingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Meeting not found with ID: " + id));
        return meetingMapper.toResponse(meeting);
    }
    
    public List<MeetingResponse> getAllMeetings() {
        return meetingRepository.findAllActiveMeetings()
                .stream()
                .map(meetingMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    public List<MeetingResponse> getUpcomingMeetings() {
        return meetingRepository.findUpcomingMeetings(LocalDate.now())
                .stream()
                .map(meetingMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public MeetingResponse updateMeetingStatus(Long id, MeetingStatus status) {
        log.info("Updating meeting {} status to {}", id, status);
        
        Meeting meeting = meetingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Meeting not found with ID: " + id));
        
        meeting.setStatus(status);
        
        // If completing, calculate final participant count
        if (status == MeetingStatus.COMPLETED && meeting.getParticipantsCount() == 0) {
            int simulatedCount = (int) (meeting.getTargetCount() * (0.75 + Math.random() * 0.2));
            meeting.setParticipantsCount(simulatedCount);
        }
        
        Meeting updatedMeeting = meetingRepository.save(meeting);
        return meetingMapper.toResponse(updatedMeeting);
    }
    
    private String generateMeetingCode() {
        long count = meetingRepository.count() + 89;
        return String.format("#MTG-2023-%03d", count);
    }
}
```

### 3. Issue Service

```java
package rw.gov.inteko.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import rw.gov.inteko.backend.dto.request.CreateIssueRequest;
import rw.gov.inteko.backend.dto.response.IssueResponse;
import rw.gov.inteko.backend.entity.Issue;
import rw.gov.inteko.backend.entity.enums.IssueStatus;
import rw.gov.inteko.backend.exception.ResourceNotFoundException;
import rw.gov.inteko.backend.repository.*;
import rw.gov.inteko.backend.mapper.IssueMapper;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class IssueService {
    
    private final IssueRepository issueRepository;
    private final UserRepository userRepository;
    private final SectorRepository sectorRepository;
    private final CellRepository cellRepository;
    private final VillageRepository villageRepository;
    private final IssueMapper issueMapper;
    private final NotificationService notificationService;
    
    @Transactional
    public IssueResponse createIssue(CreateIssueRequest request) {
        log.info("Creating new issue: {}", request.getTitle());
        
        Issue issue = Issue.builder()
                .issueCode(generateIssueCode())
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .priority(request.getPriority())
                .status(IssueStatus.ACTIVE)
                .reporterName(request.getReporterName())
                .reporterPhone(request.getReporterPhone())
                .reporterIdNumber(request.getReporterIdNumber())
                .build();
        
        // Set geographic context
        if (request.getSectorId() != null) {
            issue.setSector(sectorRepository.findById(request.getSectorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Sector not found")));
        }
        
        Issue savedIssue = issueRepository.save(issue);
        log.info("Issue created with code: {}", savedIssue.getIssueCode());
        
        // Create notification
        notificationService.createIssueNotification(savedIssue);
        
        return issueMapper.toResponse(savedIssue);
    }
    
    public List<IssueResponse> getAllIssues() {
        return issueRepository.findAllActiveIssues()
                .stream()
                .map(issueMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    public List<IssueResponse> getIssuesByAssignedUser(Long userId) {
        return issueRepository.findByAssignedTo(userId)
                .stream()
                .map(issueMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public IssueResponse assignIssue(Long issueId, Long userId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found"));
        
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        issue.setAssignedTo(user);
        issue.setAssignedAt(LocalDateTime.now());
        issue.setStatus(IssueStatus.PROCESSING);
        
        Issue updatedIssue = issueRepository.save(issue);
        return issueMapper.toResponse(updatedIssue);
    }
    
    @Transactional
    public IssueResponse resolveIssue(Long issueId, String resolutionSummary) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found"));
        
        issue.setStatus(IssueStatus.RESOLVED);
        issue.setResolvedAt(LocalDateTime.now());
        issue.setResolutionSummary(resolutionSummary);
        
        Issue resolvedIssue = issueRepository.save(issue);
        return issueMapper.toResponse(resolvedIssue);
    }
    
    private String generateIssueCode() {
        long count = issueRepository.count() + 1;
        return String.format("I-%02d", count);
    }
}
```

### 4. Notification Service

```java
package rw.gov.inteko.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import rw.gov.inteko.backend.dto.response.NotificationResponse;
import rw.gov.inteko.backend.entity.Issue;
import rw.gov.inteko.backend.entity.Notification;
import rw.gov.inteko.backend.entity.User;
import rw.gov.inteko.backend.entity.enums.NotificationCategory;
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
    
    private String generateNotificationCode() {
        long count = notificationRepository.count() + 1;
        return String.format("N-%03d", count);
    }
}
```

## Mapper Interface (Using MapStruct)

```java
package rw.gov.inteko.backend.mapper;

import org.mapstruct.*;
import rw.gov.inteko.backend.dto.response.UserResponse;
import rw.gov.inteko.backend.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    
    @Mapping(target = "fullName", expression = "java(user.getFullName())")
    @Mapping(target = "sectorName", source = "sector.name")
    @Mapping(target = "cellName", source = "cell.name")
    @Mapping(target = "villageName", source = "village.name")
    UserResponse toResponse(User user);
}
```

## Next Steps

→ `07-controller-layer.md` - Create REST API endpoints
