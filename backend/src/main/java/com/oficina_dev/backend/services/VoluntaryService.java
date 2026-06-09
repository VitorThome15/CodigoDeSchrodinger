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
        List<Voluntary> voluntaries = this.voluntaryRepository.findByIsActiveTrue();
            
        // Correção: Usando o mapper para converter de Voluntary para Dto
        return voluntaries.stream()
                .map(voluntary -> this.voluntaryMapper.toResponse(voluntary))
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
        logger.info("Iniciando desativação (Soft Delete) do voluntário: {}", id);
        
        // Busca o voluntário
        Voluntary voluntary = this.findById(id);

        // Prepara a resposta
        VoluntaryRemovedResponseDto response = this.voluntaryMapper.toRemovedResponse(voluntary);

        try {
            // MÁGICA AQUI: Em vez de apagar fisicamente, nós apenas desativamos!
            voluntary.setActive(false);
            this.voluntaryRepository.saveAndFlush(voluntary);
            
            logger.info("Voluntário desativado com sucesso (continua no banco para histórico)!");
        } catch (Exception e) {
            logger.error("Erro ao tentar desativar o voluntário {}: {}", id, e.getMessage(), e);
            throw e;
        }
        
        return response;
    }
}
