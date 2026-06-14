// src/main/java/com/oficina_dev/backend/services/StatsService.java
package com.oficina_dev.backend.services;

import com.oficina_dev.backend.dtos.Stats.RecentActionDto;
import com.oficina_dev.backend.dtos.Stats.StatsDto;
import com.oficina_dev.backend.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final PersonRepository personRepo;
    private final DonationRepository donationRepo;
    private final ReceiverRepository receiverRepo;
    private final VoluntaryRepository voluntaryRepo;
    private final GiverRepository giverRepo;
    private final ItemRepository itemRepo;

    public StatsDto get() {
        long people        = personRepo.count();
        long donations     = donationRepo.count();
        long receivers     = receiverRepo.countByIsActiveTrue();
        long volunteers    = voluntaryRepo.countByIsActiveTrue();
        long givers        = giverRepo.countByIsActiveTrue();
        long itemsDistinct = itemRepo.count();

        Long units = itemRepo.sumQuantities(); // pode vir null
        long itemsUnits = (units != null) ? units : 0L;

        List<RecentActionDto> actions = List.of();

        return new StatsDto(
                people,
                donations,
                receivers,
                volunteers,
                givers,
                itemsDistinct,
                itemsUnits,
                actions
        );
    }
}
