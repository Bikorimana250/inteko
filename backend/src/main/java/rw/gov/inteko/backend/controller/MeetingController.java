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
