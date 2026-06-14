package rw.gov.inteko.backend.exception;

import org.springframework.http.HttpStatus;

public class AuthenticationException extends IntekoException {
    public AuthenticationException(String message) {
        super(message, HttpStatus.UNAUTHORIZED, "AUTHENTICATION_FAILED");
    }
}
