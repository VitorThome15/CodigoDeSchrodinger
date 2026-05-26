package com.oficina_dev.backend.controllers;

import com.oficina_dev.backend.models.Address.Address;
import com.oficina_dev.backend.models.Person.Person;
import com.oficina_dev.backend.models.Voluntary.Voluntary;
import com.oficina_dev.backend.repositories.AddressRepository;
import com.oficina_dev.backend.repositories.PersonRepository;
import com.oficina_dev.backend.repositories.VoluntaryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/test")
public class TestController {

    private static final Logger logger = LoggerFactory.getLogger(TestController.class);

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private VoluntaryRepository voluntaryRepository;

    @RequestMapping(method = {RequestMethod.GET, RequestMethod.POST}, value = "/create-test-user")
    public ResponseEntity<?> createTestUser() {
        logger.info("Creating test user...");

        try {
            // Criar endereço (deixar banco gerar ID)
            Address address = new Address();
            address.setStreet("Rua de Teste");
            address.setNumber(123);
            address.setNeighborhood("Bairro Teste");
            address.setComplement("Apto 1");
            address.setReferencePoint("Próximo à escola");
            Address savedAddress = addressRepository.save(address);
            logger.info("Address created successfully with ID: {}", savedAddress.getId());

            // Criar pessoa
            Person person = new Person(
                    "Vitor Thomé",
                    "41999999999",
                    "12345678901",
                    "vitorthome@alunos.utfpr.edu.br",
                    savedAddress
            );
            Person savedPerson = personRepository.save(person);
            logger.info("Person created successfully with ID: {}", savedPerson.getId());

            // Criar voluntário
            Voluntary voluntary = new Voluntary(savedPerson, "1234", true);
            Voluntary savedVoluntary = voluntaryRepository.save(voluntary);
            logger.info("Voluntary created successfully with ID: {}", savedVoluntary.getId());

            // Retornar resposta de sucesso
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Usuário de teste criado com sucesso!");
            response.put("email", "vitorthome@alunos.utfpr.edu.br");
            response.put("password", "1234");
            response.put("personId", savedPerson.getId());
            response.put("userId", savedVoluntary.getId());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error creating test user: {}", e.getMessage(), e);
            
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Erro ao criar usuário de teste");
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}
