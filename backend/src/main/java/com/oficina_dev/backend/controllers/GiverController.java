package com.oficina_dev.backend.controllers;

import com.oficina_dev.backend.dtos.Giver.GiverRequestDto;
import com.oficina_dev.backend.dtos.Giver.GiverResponseDto;
import com.oficina_dev.backend.services.GiverService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.DeleteMapping;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/givers")
public class GiverController {

    private static final Logger logger = LoggerFactory.getLogger(GiverController.class);

    @Autowired
    private GiverService giverService;

    @GetMapping
    public ResponseEntity<List<GiverResponseDto>> getAll() {
        logger.info("Fetching all givers");
        List<GiverResponseDto> giverList = this.giverService.getAll();
        logger.info("Returning {} givers", giverList.size());
        return ResponseEntity.ok(giverList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GiverResponseDto> getById(@PathVariable UUID id){
        logger.info("Fetching giver by ID: {}", id);
        GiverResponseDto giverResponseDto = this.giverService.getById(id);
        logger.info("Giver found with ID: {}", giverResponseDto.id());
        return ResponseEntity.ok(giverResponseDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        this.giverService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<GiverResponseDto> create(@RequestBody @Valid GiverRequestDto giverRequestDto) {
        logger.info("Creating new giver with person ID: {}", giverRequestDto.getPersonId());
        GiverResponseDto giverResponseDto = this.giverService.create(giverRequestDto);
        logger.info("Giver created successfully. ID: {}", giverResponseDto.id());
        return ResponseEntity.ok(giverResponseDto);
    }

}
