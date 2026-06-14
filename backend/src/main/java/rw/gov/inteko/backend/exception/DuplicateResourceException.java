package rw.gov.inteko.backend.exception;

import org.springframework.http.HttpStatus;

public class DuplicateResourceException extends IntekoException {
    public DuplicateResourceException(String message) {
        super(message, HttpStatus.CONFLICT, "DUPLICATE_RESOURCE");
    }
}
