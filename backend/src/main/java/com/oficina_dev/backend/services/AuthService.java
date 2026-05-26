package com.oficina_dev.backend.services;

import com.oficina_dev.backend.dtos.Auth.LoginRequestDto;
import com.oficina_dev.backend.dtos.Auth.LoginResponseDto;
import com.oficina_dev.backend.models.Person.Person;
import com.oficina_dev.backend.models.Voluntary.Voluntary;
import com.oficina_dev.backend.repositories.PersonRepository;
import com.oficina_dev.backend.repositories.VoluntaryRepository;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private VoluntaryRepository voluntaryRepository;

    public LoginResponseDto login(LoginRequestDto loginRequestDto) {
        logger.debug("Service: Authenticating user with email: {}", loginRequestDto.email());

        try {
            // Buscar pessoa por email
            Optional<Person> personOptional = personRepository.findByEmail(loginRequestDto.email());
            
            if (personOptional.isEmpty()) {
                logger.warn("Login attempt failed: Person not found with email: {}", loginRequestDto.email());
                throw new EntityNotFoundException("Email ou senha incorretos");
            }

            Person person = personOptional.get();
            logger.debug("Person found: {} (ID: {})", person.getName(), person.getId());

            // Buscar voluntário vinculado a esta pessoa
            Optional<Voluntary> voluntaryOptional = voluntaryRepository.findByPersonId(person.getId());

            if (voluntaryOptional.isEmpty()) {
                logger.warn("Login attempt failed: No voluntary found for person ID: {}", person.getId());
                throw new EntityNotFoundException("Email ou senha incorretos");
            }

            Voluntary voluntary = voluntaryOptional.get();

            // Validar senha
            if (!voluntary.getPassword().equals(loginRequestDto.password())) {
                logger.warn("Login attempt failed: Invalid password for person: {}", person.getName());
                throw new SecurityException("Email ou senha incorretos");
            }

            // Validar se voluntário está ativo
            if (!voluntary.getIsActive()) {
                logger.warn("Login attempt failed: Voluntary is inactive: {}", person.getName());
                throw new SecurityException("Usuário inativo");
            }

            logger.info("User authenticated successfully: {} (ID: {})", person.getName(), person.getId());

            return new LoginResponseDto(
                    person.getId(),
                    person.getName(),
                    person.getEmail(),
                    person.getPhone(),
                    "Login realizado com sucesso"
            );

        } catch (EntityNotFoundException | SecurityException e) {
            logger.error("Authentication failed: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Unexpected error during authentication: {}", e.getMessage(), e);
            throw new RuntimeException("Erro ao realizar login");
        }
    }
}
