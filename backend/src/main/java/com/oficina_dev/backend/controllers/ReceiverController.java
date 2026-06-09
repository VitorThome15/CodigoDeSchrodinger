package com.oficina_dev.backend.controllers;

import com.oficina_dev.backend.dtos.Receiver.*;
import com.oficina_dev.backend.services.ReceiverService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/receivers")
public class ReceiverController {

    private static final Logger logger = LoggerFactory.getLogger(ReceiverController.class);

    @Autowired
    private ReceiverService receiverService;

    @GetMapping
    public ResponseEntity<List<ReceiverResponseDto>> getAll() {
        logger.info("Fetching all receivers");
        List<ReceiverResponseDto> receiverList = this.receiverService.getAll();
        logger.info("Returning {} receivers", receiverList.size());
        return ResponseEntity.ok(receiverList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReceiverResponseDto> getById(@PathVariable UUID id) {
        logger.info("Fetching receiver by ID: {}", id);
        ReceiverResponseDto receiverResponseDto = this.receiverService.getById(id);
        logger.info("Receiver found: ID={}", receiverResponseDto.id());
        return ResponseEntity.ok(receiverResponseDto);
    }

    @PostMapping
    public ResponseEntity<ReceiverResponseDto> create(@RequestBody @Valid ReceiverRequestDto receiverRequestDto) {
        logger.info("Creating new receiver with Person ID: {}", receiverRequestDto.getPersonId());
        ReceiverResponseDto receiverResponseDto = this.receiverService.create(receiverRequestDto);
        logger.info("Receiver created successfully. ID: {}", receiverResponseDto.id());
        return ResponseEntity.ok(receiverResponseDto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReceiverResponseDto> update(
            @PathVariable UUID id,
            @RequestBody @Valid ReceiverRequestDto receiverRequestDto
    ) {
        logger.info("Updating receiver with ID: {}", id);
        ReceiverResponseDto receiverResponseDto = this.receiverService.update(id, receiverRequestDto);
        logger.info("Receiver updated successfully");
        return ResponseEntity.ok(receiverResponseDto);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ReceiverResponseDto> partialUpdate(
            @PathVariable UUID id,
            @RequestBody @Valid ReceiverRequestPatchDto receiverRequestPatchDto
    ) {
        logger.info("Partially updating receiver with ID: {}", id);
        ReceiverResponseDto receiverResponseDto = this.receiverService.patch(id, receiverRequestPatchDto);
        logger.info("Receiver partially updated successfully");
        return ResponseEntity.ok(receiverResponseDto);
    }

    // Rota para o Soft Delete do Beneficiário
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        this.receiverService.delete(id);
        return ResponseEntity.noContent().build(); // Retorna status 204 (Sucesso sem conteúdo)
    }
}
