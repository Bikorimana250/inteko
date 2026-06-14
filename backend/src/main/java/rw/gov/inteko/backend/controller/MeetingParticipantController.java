package rw.gov.inteko.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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

    @GetMapping("/count-present")
    public ResponseEntity<ApiResponse<Long>> countPresent(@PathVariable Long meetingId) {
        return ResponseEntity.ok(ApiResponse.success(participantService.countPresent(meetingId)));
    }
}
