package rw.gov.inteko.backend.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class NationalIdValidator implements ConstraintValidator<ValidNationalId, String> {
    
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isEmpty()) {
            return true;
        }
        
        // Rwanda National ID: 16 digits
        if (!value.matches("\\d{16}")) {
            return false;
        }
        
        return true;
    }
}
