package com.oficina_dev.backend.repositories;

import com.oficina_dev.backend.models.Voluntary.Voluntary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VoluntaryRepository extends JpaRepository<Voluntary, UUID> {

    // O método que o AuthService e o PasswordRecoveryService estão procurando:
    Optional<Voluntary> findByPersonId(UUID personId);

    // O método do Soft Delete que nós implementamos:
    List<Voluntary> findByIsActiveTrue();
}