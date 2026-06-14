package com.oficina_dev.backend.repositories;

import com.oficina_dev.backend.models.Receiver.Receiver;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReceiverRepository extends JpaRepository<Receiver, UUID> {

    boolean existsByNif(String nif);

    boolean existsByNifAndIdNot(String nif, UUID id);

    // Mágica do Soft Delete
    List<Receiver> findByIsActiveTrue();

    long countByIsActiveTrue();
}