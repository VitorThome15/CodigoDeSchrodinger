package com.oficina_dev.backend.dtos.PasswordRecovery;

public record ResetPasswordResponseDto(
    String message,
    String email
) {
    public ResetPasswordResponseDto(String message, String email) {
        this.message = message;
        this.email = email;
    }
}
