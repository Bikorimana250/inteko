# Controller Layer - REST API Endpoints

## Overview

Controllers handle HTTP requests and responses, serving as the entry point for all API operations. They delegate business logic to services and return standardized responses.

## Controller Design Principles

1. **Thin Controllers**: Delegate all business logic to services
2. **Standard Responses**: Use consistent API response format
3. **Validation**: Validate all inputs using Bean Validation
4. **HTTP Status Codes**: Return appropriate status codes
5. **Documentation**: Document all endpoints with Swagger/OpenAPI

## Authentication Controller

```java
package rw.gov.inteko.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rw.gov.inteko.backend.dto.request.LoginRequest;
import rw.gov.inteko.backend.dto.response.ApiResponse;
import rw.gov.inteko.backend.dto.response.AuthResponse;
import rw.gov.inteko.backend.service.AuthService;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }
    
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@RequestHeader("Authorization") String token) {
        authService.logout(token);
        return ResponseEntity.ok(ApiResponse.success("Logout successful", null));
    }
    
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(
            @RequestHeader("Authorization") String refreshToken) {
        AuthResponse response = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(ApiResponse.success("Token refreshed", response));
    }
    
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser() {
        UserResponse user = authService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(user));
    }
}
```

### Auth DTOs

```java
package rw.gov.inteko.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "Password is required")
    private String password;
}
```

```java
package rw.gov.inteko.backend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private Long expiresIn;
    private UserResponse user;
}
```

## User Controller

```java
package rw.gov.inteko.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import rw.gov.inteko.backend.dto.request.CreateUserRequest;
import rw.gov.inteko.backend.dto.request.UpdateUserRequest;
import rw.gov.inteko.backend.dto.response.ApiResponse;
import rw.gov.inteko.backend.dto.response.UserResponse;
import rw.gov.inteko.backend.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {
    
    private final UserService userService;
    
    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<ApiResponse<UserResponse>> createUser(
            @Valid @RequestBody CreateUserRequest request) {
        UserResponse user = userService.createUser(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("User created successfully", user));
    }
    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'SECTOR_OFFICIAL')")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success(user));
    }
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<UserResponse>>> searchUsers(
            @RequestParam String keyword,
            Pageable pageable) {
        Page<UserResponse> users = userService.searchUsers(keyword, pageable);
        return ResponseEntity.ok(ApiResponse.success(users));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request) {
        UserResponse user = userService.updateUser(id, request);
        return ResponseEntity.ok(ApiResponse.success("User updated successfully", user));
    }
    
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<ApiResponse<Void>> toggleUserStatus(@PathVariable Long id) {
        userService.toggleUserStatus(id);
        return ResponseEntity.ok(ApiResponse.success("User status updated", null));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }
}
```

## Meeting Controller

```java
package rw.gov.inteko.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import rw.gov.inteko.backend.dto.request.CreateMeetingRequest;
import rw.gov.inteko.backend.dto.response.ApiResponse;
import rw.gov.inteko.backend.dto.response.MeetingResponse;
import rw.gov.inteko.backend.entity.enums.MeetingStatus;
import rw.gov.inteko.backend.service.MeetingService;

import java.util.List;

@RestController
@RequestMapping("/meetings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MeetingController {
    
    private final MeetingService meetingService;
    
    @PostMapping
    @PreAuthorize("hasAnyRole('SECTOR_OFFICIAL', 'MEETING_SECRETARY')")
    public ResponseEntity<ApiResponse<MeetingResponse>> createMeeting(
            @Valid @RequestBody CreateMeetingRequest request) {
        MeetingResponse meeting = meetingService.createMeeting(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Meeting created successfully", meeting));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<MeetingResponse>>> getAllMeetings() {
        List<MeetingResponse> meetings = meetingService.getAllMeetings();
        return ResponseEntity.ok(ApiResponse.success(meetings));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MeetingResponse>> getMeetingById(@PathVariable Long id) {
        MeetingResponse meeting = meetingService.getMeetingById(id);
        return ResponseEntity.ok(ApiResponse.success(meeting));
    }
    
    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<List<MeetingResponse>>> getUpcomingMeetings() {
        List<MeetingResponse> meetings = meetingService.getUpcomingMeetings();
        return ResponseEntity.ok(ApiResponse.success(meetings));
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<MeetingResponse>>> getMeetingsByStatus(
            @PathVariable MeetingStatus status) {
        List<MeetingResponse> meetings = meetingService.getMeetingsByStatus(status);
        return ResponseEntity.ok(ApiResponse.success(meetings));
    }
    
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('SECTOR_OFFICIAL', 'MEETING_SECRETARY')")
    public ResponseEntity<ApiResponse<MeetingResponse>> updateMeetingStatus(
            @PathVariable Long id,
            @RequestParam MeetingStatus status) {
        MeetingResponse meeting = meetingService.updateMeetingStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Meeting status updated", meeting));
    }
}
```

## Issue Controller

```java
package rw.gov.inteko.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rw.gov.inteko.backend.dto.request.CreateIssueRequest;
import rw.gov.inteko.backend.dto.response.ApiResponse;
import rw.gov.inteko.backend.dto.response.IssueResponse;
import rw.gov.inteko.backend.entity.enums.IssueCategory;
import rw.gov.inteko.backend.entity.enums.IssueStatus;
import rw.gov.inteko.backend.service.IssueService;

import java.util.List;

@RestController
@RequestMapping("/issues")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class IssueController {
    
    private final IssueService issueService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<IssueResponse>> createIssue(
            @Valid @RequestBody CreateIssueRequest request) {
        IssueResponse issue = issueService.createIssue(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Issue reported successfully", issue));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<IssueResponse>>> getAllIssues() {
        List<IssueResponse> issues = issueService.getAllIssues();
        return ResponseEntity.ok(ApiResponse.success(issues));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<IssueResponse>> getIssueById(@PathVariable Long id) {
        IssueResponse issue = issueService.getIssueById(id);
        return ResponseEntity.ok(ApiResponse.success(issue));
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<IssueResponse>>> getIssuesByCategory(
            @PathVariable IssueCategory category) {
        List<IssueResponse> issues = issueService.getIssuesByCategory(category);
        return ResponseEntity.ok(ApiResponse.success(issues));
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<IssueResponse>>> getIssuesByStatus(
            @PathVariable IssueStatus status) {
        List<IssueResponse> issues = issueService.getIssuesByStatus(status);
        return ResponseEntity.ok(ApiResponse.success(issues));
    }
    
    @GetMapping("/assigned/{userId}")
    @PreAuthorize("hasAnyRole('SECTOR_OFFICIAL', 'ADMINISTRATOR')")
    public ResponseEntity<ApiResponse<List<IssueResponse>>> getIssuesByAssignedUser(
            @PathVariable Long userId) {
        List<IssueResponse> issues = issueService.getIssuesByAssignedUser(userId);
        return ResponseEntity.ok(ApiResponse.success(issues));
    }
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<IssueResponse>>> searchIssues(
            @RequestParam String keyword,
            Pageable pageable) {
        Page<IssueResponse> issues = issueService.searchIssues(keyword, pageable);
        return ResponseEntity.ok(ApiResponse.success(issues));
    }
    
    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('SECTOR_OFFICIAL', 'ADMINISTRATOR')")
    public ResponseEntity<ApiResponse<IssueResponse>> assignIssue(
            @PathVariable Long id,
            @RequestParam Long userId) {
        IssueResponse issue = issueService.assignIssue(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Issue assigned successfully", issue));
    }
    
    @PatchMapping("/{id}/resolve")
    @PreAuthorize("hasAnyRole('SECTOR_OFFICIAL', 'ADMINISTRATOR')")
    public ResponseEntity<ApiResponse<IssueResponse>> resolveIssue(
            @PathVariable Long id,
            @RequestParam String resolutionSummary) {
        IssueResponse issue = issueService.resolveIssue(id, resolutionSummary);
        return ResponseEntity.ok(ApiResponse.success("Issue resolved successfully", issue));
    }
}
```

## Resolution Controller

```java
package rw.gov.inteko.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import rw.gov.inteko.backend.dto.request.CreateResolutionRequest;
import rw.gov.inteko.backend.dto.response.ApiResponse;
import rw.gov.inteko.backend.dto.response.ResolutionResponse;
import rw.gov.inteko.backend.entity.enums.ResolutionStatus;
import rw.gov.inteko.backend.service.ResolutionService;

import java.util.List;

@RestController
@RequestMapping("/resolutions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyRole('SECTOR_OFFICIAL', 'MEETING_SECRETARY', 'ADMINISTRATOR')")
public class ResolutionController {
    
    private final ResolutionService resolutionService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<ResolutionResponse>> createResolution(
            @Valid @RequestBody CreateResolutionRequest request) {
        ResolutionResponse resolution = resolutionService.createResolution(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Resolution created successfully", resolution));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<ResolutionResponse>>> getAllResolutions() {
        List<ResolutionResponse> resolutions = resolutionService.getAllResolutions();
        return ResponseEntity.ok(ApiResponse.success(resolutions));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ResolutionResponse>> getResolutionById(@PathVariable Long id) {
        ResolutionResponse resolution = resolutionService.getResolutionById(id);
        return ResponseEntity.ok(ApiResponse.success(resolution));
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<ResolutionResponse>>> getResolutionsByStatus(
            @PathVariable ResolutionStatus status) {
        List<ResolutionResponse> resolutions = resolutionService.getResolutionsByStatus(status);
        return ResponseEntity.ok(ApiResponse.success(resolutions));
    }
    
    @GetMapping("/overdue")
    public ResponseEntity<ApiResponse<List<ResolutionResponse>>> getOverdueResolutions() {
        List<ResolutionResponse> resolutions = resolutionService.getOverdueResolutions();
        return ResponseEntity.ok(ApiResponse.success(resolutions));
    }
    
    @PatchMapping("/{id}/action-item/{itemId}/toggle")
    public ResponseEntity<ApiResponse<ResolutionResponse>> toggleActionItem(
            @PathVariable Long id,
            @PathVariable Long itemId) {
        ResolutionResponse resolution = resolutionService.toggleActionItem(id, itemId);
        return ResponseEntity.ok(ApiResponse.success("Action item updated", resolution));
    }
    
    @PostMapping("/{id}/comments")
    public ResponseEntity<ApiResponse<ResolutionResponse>> addComment(
            @PathVariable Long id,
            @RequestParam String commentText) {
        ResolutionResponse resolution = resolutionService.addComment(id, commentText);
        return ResponseEntity.ok(ApiResponse.success("Comment added successfully", resolution));
    }
    
    @PatchMapping("/{id}/conclude")
    public ResponseEntity<ApiResponse<ResolutionResponse>> concludeResolution(@PathVariable Long id) {
        ResolutionResponse resolution = resolutionService.concludeResolution(id);
        return ResponseEntity.ok(ApiResponse.success("Resolution concluded successfully", resolution));
    }
}
```

## Notification Controller

```java
package rw.gov.inteko.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import rw.gov.inteko.backend.dto.response.ApiResponse;
import rw.gov.inteko.backend.dto.response.NotificationResponse;
import rw.gov.inteko.backend.security.UserPrincipal;
import rw.gov.inteko.backend.service.NotificationService;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotificationController {
    
    private final NotificationService notificationService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getUserNotifications(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<NotificationResponse> notifications = notificationService.getUserNotifications(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(notifications));
    }
    
    @GetMapping("/unread")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getUnreadNotifications(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<NotificationResponse> notifications = notificationService.getUnreadNotifications(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(notifications));
    }
    
    @GetMapping("/unread/count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        Long count = notificationService.getUnreadCount(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(count));
    }
    
    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", null));
    }
    
    @PatchMapping("/mark-all-read")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        notificationService.markAllAsRead(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok(ApiResponse.success("Notification deleted", null));
    }
}
```

## Dashboard/Analytics Controller

```java
package rw.gov.inteko.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import rw.gov.inteko.backend.dto.response.ApiResponse;
import rw.gov.inteko.backend.dto.response.DashboardStatsResponse;
import rw.gov.inteko.backend.service.DashboardService;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {
    
    private final DashboardService dashboardService;
    
    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'SECTOR_OFFICIAL')")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        DashboardStatsResponse stats = dashboardService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
    
    @GetMapping("/sector/{sectorId}/stats")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'SECTOR_OFFICIAL')")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getSectorStats(@PathVariable Long sectorId) {
        DashboardStatsResponse stats = dashboardService.getSectorStats(sectorId);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
```

## Geographic Entities Controller

```java
package rw.gov.inteko.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rw.gov.inteko.backend.dto.response.ApiResponse;
import rw.gov.inteko.backend.dto.response.CellResponse;
import rw.gov.inteko.backend.dto.response.SectorResponse;
import rw.gov.inteko.backend.dto.response.VillageResponse;
import rw.gov.inteko.backend.service.GeographicService;

import java.util.List;

@RestController
@RequestMapping("/geography")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GeographicController {
    
    private final GeographicService geographicService;
    
    @GetMapping("/sectors")
    public ResponseEntity<ApiResponse<List<SectorResponse>>> getAllSectors() {
        List<SectorResponse> sectors = geographicService.getAllSectors();
        return ResponseEntity.ok(ApiResponse.success(sectors));
    }
    
    @GetMapping("/sectors/{id}/cells")
    public ResponseEntity<ApiResponse<List<CellResponse>>> getCellsBySector(@PathVariable Long id) {
        List<CellResponse> cells = geographicService.getCellsBySector(id);
        return ResponseEntity.ok(ApiResponse.success(cells));
    }
    
    @GetMapping("/cells/{id}/villages")
    public ResponseEntity<ApiResponse<List<VillageResponse>>> getVillagesByCell(@PathVariable Long id) {
        List<VillageResponse> villages = geographicService.getVillagesByCell(id);
        return ResponseEntity.ok(ApiResponse.success(villages));
    }
}
```

## API Endpoint Summary

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/auth/me` - Get current user

### Users
- `POST /api/v1/users` - Create user (Admin only)
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/{id}` - Get user by ID
- `GET /api/v1/users/search?keyword=` - Search users
- `PUT /api/v1/users/{id}` - Update user (Admin only)
- `PATCH /api/v1/users/{id}/status` - Toggle status (Admin only)
- `DELETE /api/v1/users/{id}` - Delete user (Admin only)

### Meetings
- `POST /api/v1/meetings` - Create meeting
- `GET /api/v1/meetings` - Get all meetings
- `GET /api/v1/meetings/{id}` - Get meeting by ID
- `GET /api/v1/meetings/upcoming` - Get upcoming meetings
- `GET /api/v1/meetings/status/{status}` - Get meetings by status
- `PATCH /api/v1/meetings/{id}/status?status=` - Update status

### Issues
- `POST /api/v1/issues` - Report issue
- `GET /api/v1/issues` - Get all issues
- `GET /api/v1/issues/{id}` - Get issue by ID
- `GET /api/v1/issues/category/{category}` - Get by category
- `GET /api/v1/issues/status/{status}` - Get by status
- `PATCH /api/v1/issues/{id}/assign?userId=` - Assign issue
- `PATCH /api/v1/issues/{id}/resolve` - Resolve issue

### Resolutions
- `POST /api/v1/resolutions` - Create resolution
- `GET /api/v1/resolutions` - Get all resolutions
- `GET /api/v1/resolutions/{id}` - Get resolution by ID
- `GET /api/v1/resolutions/overdue` - Get overdue resolutions
- `PATCH /api/v1/resolutions/{id}/action-item/{itemId}/toggle` - Toggle action item
- `POST /api/v1/resolutions/{id}/comments` - Add comment
- `PATCH /api/v1/resolutions/{id}/conclude` - Conclude resolution

### Notifications
- `GET /api/v1/notifications` - Get user notifications
- `GET /api/v1/notifications/unread` - Get unread notifications
- `GET /api/v1/notifications/unread/count` - Get unread count
- `PATCH /api/v1/notifications/{id}/read` - Mark as read
- `PATCH /api/v1/notifications/mark-all-read` - Mark all as read

### Dashboard & Geography
- `GET /api/v1/dashboard/stats` - Get dashboard statistics
- `GET /api/v1/geography/sectors` - Get all sectors
- `GET /api/v1/geography/sectors/{id}/cells` - Get cells by sector
- `GET /api/v1/geography/cells/{id}/villages` - Get villages by cell

## Next Steps

→ `08-authentication-security.md` - Implement JWT security
