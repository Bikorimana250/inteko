package rw.gov.inteko.backend.exception;

import org.springframework.http.HttpStatus;

public class AuthorizationException extends IntekoException {
    public AuthorizationException(String message) {
        super(message, HttpStatus.FORBIDDEN, "AUTHORIZATION_FAILED");
    }
}
