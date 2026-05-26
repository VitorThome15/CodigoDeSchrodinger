package com.oficina_dev.backend.repositories;

import com.oficina_dev.backend.models.PasswordResetToken.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, UUID> {
    Optional<PasswordResetToken> findByToken(String token);
    Optional<PasswordResetToken> findByPersonIdAndUsedFalse(UUID personId);
    void deleteByPersonId(UUID personId);
}
