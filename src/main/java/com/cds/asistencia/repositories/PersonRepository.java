package com.cds.asistencia.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.cds.asistencia.domain.entities.Person;

@Repository
public interface PersonRepository extends JpaRepository<Person, Long>{

    Optional<Person> findByEmail(String email);
    
    List<Person> findByNameContainingIgnoreCase(String name);
    Boolean existsByNameIgnoreCase(String name);
    
    @Query("SELECT p FROM Person p WHERE p.user IS NULL")
    List<Person> findPersonsWithoutUser();
    
    List<Person> findByPhoneNumber(String phoneNumber);
    
    boolean existsByEmail(String email);

    
}
