package rw.gov.inteko.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import rw.gov.inteko.backend.entity.enums.UserRole;
import rw.gov.inteko.backend.validation.ValidRwandaPhone;
import rw.gov.inteko.backend.validation.ValidNationalId;

@Data
public class CreateUserRequest {
    
    @NotBlank(message = "First name is required")
    @Size(max = 100)
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    @Size(max = 100)
    private String lastName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;
    
    @ValidNationalId
    @NotBlank(message = "ID number is required")
    private String idNumber;
    
    @ValidRwandaPhone
    @NotBlank(message = "Phone number is required")
    private String phone;
    
    @Size(max = 150)
    private String position;
    
    @NotNull(message = "Role is required")
    private UserRole role;
    
    @NotBlank(message = "Permissions are required")
    private String permissions;
    
    private Long sectorId;
    private Long cellId;
    private Long villageId;
}
