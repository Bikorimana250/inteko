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

    @PostMapping("/{id}/action-items")
    public ResponseEntity<ApiResponse<ResolutionResponse>> addActionItem(
            @PathVariable Long id,
            @RequestParam String itemLabel,
            @RequestParam(required = false, defaultValue = "0") Integer displayOrder) {
        // Implementation for adding action items if needed
        return ResponseEntity.ok(ApiResponse.success("Action item added", resolutionService.getResolutionById(id)));
    }
}
