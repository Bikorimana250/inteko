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
