package com.oficina_dev.backend.services;

import com.oficina_dev.backend.dtos.PasswordRecovery.ForgotPasswordRequestDto;
import com.oficina_dev.backend.dtos.PasswordRecovery.ForgotPasswordResponseDto;
import com.oficina_dev.backend.dtos.PasswordRecovery.ResetPasswordRequestDto;
import com.oficina_dev.backend.dtos.PasswordRecovery.ResetPasswordResponseDto;
import com.oficina_dev.backend.models.PasswordResetToken.PasswordResetToken;
import com.oficina_dev.backend.models.Person.Person;
import com.oficina_dev.backend.models.Voluntary.Voluntary;
import com.oficina_dev.backend.repositories.PasswordResetTokenRepository;
import com.oficina_dev.backend.repositories.PersonRepository;
import com.oficina_dev.backend.repositories.VoluntaryRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PasswordRecoveryService {

    private final PersonRepository personRepository;
    private final VoluntaryRepository voluntaryRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    /**
     * Solicita a recuperação de senha gerando um token único
     */
    @Transactional
    public ForgotPasswordResponseDto requestPasswordReset(ForgotPasswordRequestDto request) {
        log.info("Iniciando processo de recuperação de senha para email: {}", request.email());

        // Buscar pessoa pelo email
        Person person = personRepository.findByEmail(request.email())
                .orElseThrow(() -> {
                    log.warn("Email não encontrado: {}", request.email());
                    return new EntityNotFoundException("Email não encontrado no sistema");
                });

        log.info("Pessoa encontrada: {} ({})", person.getName(), person.getId());

        // Verificar se pessoa tem registro de voluntário ativo
        Voluntary voluntary = voluntaryRepository.findByPersonId(person.getId())
                .orElseThrow(() -> {
                    log.warn("Voluntário não encontrado para pessoa: {}", person.getId());
                    return new EntityNotFoundException("Voluntário não encontrado");
                });

        if (!voluntary.getIsActive()) {
            log.warn("Voluntário inativo: {}", voluntary.getId());
            throw new IllegalArgumentException("Voluntário inativo");
        }

        // Deletar tokens anteriores não utilizados
        passwordResetTokenRepository.deleteByPersonId(person.getId());
        log.info("Tokens anteriores removidos para pessoa: {}", person.getId());

        // Gerar novo token (UUID)
        String token = UUID.randomUUID().toString();
        LocalDateTime expiryDate = LocalDateTime.now().plusHours(1); // Token válido por 1 hora

        // Salvar token no banco de dados
        PasswordResetToken resetToken = new PasswordResetToken(person.getId(), token, expiryDate);
        passwordResetTokenRepository.save(resetToken);

        log.info("Token de recuperação gerado para email: {} (expira em: {})", request.email(), expiryDate);

        return new ForgotPasswordResponseDto(
                "Token de recuperação enviado. Verifique seu email para continuar.",
                request.email(),
                token
        );
    }

    /**
     * Redefine a senha usando um token válido
     */
    @Transactional
    public ResetPasswordResponseDto resetPassword(ResetPasswordRequestDto request) {
        log.info("Iniciando reset de senha com token fornecido");

        // Buscar token no banco de dados
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.token())
                .orElseThrow(() -> {
                    log.warn("Token inválido ou não encontrado");
                    return new EntityNotFoundException("Token inválido ou expirado");
                });

        // Validar se token já foi utilizado
        if (resetToken.getUsed()) {
            log.warn("Tentativa de usar token já utilizado: {}", request.token());
            throw new IllegalArgumentException("Token já foi utilizado");
        }

        // Validar se token expirou
        if (resetToken.isExpired()) {
            log.warn("Token expirado: {}", request.token());
            throw new IllegalArgumentException("Token expirado");
        }

        log.info("Token válido para pessoa: {}", resetToken.getPersonId());

        // Buscar voluntário associado
        Voluntary voluntary = voluntaryRepository.findByPersonId(resetToken.getPersonId())
                .orElseThrow(() -> {
                    log.warn("Voluntário não encontrado para reset: {}", resetToken.getPersonId());
                    return new EntityNotFoundException("Voluntário não encontrado");
                });

        // Buscar pessoa para pegar o email
        Person person = voluntary.getPerson();
        if (person == null) {
            log.error("Pessoa não encontrada para voluntário: {}", voluntary.getId());
            throw new EntityNotFoundException("Pessoa não encontrada");
        }

        // Atualizar senha
        voluntary.setPassword(request.newPassword());
        voluntaryRepository.save(voluntary);

        log.info("Senha redefinida para voluntário: {}", voluntary.getId());

        // Marcar token como utilizado
        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        log.info("Token marcado como utilizado para pessoa: {}", person.getId());

        return new ResetPasswordResponseDto(
                "Senha redefinida com sucesso!",
                person.getEmail()
        );
    }

    /**
     * Valida se um token é válido (existe, não expirou e não foi utilizado)
     */
    public boolean isTokenValid(String token) {
        log.info("Validando token");

        return passwordResetTokenRepository.findByToken(token)
                .map(resetToken -> !resetToken.getUsed() && !resetToken.isExpired())
                .orElse(false);
    }
}
