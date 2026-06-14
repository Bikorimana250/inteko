package rw.gov.inteko.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import rw.gov.inteko.backend.entity.Cell;

import java.util.List;
import java.util.Optional;

@Repository
public interface CellRepository extends JpaRepository<Cell, Long> {
    
    Optional<Cell> findByCellCode(String cellCode);
    
    List<Cell> findBySectorId(Long sectorId);
    
    boolean existsByCellCode(String cellCode);
    
    @Query("SELECT COUNT(v) FROM Village v WHERE v.cell.id = :cellId")
    Long countVillagesByCellId(Long cellId);
}
