package rw.gov.inteko.backend.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.regex.Pattern;

public class RwandaPhoneValidator implements ConstraintValidator<ValidRwandaPhone, String> {
    
    private static final Pattern PHONE_PATTERN = Pattern.compile("^\\+250\\s\\d{3}\\s\\d{3}\\s\\d{3}$");
    
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isEmpty()) {
            return true; // Use @NotBlank for null checks
        }
        return PHONE_PATTERN.matcher(value).matches();
    }
}
