package com.oficina_dev.backend.services;

import com.oficina_dev.backend.dtos.Receiver.ReceiverRequestDto;
import com.oficina_dev.backend.dtos.Receiver.ReceiverRequestPatchDto;
import com.oficina_dev.backend.dtos.Receiver.ReceiverResponseDto;
import com.oficina_dev.backend.exceptions.EntityAlreadyExists;
import com.oficina_dev.backend.mappers.ReceiverMapper;
import com.oficina_dev.backend.models.Receiver.Receiver;
import com.oficina_dev.backend.repositories.ReceiverRepository;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ReceiverService {

    private static final Logger logger = LoggerFactory.getLogger(ReceiverService.class);
    private final String receiverNotFoundMessage = "Receiver not found";

    @Autowired
    private ReceiverRepository receiverRepository;

    @Autowired
    private ReceiverMapper receiverMapper;

    @Autowired
    private PersonService personService;


    public Receiver findById(UUID id) {
        logger.debug("Finding receiver by ID in database: {}", id);
        return receiverRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Receiver with ID {} not found", id);
                    return new EntityNotFoundException(receiverNotFoundMessage);
                });
    }

    public boolean existsByNifAndIdNot(String nif, UUID id) {
        if (this.receiverRepository.existsByNifAndIdNot(nif, id)){
            logger.error("Another receiver with NIF {} already exists", nif);
            return true;
        }
        return false;
    }

    public ReceiverResponseDto getById(UUID id) {
        logger.debug("Service: Fetching receiver by ID: {}", id);
        Receiver receiver = this.findById(id);
        logger.debug("Receiver found with ID: {}", receiver.getId());
        return this.receiverMapper.toResponse(receiver);
    }

    public List<ReceiverResponseDto> getAll() {
        logger.debug("Service: Fetching all active receivers");
        // Modificado para trazer apenas os ativos
        List<Receiver> receivers = this.receiverRepository.findByIsActiveTrue();
        logger.debug("Found {} active receivers in database", receivers.size());
        return receivers.stream()
                .map(this.receiverMapper::toResponse)
                .toList();
    }

    @Transactional
    public ReceiverResponseDto create(ReceiverRequestDto receiverRequestDto) {
        logger.debug("Service: Creating new receiver with NIF: {}", receiverRequestDto.getNif());

        if (this.receiverRepository.existsByNif(receiverRequestDto.getNif())) {
            logger.error("Receiver with NIF {} already exists", receiverRequestDto.getNif());
            throw new EntityAlreadyExists("Receiver with this NIF already exists");
        }

        Receiver receiver = this.receiverMapper.toEntity(
                receiverRequestDto, this.personService.findById(receiverRequestDto.getPersonId())
        );
        // Garante que o recebedor nasce ativo
        receiver.setIsActive(true);
        
        Receiver savedReceiver = this.receiverRepository.saveAndFlush(receiver);
        logger.debug("Receiver created with ID: {}", savedReceiver.getId());
        return this.receiverMapper.toResponse(savedReceiver);
    }

    @Transactional
    public ReceiverResponseDto update(UUID id, ReceiverRequestDto receiverRequestDto) {
        logger.debug("Service: Updating receiver with ID: {}", id);
        Receiver receiver = findById(id);

        if (this.existsByNifAndIdNot(receiverRequestDto.getNif(), id)) {
            throw new EntityAlreadyExists("Another receiver with this NIF already exists");
        }
        this.receiverMapper.update(receiver, receiverRequestDto,
                this.personService.findById(receiverRequestDto.getPersonId())
        );
        Receiver updatedReceiver = this.receiverRepository.saveAndFlush(receiver);
        logger.debug("Receiver updated successfully");
        return this.receiverMapper.toResponse(updatedReceiver);
    }

    @Transactional
    public ReceiverResponseDto patch(UUID id, ReceiverRequestPatchDto receiverRequestPatchDto) {
        logger.debug("Service: Partially updating receiver with ID: {}", id);
        Receiver receiver = findById(id);

        if (receiverRequestPatchDto.getNif() != null && this.existsByNifAndIdNot(receiverRequestPatchDto.getNif(),id))  {
                throw new EntityAlreadyExists("Another receiver with this NIF already exists");
        }

        this.receiverMapper.patch(receiver, receiverRequestPatchDto,
                this.personService.findById(receiverRequestPatchDto.getPersonId())
        );
        logger.debug("Receiver with ID {} found and will be partially updated", id);
        Receiver updatedReceiver = this.receiverRepository.saveAndFlush(receiver);
        logger.debug("Receiver partially updated successfully");
        return this.receiverMapper.toResponse(updatedReceiver);
    }

    // AQUI: Criado o método de deleção lógica que não existia!
    @Transactional
    public void delete(UUID id) {
        logger.info("Aplicando Soft Delete no receiver ID: {}", id);
        Receiver receiver = this.findById(id);
        try {
            receiver.setIsActive(false); 
            this.receiverRepository.save(receiver);
            logger.info("Receiver desativado com sucesso!");
        } catch (Exception e) {
            logger.error("Erro ao tentar desativar o receiver {}: {}", id, e.getMessage(), e);
            throw new RuntimeException("Erro ao desativar o receiver.");
        }
    }
}