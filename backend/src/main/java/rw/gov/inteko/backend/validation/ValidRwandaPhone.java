package rw.gov.inteko.backend.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = RwandaPhoneValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidRwandaPhone {
    String message() default "Invalid Rwanda phone number format";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
