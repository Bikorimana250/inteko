package rw.gov.inteko.backend.exception;

import org.springframework.http.HttpStatus;

public class ValidationException extends IntekoException {
    public ValidationException(String message) {
        super(message, HttpStatus.BAD_REQUEST, "VALIDATION_ERROR");
    }
}
