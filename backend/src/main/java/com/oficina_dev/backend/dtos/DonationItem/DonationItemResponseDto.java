package com.oficina_dev.backend.dtos.DonationItem;


import java.util.UUID;

public record DonationItemResponseDto(
        UUID donationId,
        UUID itemId,
        Integer quantity
) { }
