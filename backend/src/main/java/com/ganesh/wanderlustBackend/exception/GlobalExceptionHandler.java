package com.ganesh.wanderlustBackend.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleResourceNotFoundException(ResourceNotFoundException ex){
        Map<String, String> error = new HashMap<>();

        error.put("message", ex.getMessage());

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String,String>> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex){
        Map<String,String> errors = new HashMap<>();

        for(FieldError fieldError: ex.getBindingResult().getFieldErrors()){
            errors.put(
                    fieldError.getField(),
                    fieldError.getDefaultMessage()
            );
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String,String>> handleDataIntegrityViolationException(DataIntegrityViolationException ex){
      Map<String,String> map = new HashMap<>();

      map.put("message", "Email or Password already exists");

      return ResponseEntity.status(HttpStatus.CONFLICT).body(map);
    }

    @ExceptionHandler(UnauthorizedUserException.class)
    public ResponseEntity<Map<String,String>> handleUnauthorizedUserException(UnauthorizedUserException ex){
        Map<String, String> error = new HashMap<>();
        error.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @ExceptionHandler(ImageUploadException.class)
    public ResponseEntity<Map<String,String>> handleImageUploadException(ImageUploadException ex){
        Map<String,String> error = new HashMap<>();
        error.put("message", ex.getMessage());

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    @ExceptionHandler(LocationNotFoundException.class)
    public ResponseEntity<Map<String,String>> handleLocationNotFoundException(LocationNotFoundException ex){
        Map<String,String> error = new HashMap<>();
        error.put("message", ex.getMessage());

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(GeocodingException.class)
    public ResponseEntity<Map<String,String>> handleGeocodingException(GeocodingException ex){
        Map<String,String> error = new HashMap<>();
        error.put("message", ex.getMessage());

        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(error);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String,String>> handleUserNotFoundException(UserNotFoundException ex){
        Map<String,String> error = new HashMap<>();
        error.put("message", ex.getMessage());

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(InvalidBookingException.class)
    public ResponseEntity<Map<String,String>> handleInvalidBookingException(InvalidBookingException ex){
        Map<String,String> error = new HashMap<>();

        error.put("message", ex.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
}
