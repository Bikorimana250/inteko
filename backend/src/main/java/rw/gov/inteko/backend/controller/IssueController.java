package rw.gov.inteko.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @PostMapping("/{id}/comments")
    public ResponseEntity<ApiResponse<IssueResponse>> addComment(
            @PathVariable Long id,
            @RequestParam String commentText) {
        IssueResponse issue = issueService.addComment(id, commentText);
        return ResponseEntity.ok(ApiResponse.success("Comment added successfully", issue));
    }
}
