package com.oficina_dev.backend.services;

import com.oficina_dev.backend.dtos.Giver.GiverRequestDto;
import com.oficina_dev.backend.dtos.Giver.GiverResponseDto;
import com.oficina_dev.backend.mappers.GiverMapper;
import com.oficina_dev.backend.models.Giver.Giver;
import com.oficina_dev.backend.models.Person.Person;
import com.oficina_dev.backend.repositories.GiverRepository;
import com.oficina_dev.backend.repositories.PersonRepository;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class GiverService {

    private static final Logger logger = LoggerFactory.getLogger(GiverService.class);
    private final String giverNotFoundMessage = "Giver not found";

    @Autowired
    private GiverRepository giverRepository;

    @Autowired
    private PersonRepository personRepository; 

    @Autowired
    private GiverMapper giverMapper;

    public Giver findById(UUID id) {
        logger.debug("Finding giver by ID in database: {}", id);
        return this.giverRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Giver with ID {} not found", id);
                    return new EntityNotFoundException(giverNotFoundMessage);
                });
    }

    public GiverResponseDto getById(UUID id) {
        logger.debug("Service: Fetching giver by ID: {}", id);
        Giver giver = findById(id);
        logger.debug("Giver found with ID: {}", giver.getId());
        return this.giverMapper.toResponse(giver);
    }

    public List<GiverResponseDto> getAll() {
        logger.debug("Service: Fetching all givers");
        List<Giver> givers = this.giverRepository.findAll();
        logger.debug("Found {} givers in database", givers.size());
        return givers.stream()
                .map(this.giverMapper::toResponse)
                .toList();
    }

    @Transactional
    public GiverResponseDto create(GiverRequestDto giverRequestDto) {
        logger.debug("Service: Creating new giver");
        Giver giver = this.giverMapper.toEntity(giverRequestDto);
        Giver savedGiver = this.giverRepository.save(giver);
        return this.giverMapper.toResponse(savedGiver);
    }

    @Transactional
    public void delete(UUID id) {
        logger.info("Iniciando exclusão do doador fictício: {}", id);
        
        Giver giver = this.giverRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Doador não encontrado"));

        UUID personId = giver.getPerson().getId();

        // 1. O Pulo do Gato: Cortamos a ligação na memória para o Hibernate não surtar
        giver.setPerson(null);

        // 2. Agora podemos apagar o doador em paz
        this.giverRepository.deleteById(id);

        // 3. E por fim, apagamos a pessoa (o que vai apagar o endereço junto)
        this.personRepository.deleteById(personId);
        
        logger.info("Doador e Pessoa excluídos com sucesso sem conflitos!");
    }
}