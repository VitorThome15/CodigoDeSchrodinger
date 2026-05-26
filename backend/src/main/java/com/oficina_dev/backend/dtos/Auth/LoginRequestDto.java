package com.oficina_dev.backend.dtos.Auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequestDto(
        @Email(message = "Email deve ser válido")
        @NotBlank(message = "Email é obrigatório")
        String email,

        @NotBlank(message = "Senha é obrigatória")
        @Size(min = 4, max = 100, message = "Senha deve ter entre 4 e 100 caracteres")
        String password
) { }
