package com.oficina_dev.backend.repositories;

import com.oficina_dev.backend.models.Person.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PersonRepository extends JpaRepository<Person, UUID> {

    boolean existsByCpf(String cpf);

    @Query("SELECT p FROM Person p WHERE p.email.email = :email")
    Optional<Person> findByEmail(@Param("email") String email);

}

