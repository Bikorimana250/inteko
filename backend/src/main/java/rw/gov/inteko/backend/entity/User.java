package rw.gov.inteko.backend.entity;

import jakarta.persistence.*;
import rw.gov.inteko.backend.entity.base.AuditableEntity;
import rw.gov.inteko.backend.entity.enums.UserRole;
import rw.gov.inteko.backend.entity.enums.UserStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_accounts")
public class User extends AuditableEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_code", unique = true, nullable = false, length = 20)
    private String userCode;
    
    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;
    
    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;
    
    @Column(name = "email", unique = true, nullable = false)
    private String email;
    
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;
    
    @Column(name = "id_number", unique = true, nullable = false, length = 16)
    private String idNumber;
    
    @Column(name = "phone", nullable = false, length = 20)
    private String phone;
    
    @Column(name = "position", length = 150)
    private String position;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 50)
    private UserRole role;
    
    @Column(name = "permissions", nullable = false, length = 50)
    private String permissions;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private UserStatus status = UserStatus.ACTIVE;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sector_id")
    private Sector sector;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cell_id")
    private Cell cell;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "village_id")
    private Village village;
    
    @Column(name = "avatar_url", columnDefinition = "TEXT")
    private String avatarUrl;
    
    @Column(name = "last_active_at")
    private LocalDateTime lastActiveAt;

    public User() {
    }

    public User(Long id, String userCode, String firstName, String lastName, String email, String passwordHash, String idNumber, String phone, String position, UserRole role, String permissions, UserStatus status, Sector sector, Cell cell, Village village, String avatarUrl, LocalDateTime lastActiveAt) {
        this.id = id;
        this.userCode = userCode;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.passwordHash = passwordHash;
        this.idNumber = idNumber;
        this.phone = phone;
        this.position = position;
        this.role = role;
        this.permissions = permissions;
        this.status = status != null ? status : UserStatus.ACTIVE;
        this.sector = sector;
        this.cell = cell;
        this.village = village;
        this.avatarUrl = avatarUrl;
        this.lastActiveAt = lastActiveAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserCode() {
        return userCode;
    }

    public void setUserCode(String userCode) {
        this.userCode = userCode;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getIdNumber() {
        return idNumber;
    }

    public void setIdNumber(String idNumber) {
        this.idNumber = idNumber;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public String getPermissions() {
        return permissions;
    }

    public void setPermissions(String permissions) {
        this.permissions = permissions;
    }

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }

    public Sector getSector() {
        return sector;
    }

    public void setSector(Sector sector) {
        this.sector = sector;
    }

    public Cell getCell() {
        return cell;
    }

    public void setCell(Cell cell) {
        this.cell = cell;
    }

    public Village getVillage() {
        return village;
    }

    public void setVillage(Village village) {
        this.village = village;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public LocalDateTime getLastActiveAt() {
        return lastActiveAt;
    }

    public void setLastActiveAt(LocalDateTime lastActiveAt) {
        this.lastActiveAt = lastActiveAt;
    }
    
    @Transient
    public String getFullName() {
        return firstName + " " + lastName;
    }
    
    @PrePersist
    protected void onCreate() {
        if (status == null) {
            status = UserStatus.ACTIVE;
        }
    }

    public static UserBuilder builder() {
        return new UserBuilder();
    }

    public static class UserBuilder {
        private Long id;
        private String userCode;
        private String firstName;
        private String lastName;
        private String email;
        private String passwordHash;
        private String idNumber;
        private String phone;
        private String position;
        private UserRole role;
        private String permissions;
        private UserStatus status = UserStatus.ACTIVE;
        private Sector sector;
        private Cell cell;
        private Village village;
        private String avatarUrl;
        private LocalDateTime lastActiveAt;

        public UserBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public UserBuilder userCode(String userCode) {
            this.userCode = userCode;
            return this;
        }

        public UserBuilder firstName(String firstName) {
            this.firstName = firstName;
            return this;
        }

        public UserBuilder lastName(String lastName) {
            this.lastName = lastName;
            return this;
        }

        public UserBuilder email(String email) {
            this.email = email;
            return this;
        }

        public UserBuilder passwordHash(String passwordHash) {
            this.passwordHash = passwordHash;
            return this;
        }

        public UserBuilder idNumber(String idNumber) {
            this.idNumber = idNumber;
            return this;
        }

        public UserBuilder phone(String phone) {
            this.phone = phone;
            return this;
        }

        public UserBuilder position(String position) {
            this.position = position;
            return this;
        }

        public UserBuilder role(UserRole role) {
            this.role = role;
            return this;
        }

        public UserBuilder permissions(String permissions) {
            this.permissions = permissions;
            return this;
        }

        public UserBuilder status(UserStatus status) {
            this.status = status;
            return this;
        }

        public UserBuilder sector(Sector sector) {
            this.sector = sector;
            return this;
        }

        public UserBuilder cell(Cell cell) {
            this.cell = cell;
            return this;
        }

        public UserBuilder village(Village village) {
            this.village = village;
            return this;
        }

        public UserBuilder avatarUrl(String avatarUrl) {
            this.avatarUrl = avatarUrl;
            return this;
        }

        public UserBuilder lastActiveAt(LocalDateTime lastActiveAt) {
            this.lastActiveAt = lastActiveAt;
            return this;
        }

        public User build() {
            return new User(id, userCode, firstName, lastName, email, passwordHash, idNumber, phone, position, role, permissions, status, sector, cell, village, avatarUrl, lastActiveAt);
        }
    }
}
