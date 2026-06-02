package com.oficina_dev.backend.controllers;

import com.oficina_dev.backend.models.Person.Person;
import com.oficina_dev.backend.models.Voluntary.Voluntary;
import com.oficina_dev.backend.repositories.PersonRepository;
import com.oficina_dev.backend.repositories.VoluntaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/debug")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class DebugController {

    private final VoluntaryRepository voluntaryRepository;
    private final PersonRepository personRepository;

    /**
     * Debug endpoint para listar todos os usuários
     * GET /api/debug/all-users
     */
    @GetMapping("/all-users")
    public ResponseEntity<?> allUsers() {
        try {
            List<Voluntary> voluntaries = voluntaryRepository.findAll();
            return ResponseEntity.ok(voluntaries.stream().map(v -> {
                Person p = v.getPerson();
                return new UserDebugDto(
                        v.getId().toString(),
                        p != null ? p.getId().toString() : "null",
                        p != null ? p.getName() : "null",
                        p != null ? p.getEmail() : "null",
                        v.getPassword(),
                        v.getIsActive()
                );
            }).toList());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro: " + e.getMessage());
        }
    }

    /**
     * Debug endpoint para verificar a senha armazenada de um voluntário
     * GET /api/debug/check-password?personId=uuid
     */
    @GetMapping("/check-password")
    public ResponseEntity<?> checkPassword(@RequestParam UUID personId) {
        try {
            Voluntary voluntary = voluntaryRepository.findByPersonId(personId)
                    .orElseThrow(() -> new RuntimeException("Voluntário não encontrado para personId: " + personId));

            Person person = voluntary.getPerson();
            return ResponseEntity.ok(new PasswordDebugDto(
                    voluntary.getId().toString(),
                    person != null ? person.getEmail() : "null",
                    voluntary.getPassword(),
                    voluntary.getIsActive()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro: " + e.getMessage());
        }
    }

    /**
     * Debug endpoint para buscar pessoa por email
     * GET /api/debug/find-by-email?email=teste@email.com
     */
    @GetMapping("/find-by-email")
    public ResponseEntity<?> findByEmail(@RequestParam String email) {
        try {
            Optional<Person> person = personRepository.findByEmail(email);
            
            if (person.isEmpty()) {
                return ResponseEntity.status(404).body("Email não encontrado: " + email);
            }

            Person p = person.get();
            Optional<Voluntary> voluntary = voluntaryRepository.findByPersonId(p.getId());

            return ResponseEntity.ok(new PersonDebugDto(
                    p.getId().toString(),
                    p.getName(),
                    p.getEmail(),
                    p.getPhone(),
                    voluntary.isPresent() ? voluntary.get().getPassword() : "null",
                    voluntary.isPresent() ? voluntary.get().getIsActive() : false
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro: " + e.getMessage());
        }
    }

    public record UserDebugDto(
            String voluntaryId,
            String personId,
            String name,
            String email,
            String password,
            Boolean isActive
    ) {}

    public record PasswordDebugDto(
            String voluntaryId,
            String email,
            String password,
            Boolean isActive
    ) {}

    public record PersonDebugDto(
            String personId,
            String name,
            String email,
            String phone,
            String password,
            Boolean isActive
    ) {}
}
