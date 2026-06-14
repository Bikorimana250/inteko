package rw.gov.inteko.backend.dto.response;

import lombok.Builder;
import lombok.Data;
import rw.gov.inteko.backend.entity.enums.UserRole;
import rw.gov.inteko.backend.entity.enums.UserStatus;

import java.time.LocalDateTime;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String userCode;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String idNumber;
    private String phone;
    private String position;
    private UserRole role;
    private String permissions;
    private UserStatus status;
    private String avatarUrl;
    private LocalDateTime lastActiveAt;
    private String sectorName;
    private String cellName;
    private String villageName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Frontend alignment aliases
    public String getFrontendId() { return userCode; }
    public String getName() { return fullName; }
    public String getSector() { return sectorName; }
    public String getCell() { return cellName; }
    public String getVillage() { return villageName; }
    public String getAvatar() { return avatarUrl; }
    public String getLastActive() { return lastActiveAt != null ? lastActiveAt.toString() : null; }
}
