package rw.gov.inteko.backend.entity;

import jakarta.persistence.*;
import rw.gov.inteko.backend.entity.base.AuditableEntity;

@Entity
@Table(name = "villages")
public class Village extends AuditableEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "village_code", unique = true, nullable = false, length = 20)
    private String villageCode;
    
    @Column(name = "name", nullable = false, length = 150)
    private String name;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cell_id", nullable = false)
    private Cell cell;
    
    @Column(name = "leader_name", length = 150)
    private String leaderName;
    
    @Column(name = "leader_avatar_url", columnDefinition = "TEXT")
    private String leaderAvatarUrl;
    
    @Column(name = "population")
    private Integer population = 0;

    public Village() {
    }

    public Village(Long id, String villageCode, String name, Cell cell, String leaderName, String leaderAvatarUrl, Integer population) {
        this.id = id;
        this.villageCode = villageCode;
        this.name = name;
        this.cell = cell;
        this.leaderName = leaderName;
        this.leaderAvatarUrl = leaderAvatarUrl;
        this.population = population != null ? population : 0;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getVillageCode() {
        return villageCode;
    }

    public void setVillageCode(String villageCode) {
        this.villageCode = villageCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Cell getCell() {
        return cell;
    }

    public void setCell(Cell cell) {
        this.cell = cell;
    }

    public String getLeaderName() {
        return leaderName;
    }

    public void setLeaderName(String leaderName) {
        this.leaderName = leaderName;
    }

    public String getLeaderAvatarUrl() {
        return leaderAvatarUrl;
    }

    public void setLeaderAvatarUrl(String leaderAvatarUrl) {
        this.leaderAvatarUrl = leaderAvatarUrl;
    }

    public Integer getPopulation() {
        return population;
    }

    public void setPopulation(Integer population) {
        this.population = population;
    }

    public static VillageBuilder builder() {
        return new VillageBuilder();
    }

    public static class VillageBuilder {
        private Long id;
        private String villageCode;
        private String name;
        private Cell cell;
        private String leaderName;
        private String leaderAvatarUrl;
        private Integer population = 0;

        public VillageBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public VillageBuilder villageCode(String villageCode) {
            this.villageCode = villageCode;
            return this;
        }

        public VillageBuilder name(String name) {
            this.name = name;
            return this;
        }

        public VillageBuilder cell(Cell cell) {
            this.cell = cell;
            return this;
        }

        public VillageBuilder leaderName(String leaderName) {
            this.leaderName = leaderName;
            return this;
        }

        public VillageBuilder leaderAvatarUrl(String leaderAvatarUrl) {
            this.leaderAvatarUrl = leaderAvatarUrl;
            return this;
        }

        public VillageBuilder population(Integer population) {
            this.population = population;
            return this;
        }

        public Village build() {
            return new Village(id, villageCode, name, cell, leaderName, leaderAvatarUrl, population);
        }
    }
}
