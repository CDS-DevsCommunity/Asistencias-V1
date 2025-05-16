package com.cds.asistencia.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cds.asistencia.domain.entities.Registration;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long>{

}
