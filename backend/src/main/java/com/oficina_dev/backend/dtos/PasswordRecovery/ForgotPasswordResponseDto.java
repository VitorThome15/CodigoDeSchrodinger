package com.oficina_dev.backend.dtos.PasswordRecovery;

public record ForgotPasswordResponseDto(
    String message,
    String email,
    String token
) {
    public ForgotPasswordResponseDto(String message, String email, String token) {
        this.message = message;
        this.email = email;
        this.token = token;
    }
}
