package rw.gov.inteko.backend.exception;

import org.springframework.http.HttpStatus;

public class BusinessLogicException extends IntekoException {
    public BusinessLogicException(String message) {
        super(message, HttpStatus.BAD_REQUEST, "BUSINESS_LOGIC_ERROR");
    }
}
