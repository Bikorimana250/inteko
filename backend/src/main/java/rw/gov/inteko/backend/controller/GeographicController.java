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
