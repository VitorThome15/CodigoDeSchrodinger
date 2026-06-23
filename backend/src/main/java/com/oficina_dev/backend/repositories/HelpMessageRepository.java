package com.oficina_dev.backend.repositories;

import com.oficina_dev.backend.models.HelpMessage.HelpMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface HelpMessageRepository extends JpaRepository<HelpMessage, UUID> {
    
    // É esta linha aqui que o Java estava sentindo falta!
    List<HelpMessage> findByEmail(String email);
}