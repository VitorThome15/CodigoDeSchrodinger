package com.oficina_dev.backend.mappers;

import com.oficina_dev.backend.dtos.ReceiverLimit.ReceiverLimitResponseDto;
import com.oficina_dev.backend.models.ReceiverLimit.ReceiverLimit;
import org.springframework.stereotype.Component;


@Component
public class ReceiverLimitMapper {
    ReceiverLimitResponseDto toResponse(ReceiverLimit receiverLimit) {
        if (receiverLimit == null) {
            return null;
        }
        return new ReceiverLimitResponseDto(
                receiverLimit.getReceiver().getId(),
                receiverLimit.getLimit().getId(),
                receiverLimit.getCaughtItems()
        );
    }

}