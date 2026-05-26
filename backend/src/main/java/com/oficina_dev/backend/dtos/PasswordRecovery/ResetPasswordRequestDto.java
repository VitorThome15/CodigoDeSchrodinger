package com.oficina_dev.backend.dtos.PasswordRecovery;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequestDto(
    @NotBlank(message = "Token é obrigatório")
    String token,
    
    @NotBlank(message = "Nova senha é obrigatória")
    @Size(min = 4, max = 100, message = "Senha deve ter entre 4 e 100 caracteres")
    String newPassword
) {}
