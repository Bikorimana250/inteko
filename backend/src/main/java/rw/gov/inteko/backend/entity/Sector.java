package rw.gov.inteko.backend.entity;

import jakarta.persistence.*;
import rw.gov.inteko.backend.entity.base.AuditableEntity;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sectors")
public class Sector extends AuditableEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "sector_code", unique = true, nullable = false, length = 20)
    private String sectorCode;
    
    @Column(name = "name", nullable = false, length = 150)
    private String name;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @OneToMany(mappedBy = "sector", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Cell> cells = new ArrayList<>();

    public Sector() {
    }

    public Sector(Long id, String sectorCode, String name, String description, List<Cell> cells) {
        this.id = id;
        this.sectorCode = sectorCode;
        this.name = name;
        this.description = description;
        this.cells = cells != null ? cells : new ArrayList<>();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSectorCode() {
        return sectorCode;
    }

    public void setSectorCode(String sectorCode) {
        this.sectorCode = sectorCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Cell> getCells() {
        return cells;
    }

    public void setCells(List<Cell> cells) {
        this.cells = cells;
    }

    public static SectorBuilder builder() {
        return new SectorBuilder();
    }

    public static class SectorBuilder {
        private Long id;
        private String sectorCode;
        private String name;
        private String description;
        private List<Cell> cells = new ArrayList<>();

        public SectorBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public SectorBuilder sectorCode(String sectorCode) {
            this.sectorCode = sectorCode;
            return this;
        }

        public SectorBuilder name(String name) {
            this.name = name;
            return this;
        }

        public SectorBuilder description(String description) {
            this.description = description;
            return this;
        }

        public SectorBuilder cells(List<Cell> cells) {
            this.cells = cells;
            return this;
        }

        public Sector build() {
            return new Sector(id, sectorCode, name, description, cells);
        }
    }
}
