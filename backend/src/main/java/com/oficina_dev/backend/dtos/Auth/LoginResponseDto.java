package com.oficina_dev.backend.dtos.Auth;

import java.util.UUID;

public record LoginResponseDto(
        UUID id,
        String name,
        String email,
        String phone,
        String message
) { }
