package com.oficina_dev.backend.controllers;

import com.oficina_dev.backend.dtos.HelpMessage.HelpMessageDto;
import com.oficina_dev.backend.models.HelpMessage.HelpMessage;
import com.oficina_dev.backend.services.HelpMessageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/help")
public class HelpMessageController {

    private final HelpMessageService service;

    public HelpMessageController(HelpMessageService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<HelpMessage> createMessage(@RequestBody HelpMessageDto dto) {
        HelpMessage saved = service.save(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/user/{email}")
    public ResponseEntity<List<HelpMessage>> getUserMessages(@PathVariable String email) {
        List<HelpMessage> messages = service.getMessagesByEmail(email);
        return ResponseEntity.ok(messages);
    }

    @GetMapping
    public ResponseEntity<List<HelpMessage>> getAllMessages() {
        List<HelpMessage> messages = service.getAllMessages();
        return ResponseEntity.ok(messages);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HelpMessage> updateMessage(
            @PathVariable UUID id, 
            @RequestBody Map<String, String> body) {
        
        HelpMessage updated = service.updateMessage(id, body.get("message"));
        return ResponseEntity.ok(updated);
    }
}