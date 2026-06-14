package rw.gov.inteko.backend.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateUserRequest {
    
    @Size(max = 100)
    private String firstName;
    
    @Size(max = 100)
    private String lastName;
    
    private String phone;
    
    @Size(max = 150)
    private String position;
    
    private String avatarUrl;
}
