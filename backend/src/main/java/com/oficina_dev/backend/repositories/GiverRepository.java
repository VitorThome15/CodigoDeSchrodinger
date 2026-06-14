package com.oficina_dev.backend.repositories;

import com.oficina_dev.backend.models.Giver.Giver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GiverRepository extends JpaRepository<Giver, UUID> {
    boolean existsByPersonId(UUID personId);
    
    List<Giver> findByIsActiveTrue();

    long countByIsActiveTrue();
}