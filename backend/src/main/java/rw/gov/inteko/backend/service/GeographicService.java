package rw.gov.inteko.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import rw.gov.inteko.backend.dto.response.CellResponse;
import rw.gov.inteko.backend.dto.response.SectorResponse;
import rw.gov.inteko.backend.dto.response.VillageResponse;
import rw.gov.inteko.backend.repository.CellRepository;
import rw.gov.inteko.backend.repository.SectorRepository;
import rw.gov.inteko.backend.repository.VillageRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GeographicService {

    private final SectorRepository sectorRepository;
    private final CellRepository cellRepository;
    private final VillageRepository villageRepository;

    public List<SectorResponse> getAllSectors() {
        return sectorRepository.findAll().stream()
                .map(sector -> SectorResponse.builder()
                        .id(sector.getId())
                        .sectorCode(sector.getSectorCode())
                        .name(sector.getName())
                        .description(sector.getDescription())
                        .cellCount(sector.getCells().size())
                        .build())
                .collect(Collectors.toList());
    }

    public List<CellResponse> getCellsBySector(Long sectorId) {
        return cellRepository.findBySectorId(sectorId).stream()
                .map(cell -> CellResponse.builder()
                        .id(cell.getId())
                        .cellCode(cell.getCellCode())
                        .name(cell.getName())
                        .sectorName(cell.getSector().getName())
                        .villageCount(cell.getVillages().size())
                        .build())
                .collect(Collectors.toList());
    }

    public List<VillageResponse> getVillagesByCell(Long cellId) {
        return villageRepository.findByCellId(cellId).stream()
                .map(village -> VillageResponse.builder()
                        .id(village.getId())
                        .villageCode(village.getVillageCode())
                        .name(village.getName())
                        .cellName(village.getCell().getName())
                        .leaderName(village.getLeaderName())
                        .population(village.getPopulation())
                        .build())
                .collect(Collectors.toList());
    }
}
