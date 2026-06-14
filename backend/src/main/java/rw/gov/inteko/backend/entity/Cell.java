package rw.gov.inteko.backend.entity;

import jakarta.persistence.*;
import rw.gov.inteko.backend.entity.base.AuditableEntity;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cells")
public class Cell extends AuditableEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "cell_code", unique = true, nullable = false, length = 20)
    private String cellCode;
    
    @Column(name = "name", nullable = false, length = 150)
    private String name;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sector_id", nullable = false)
    private Sector sector;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @OneToMany(mappedBy = "cell", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Village> villages = new ArrayList<>();

    public Cell() {
    }

    public Cell(Long id, String cellCode, String name, Sector sector, String description, List<Village> villages) {
        this.id = id;
        this.cellCode = cellCode;
        this.name = name;
        this.sector = sector;
        this.description = description;
        this.villages = villages != null ? villages : new ArrayList<>();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCellCode() {
        return cellCode;
    }

    public void setCellCode(String cellCode) {
        this.cellCode = cellCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Sector getSector() {
        return sector;
    }

    public void setSector(Sector sector) {
        this.sector = sector;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Village> getVillages() {
        return villages;
    }

    public void setVillages(List<Village> villages) {
        this.villages = villages;
    }

    public static CellBuilder builder() {
        return new CellBuilder();
    }

    public static class CellBuilder {
        private Long id;
        private String cellCode;
        private String name;
        private Sector sector;
        private String description;
        private List<Village> villages = new ArrayList<>();

        public CellBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public CellBuilder cellCode(String cellCode) {
            this.cellCode = cellCode;
            return this;
        }

        public CellBuilder name(String name) {
            this.name = name;
            return this;
        }

        public CellBuilder sector(Sector sector) {
            this.sector = sector;
            return this;
        }

        public CellBuilder description(String description) {
            this.description = description;
            return this;
        }

        public CellBuilder villages(List<Village> villages) {
            this.villages = villages;
            return this;
        }

        public Cell build() {
            return new Cell(id, cellCode, name, sector, description, villages);
        }
    }
}
