package com.cds.asistencia.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cds.asistencia.domain.entities.User;
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Buscar por email (campo único)
    Optional<User> findByEmail(String email);
    
    // Verificar existencia por email
    boolean existsByEmail(String email);

    // Optional<User> findByUsername(String userName);
    
    // Buscar usuarios activos
    List<User> findByActivoTrue();
    
    // Buscar usuarios inactivos
    List<User> findByActivoFalse();
    
    // Buscar por ID de persona asociada
    Optional<User> findByPersonId(Long personId);
    
    // Buscar usuarios por posición
    List<User> findByPositionId(Long positionId);
    
}
