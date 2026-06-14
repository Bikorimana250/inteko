package rw.gov.inteko.backend.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class IntekoException extends RuntimeException {
    private final HttpStatus status;
    private final String errorCode;
    
    public IntekoException(String message, HttpStatus status, String errorCode) {
        super(message);
        this.status = status;
        this.errorCode = errorCode;
    }
    
    public IntekoException(String message, Throwable cause, HttpStatus status, String errorCode) {
        super(message, cause);
        this.status = status;
        this.errorCode = errorCode;
    }
}
