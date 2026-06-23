package com.oficina_dev.backend.services;

import com.oficina_dev.backend.dtos.HelpMessage.HelpMessageDto;
import com.oficina_dev.backend.models.HelpMessage.HelpMessage;
import com.oficina_dev.backend.repositories.HelpMessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class HelpMessageService {

    private final HelpMessageRepository repository;

    public HelpMessageService(HelpMessageRepository repository) {
        this.repository = repository;
    }

    public HelpMessage save(HelpMessageDto dto) {
        HelpMessage entity = new HelpMessage();
        entity.setName(dto.name());
        entity.setEmail(dto.email());
        entity.setMessage(dto.message());
        
        return repository.save(entity);
    }

    public List<HelpMessage> getMessagesByEmail(String email) {
        return repository.findByEmail(email);
    }

    public List<HelpMessage> getAllMessages() {
        return repository.findAll();
    }

    public HelpMessage updateMessage(UUID id, String newMessage) {
        HelpMessage existingMessage = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mensagem não encontrada"));

        existingMessage.setMessage(newMessage);

        return repository.save(existingMessage);
    }
}