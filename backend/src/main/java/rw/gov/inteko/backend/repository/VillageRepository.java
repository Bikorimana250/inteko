package rw.gov.inteko.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import rw.gov.inteko.backend.entity.Village;

import java.util.List;
import java.util.Optional;

@Repository
public interface VillageRepository extends JpaRepository<Village, Long> {
    
    Optional<Village> findByVillageCode(String villageCode);
    
    List<Village> findByCellId(Long cellId);
    
    @Query("SELECT v FROM Village v WHERE v.cell.sector.id = :sectorId")
    List<Village> findBySectorId(Long sectorId);
    
    boolean existsByVillageCode(String villageCode);
    
    @Query("SELECT SUM(v.population) FROM Village v WHERE v.cell.id = :cellId")
    Integer getTotalPopulationByCell(Long cellId);
    
    @Query("SELECT SUM(v.population) FROM Village v WHERE v.cell.sector.id = :sectorId")
    Integer getTotalPopulationBySector(Long sectorId);
}
