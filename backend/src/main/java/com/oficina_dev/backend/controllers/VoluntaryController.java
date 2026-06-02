package com.oficina_dev.backend.controllers;

import com.oficina_dev.backend.dtos.Voluntary.VoluntaryRequestDto;
import com.oficina_dev.backend.dtos.Voluntary.VoluntaryResponseDto;
import com.oficina_dev.backend.dtos.Voluntary.VoluntaryRemovedResponseDto;
import com.oficina_dev.backend.services.VoluntaryService;
import jakarta.validation.Valid;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;

@RestController
@RequestMapping("/api/voluntaries")
public class VoluntaryController {
    private static final Logger logger = LoggerFactory.getLogger(VoluntaryController.class);

    @Autowired
    private VoluntaryService voluntaryService;

    @GetMapping
    public ResponseEntity<List<VoluntaryResponseDto>> getAll() {
        logger.info("Fetching all voluntaries");
        List<VoluntaryResponseDto> voluntaryResponseDto = this.voluntaryService.getAll();
        logger.info("Returning {} voluntaries", voluntaryResponseDto.size());
        return ResponseEntity.ok(voluntaryResponseDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VoluntaryResponseDto> getById(@PathVariable UUID id) {
        logger.info("Fetching voluntary by ID: {}", id);
        VoluntaryResponseDto voluntaryResponseDto = this.voluntaryService.getById(id);
        logger.info("Voluntary found with ID: {}", voluntaryResponseDto.id());
        return ResponseEntity.ok(voluntaryResponseDto);
    }

    @PostMapping
    public ResponseEntity<VoluntaryResponseDto> create(@RequestBody @Valid VoluntaryRequestDto voluntaryRequestDto) {
        logger.info("Creating new voluntary");
        VoluntaryResponseDto voluntaryResponseDto = this.voluntaryService.create(voluntaryRequestDto);
        logger.info("Voluntary created successfully with ID: {}", voluntaryResponseDto.id());
        return ResponseEntity.ok(voluntaryResponseDto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VoluntaryResponseDto> update(@PathVariable UUID id, @RequestBody @Valid VoluntaryRequestDto voluntaryRequestDto) {
        logger.info("Updating voluntary with ID: {}", id);
        VoluntaryResponseDto voluntaryResponseDto = this.voluntaryService.update(id, voluntaryRequestDto);
        logger.info("Voluntary updated successfully with ID: {}", voluntaryResponseDto.id());
        return ResponseEntity.ok(voluntaryResponseDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<VoluntaryRemovedResponseDto> delete(@PathVariable UUID id) {
        logger.info("Removing voluntary with ID: {}", id);
        VoluntaryRemovedResponseDto voluntaryRemovedResponseDto = this.voluntaryService.delete(id);
        logger.info("Voluntary removed successfully with ID: {}", voluntaryRemovedResponseDto.id());
        return ResponseEntity.ok(voluntaryRemovedResponseDto);
    }
}
