package com.oficina_dev.backend.controllers;

import com.oficina_dev.backend.dtos.Auth.LoginRequestDto;
import com.oficina_dev.backend.dtos.Auth.LoginResponseDto;
import com.oficina_dev.backend.services.AuthService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequestDto loginRequestDto) {
        logger.info("Login attempt for email: {}", loginRequestDto.email());
        try {
            LoginResponseDto response = this.authService.login(loginRequestDto);
            logger.info("Login successful for user: {}", response.name());
            return ResponseEntity.ok(response);
        } catch (EntityNotFoundException e) {
            logger.warn("Login failed - Entity not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponseDto("Email ou senha incorretos"));
        } catch (SecurityException e) {
            logger.warn("Login failed - Security exception: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponseDto("Email ou senha incorretos"));
        } catch (Exception e) {
            logger.error("Unexpected error during login: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponseDto("Erro ao realizar login: " + e.getMessage()));
        }
    }

    public record ErrorResponseDto(String message) {}
}
