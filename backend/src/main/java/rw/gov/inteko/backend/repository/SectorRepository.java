package rw.gov.inteko.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import rw.gov.inteko.backend.entity.Sector;

import java.util.Optional;

@Repository
public interface SectorRepository extends JpaRepository<Sector, Long> {
    
    Optional<Sector> findBySectorCode(String sectorCode);
    
    Optional<Sector> findByName(String name);
    
    boolean existsBySectorCode(String sectorCode);
    
    @Query("SELECT COUNT(c) FROM Cell c WHERE c.sector.id = :sectorId")
    Long countCellsBySectorId(Long sectorId);
}
