package rw.gov.inteko.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rw.gov.inteko.backend.dto.response.ApiResponse;
import rw.gov.inteko.backend.dto.response.AttendanceSummaryResponse;
import rw.gov.inteko.backend.service.AttendanceSummaryService;

@RestController
@RequestMapping("/attendance")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AttendanceSummaryController {

    private final AttendanceSummaryService attendanceSummaryService;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<AttendanceSummaryResponse>> getSummary() {
        return ResponseEntity.ok(ApiResponse.success(attendanceSummaryService.getSummary()));
    }
}
