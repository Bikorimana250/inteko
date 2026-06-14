# Validation & Error Handling

## Overview

This document covers input validation, custom exceptions, and global error handling for the Inteko backend API.

## Input Validation

### Bean Validation Annotations

```java
package rw.gov.inteko.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateIssueRequest {
    
    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 255, message = "Title must be between 5 and 255 characters")
    private String title;
    
    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;
    
    @NotNull(message = "Category is required")
    private IssueCategory category;
    
    @NotNull(message = "Priority is required")
    private IssuePriority priority;
    
    @NotBlank(message = "Reporter name is required")
    @Size(max = 150, message = "Reporter name cannot exceed 150 characters")
    private String reporterName;
    
    @Pattern(regexp = "\\+250\\s\\d{3}\\s\\d{3}\\s\\d{3}", 
             message = "Phone must be in format: +250 788 123 456")
    private String reporterPhone;
    
    @Pattern(regexp = "\\d{16}", message = "ID number must be exactly 16 digits")
    private String reporterIdNumber;
    
    @Positive(message = "Sector ID must be positive")
    private Long sectorId;
    
    @Email(message = "Invalid email format")
    private String reporterEmail;
}
```

### Custom Validators

#### Phone Number Validator
```java
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
```

```java
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
```

#### ID Number Validator
```java
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
```

```java
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
        
        // Additional validation logic can be added here
        // (e.g., checksum validation, birth year validation)
        
        return true;
    }
}
```

## Custom Exceptions

### Base Exception Classes

```java
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
```

### Specific Exception Classes

```java
package rw.gov.inteko.backend.exception;

import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends IntekoException {
    public ResourceNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND, "RESOURCE_NOT_FOUND");
    }
    
    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s not found with %s: '%s'", resourceName, fieldName, fieldValue),
              HttpStatus.NOT_FOUND, "RESOURCE_NOT_FOUND");
    }
}
```

```java
package rw.gov.inteko.backend.exception;

import org.springframework.http.HttpStatus;

public class DuplicateResourceException extends IntekoException {
    public DuplicateResourceException(String message) {
        super(message, HttpStatus.CONFLICT, "DUPLICATE_RESOURCE");
    }
}
```

```java
package rw.gov.inteko.backend.exception;

import org.springframework.http.HttpStatus;

public class AuthenticationException extends IntekoException {
    public AuthenticationException(String message) {
        super(message, HttpStatus.UNAUTHORIZED, "AUTHENTICATION_FAILED");
    }
}
```

```java
package rw.gov.inteko.backend.exception;

import org.springframework.http.HttpStatus;

public class AuthorizationException extends IntekoException {
    public AuthorizationException(String message) {
        super(message, HttpStatus.FORBIDDEN, "AUTHORIZATION_FAILED");
    }
}
```

```java
package rw.gov.inteko.backend.exception;

import org.springframework.http.HttpStatus;

public class ValidationException extends IntekoException {
    public ValidationException(String message) {
        super(message, HttpStatus.BAD_REQUEST, "VALIDATION_ERROR");
    }
}
```

```java
package rw.gov.inteko.backend.exception;

import org.springframework.http.HttpStatus;

public class BusinessLogicException extends IntekoException {
    public BusinessLogicException(String message) {
        super(message, HttpStatus.BAD_REQUEST, "BUSINESS_LOGIC_ERROR");
    }
}
```

## Error Response DTOs

```java
package rw.gov.inteko.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
    private boolean success;
    private String errorCode;
    private String message;
    private List<ValidationError> details;
    private LocalDateTime timestamp;
    private String path;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ValidationError {
        private String field;
        private String message;
        private Object rejectedValue;
    }
}
```

## Global Exception Handler

```java
package rw.gov.inteko.backend.exception;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import rw.gov.inteko.backend.dto.response.ErrorResponse;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    /**
     * Handle validation errors from @Valid annotation
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
            MethodArgumentNotValidException ex,
            HttpServletRequest request) {
        
        log.error("Validation error: {}", ex.getMessage());
        
        List<ErrorResponse.ValidationError> errors = new ArrayList<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String message = error.getDefaultMessage();
            Object rejectedValue = ((FieldError) error).getRejectedValue();
            
            errors.add(ErrorResponse.ValidationError.builder()
                    .field(fieldName)
                    .message(message)
                    .rejectedValue(rejectedValue)
                    .build());
        });
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .success(false)
                .errorCode("VALIDATION_ERROR")
                .message("Input validation failed")
                .details(errors)
                .timestamp(LocalDateTime.now())
                .path(request.getRequestURI())
                .build();
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }
    
    /**
     * Handle custom IntekoException
     */
    @ExceptionHandler(IntekoException.class)
    public ResponseEntity<ErrorResponse> handleIntekoException(
            IntekoException ex,
            HttpServletRequest request) {
        
        log.error("Business exception: {}", ex.getMessage(), ex);
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .success(false)
                .errorCode(ex.getErrorCode())
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .path(request.getRequestURI())
                .build();
        
        return ResponseEntity.status(ex.getStatus()).body(errorResponse);
    }
    
    /**
     * Handle ResourceNotFoundException
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(
            ResourceNotFoundException ex,
            HttpServletRequest request) {
        
        log.error("Resource not found: {}", ex.getMessage());
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .success(false)
                .errorCode("RESOURCE_NOT_FOUND")
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .path(request.getRequestURI())
                .build();
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }
    
    /**
     * Handle DuplicateResourceException
     */
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateResourceException(
            DuplicateResourceException ex,
            HttpServletRequest request) {
        
        log.error("Duplicate resource: {}", ex.getMessage());
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .success(false)
                .errorCode("DUPLICATE_RESOURCE")
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .path(request.getRequestURI())
                .build();
        
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }
    
    /**
     * Handle Spring Security BadCredentialsException
     */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentialsException(
            BadCredentialsException ex,
            HttpServletRequest request) {
        
        log.error("Bad credentials: {}", ex.getMessage());
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .success(false)
                .errorCode("AUTHENTICATION_FAILED")
                .message("Invalid email or password")
                .timestamp(LocalDateTime.now())
                .path(request.getRequestURI())
                .build();
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }
    
    /**
     * Handle Spring Security AccessDeniedException
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(
            AccessDeniedException ex,
            HttpServletRequest request) {
        
        log.error("Access denied: {}", ex.getMessage());
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .success(false)
                .errorCode("ACCESS_DENIED")
                .message("You don't have permission to access this resource")
                .timestamp(LocalDateTime.now())
                .path(request.getRequestURI())
                .build();
        
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
    }
    
    /**
     * Handle IllegalArgumentException
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(
            IllegalArgumentException ex,
            HttpServletRequest request) {
        
        log.error("Illegal argument: {}", ex.getMessage());
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .success(false)
                .errorCode("INVALID_ARGUMENT")
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .path(request.getRequestURI())
                .build();
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }
    
    /**
     * Handle all other exceptions
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(
            Exception ex,
            HttpServletRequest request) {
        
        log.error("Unexpected error occurred", ex);
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .success(false)
                .errorCode("INTERNAL_SERVER_ERROR")
                .message("An unexpected error occurred. Please try again later.")
                .timestamp(LocalDateTime.now())
                .path(request.getRequestURI())
                .build();
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}
```

## Example Error Responses

### Validation Error
```json
{
  "success": false,
  "errorCode": "VALIDATION_ERROR",
  "message": "Input validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format",
      "rejectedValue": "invalid-email"
    },
    {
      "field": "phone",
      "message": "Phone must be in format: +250 788 123 456",
      "rejectedValue": "12345"
    }
  ],
  "timestamp": "2023-10-24T10:45:00",
  "path": "/api/v1/users"
}
```

### Resource Not Found Error
```json
{
  "success": false,
  "errorCode": "RESOURCE_NOT_FOUND",
  "message": "User not found with ID: 999",
  "timestamp": "2023-10-24T10:45:00",
  "path": "/api/v1/users/999"
}
```

### Authentication Error
```json
{
  "success": false,
  "errorCode": "AUTHENTICATION_FAILED",
  "message": "Invalid email or password",
  "timestamp": "2023-10-24T10:45:00",
  "path": "/api/v1/auth/login"
}
```

### Authorization Error
```json
{
  "success": false,
  "errorCode": "ACCESS_DENIED",
  "message": "You don't have permission to access this resource",
  "timestamp": "2023-10-24T10:45:00",
  "path": "/api/v1/users"
}
```

## Validation Groups (Advanced)

```java
package rw.gov.inteko.backend.validation;

public interface ValidationGroups {
    interface Create {}
    interface Update {}
}
```

```java
@Data
public class UserRequest {
    
    @Null(groups = Create.class, message = "ID must be null for creation")
    @NotNull(groups = Update.class, message = "ID is required for update")
    private Long id;
    
    @NotBlank(groups = {Create.class, Update.class})
    private String name;
}
```

```java
// In Controller
@PostMapping
public ResponseEntity<?> create(@Validated(Create.class) @RequestBody UserRequest request) {
    // ...
}

@PutMapping("/{id}")
public ResponseEntity<?> update(@Validated(Update.class) @RequestBody UserRequest request) {
    // ...
}
```

## Best Practices

1. **Use specific exceptions** for different error scenarios
2. **Provide clear error messages** that help users understand the problem
3. **Log errors appropriately** (debug, info, error levels)
4. **Don't expose sensitive information** in error messages
5. **Use validation groups** for different operation types
6. **Implement custom validators** for complex business rules
7. **Return consistent error response format**
8. **Include error codes** for easier client-side handling
9. **Add timestamps and request paths** for debugging

## Next Steps

→ `10-testing-strategy.md` - Testing approach and examples
→ `11-deployment-guide.md` - Production deployment instructions
