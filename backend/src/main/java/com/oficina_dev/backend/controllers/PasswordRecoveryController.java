package com.oficina_dev.backend.controllers;

import com.oficina_dev.backend.dtos.PasswordRecovery.ForgotPasswordRequestDto;
import com.oficina_dev.backend.dtos.PasswordRecovery.ForgotPasswordResponseDto;
import com.oficina_dev.backend.dtos.PasswordRecovery.ResetPasswordRequestDto;
import com.oficina_dev.backend.dtos.PasswordRecovery.ResetPasswordResponseDto;
import com.oficina_dev.backend.services.PasswordRecoveryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth/password-recovery")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class PasswordRecoveryController {

    private final PasswordRecoveryService passwordRecoveryService;

    /**
     * Solicita a recuperação de senha enviando um token para o email fornecido
     * POST /api/auth/password-recovery/forgot-password
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<ForgotPasswordResponseDto> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequestDto request) {
        log.info("Recebido pedido de recuperação de senha para: {}", request.email());
        
        try {
            ForgotPasswordResponseDto response = passwordRecoveryService.requestPasswordReset(request);
            log.info("Token gerado com sucesso para: {}", request.email());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Erro ao processar recuperação de senha: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ForgotPasswordResponseDto(
                            "Erro: " + e.getMessage(),
                            request.email(),
                            null
                    ));
        }
    }

    /**
     * Redefine a senha usando um token válido
     * POST /api/auth/password-recovery/reset-password
     */
    @PostMapping("/reset-password")
    public ResponseEntity<ResetPasswordResponseDto> resetPassword(
            @Valid @RequestBody ResetPasswordRequestDto request) {
        log.info("Recebido pedido de reset de senha com token");
        
        try {
            ResetPasswordResponseDto response = passwordRecoveryService.resetPassword(request);
            log.info("Senha redefinida com sucesso");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.warn("Erro ao redefinir senha: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResetPasswordResponseDto(
                            "Erro: " + e.getMessage(),
                            null
                    ));
        } catch (Exception e) {
            log.error("Erro inesperado ao redefinir senha: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResetPasswordResponseDto(
                            "Erro ao redefinir senha",
                            null
                    ));
        }
    }

    /**
     * Valida se um token é válido
     * GET /api/auth/password-recovery/validate-token?token=xxx
     */
    @GetMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestParam String token) {
        log.info("Validando token");
        
        boolean isValid = passwordRecoveryService.isTokenValid(token);
        
        return ResponseEntity.ok(new TokenValidationResponseDto(
                isValid,
                isValid ? "Token válido" : "Token inválido ou expirado"
        ));
    }

    // DTO interno para resposta de validação
    public record TokenValidationResponseDto(
            boolean valid,
            String message
    ) {}
}
