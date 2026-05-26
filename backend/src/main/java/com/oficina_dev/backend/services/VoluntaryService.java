package com.oficina_dev.backend.services;

import com.oficina_dev.backend.dtos.Voluntary.VoluntaryRequestDto;
import com.oficina_dev.backend.dtos.Voluntary.VoluntaryResponseDto;
import com.oficina_dev.backend.dtos.Voluntary.VoluntaryRemovedResponseDto;
import com.oficina_dev.backend.mappers.VoluntaryMapper;
import com.oficina_dev.backend.models.Voluntary.Voluntary;
import com.oficina_dev.backend.repositories.PersonRepository;
import com.oficina_dev.backend.repositories.VoluntaryRepository;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class VoluntaryService {

    private static final Logger logger = LoggerFactory.getLogger(VoluntaryService.class);
    private final String voluntaryNotFoundMessage = "Voluntary not found";

    @Autowired
    private VoluntaryRepository voluntaryRepository;

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private VoluntaryMapper voluntaryMapper;

    public Voluntary findById(UUID id) {
        logger.info("Searching for voluntary with ID: {}", id);
        return voluntaryRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Voluntary with ID {} not found", id);
                    return new EntityNotFoundException(voluntaryNotFoundMessage);
                });
    }

    public List<VoluntaryResponseDto> getAll() {
        logger.info("Fetching all voluntaries");
        List<Voluntary> voluntaries = voluntaryRepository.findAll();
        logger.info("Found {} voluntaries", voluntaries.size());
        return voluntaries.stream()
                .map(voluntaryMapper::toResponse)
                .toList();
    }

    public VoluntaryResponseDto getById(UUID id) {
        logger.debug("Service: Fetching voluntary by ID: {}", id);
        Voluntary voluntary = findById(id);
        logger.debug("Voluntary found with ID: {}", voluntary.getId());
        return this.voluntaryMapper.toResponse(voluntary);
    }

    public VoluntaryResponseDto create(VoluntaryRequestDto voluntaryRequestDto) {
        logger.debug("Service: Creating new voluntary");
        Voluntary voluntary = this.voluntaryMapper.toEntity(voluntaryRequestDto);
        try {
            Voluntary savedVoluntary = this.voluntaryRepository.saveAndFlush(voluntary);
            logger.info("Voluntary created successfully with ID: {}", savedVoluntary.getId());
            return this.voluntaryMapper.toResponse(savedVoluntary);
        } catch (Exception e) {
            logger.error("Error creating voluntary: {}", e.getMessage(), e);
            throw e;
        }
    }

    public VoluntaryResponseDto update(UUID id, VoluntaryRequestDto voluntaryRequestDto) {
        logger.debug("Service: Updating voluntary with ID: {}", id);
        Voluntary voluntary = this.findById(id);
        this.voluntaryMapper.update(voluntary, voluntaryRequestDto);
        try {
            Voluntary savedVoluntary = this.voluntaryRepository.saveAndFlush(voluntary);
            logger.info("Voluntary updated successfully with ID: {}", savedVoluntary.getId());
            return this.voluntaryMapper.toResponse(savedVoluntary);
        } catch (Exception e) {
            logger.error("Error updating voluntary with ID {}: {}", id, e.getMessage(), e);
            throw e;
        }
    }

    public VoluntaryResponseDto patch(UUID id, VoluntaryRequestDto voluntaryRequestDto) {
        logger.debug("Service: Patching voluntary with ID: {}", id);
        Voluntary voluntary = this.findById(id);
        this.voluntaryMapper.patch(voluntary, voluntaryRequestDto);
        try {
            Voluntary savedVoluntary = this.voluntaryRepository.saveAndFlush(voluntary);
            logger.info("Voluntary patched successfully with ID: {}", savedVoluntary.getId());
            return this.voluntaryMapper.toResponse(savedVoluntary);
        } catch (Exception e) {
            logger.error("Error patching voluntary with ID {}: {}", id, e.getMessage(), e);
            throw e;
        }
    }

    @Transactional
    public VoluntaryRemovedResponseDto delete(UUID id) {
        logger.info("Iniciando exclusão física e definitiva do voluntário: {}", id);
        
        // Busca o voluntário
        Voluntary voluntary = this.findById(id);

        // Prepara a resposta ANTES de apagar
        VoluntaryRemovedResponseDto response = this.voluntaryMapper.toRemovedResponse(voluntary);

        try {
            // Apaga o voluntário (person, donations e transfers são removidas automaticamente por cascata)
            this.voluntaryRepository.delete(voluntary);
            this.voluntaryRepository.flush();
            
            logger.info("Voluntário, Pessoa e dependências removidos DEFINITIVAMENTE com sucesso!");
        } catch (Exception e) {
            logger.error("Erro ao tentar excluir fisicamente o voluntário {}: {}", id, e.getMessage(), e);
            throw e;
        }
        
        return response;
    }
}
