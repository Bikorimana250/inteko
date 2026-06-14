package rw.gov.inteko.backend.mapper;

import org.springframework.stereotype.Component;
import rw.gov.inteko.backend.dto.response.UserResponse;
import rw.gov.inteko.backend.entity.User;

@Component
public class UserMapper {
    
    public UserResponse toResponse(User user) {
        if (user == null) {
            return null;
        }
        
        return UserResponse.builder()
                .id(user.getId())
                .userCode(user.getUserCode())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .idNumber(user.getIdNumber())
                .phone(user.getPhone())
                .position(user.getPosition())
                .role(user.getRole())
                .permissions(user.getPermissions())
                .status(user.getStatus())
                .avatarUrl(user.getAvatarUrl())
                .lastActiveAt(user.getLastActiveAt())
                .sectorName(user.getSector() != null ? user.getSector().getName() : null)
                .cellName(user.getCell() != null ? user.getCell().getName() : null)
                .villageName(user.getVillage() != null ? user.getVillage().getName() : null)
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
