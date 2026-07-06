package rw.gov.inteko.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rw.gov.inteko.backend.dto.request.AddParticipantRequest;
import rw.gov.inteko.backend.dto.response.ApiResponse;
import rw.gov.inteko.backend.dto.response.MeetingParticipantResponse;
import rw.gov.inteko.backend.service.MeetingParticipantService;

import java.util.List;

@RestController
@RequestMapping("/meetings/{meetingId}/participants")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MeetingParticipantController {
    private final MeetingParticipantService participantService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<MeetingParticipantResponse>>> getParticipants(@PathVariable Long meetingId) {
        return ResponseEntity.ok(ApiResponse.success(participantService.getParticipantsByMeetingId(meetingId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MeetingParticipantResponse>> addParticipant(
            @PathVariable Long meetingId,
            @Valid @RequestBody AddParticipantRequest request) {
        MeetingParticipantResponse response = participantService.addParticipant(meetingId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Participant checked in", response));
    }

    @GetMapping("/count-present")
    public ResponseEntity<ApiResponse<Long>> countPresent(@PathVariable Long meetingId) {
        return ResponseEntity.ok(ApiResponse.success(participantService.countPresent(meetingId)));
    }
}
