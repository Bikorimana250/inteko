package rw.gov.inteko.backend.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = NationalIdValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidNationalId {
    String message() default "Invalid national ID number";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
