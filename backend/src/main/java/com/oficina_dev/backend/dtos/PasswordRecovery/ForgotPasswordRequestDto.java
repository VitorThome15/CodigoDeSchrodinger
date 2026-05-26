package com.oficina_dev.backend.dtos.PasswordRecovery;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ForgotPasswordRequestDto(
    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ser válido")
    String email
) {}
