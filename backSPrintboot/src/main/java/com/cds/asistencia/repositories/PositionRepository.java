package com.cds.asistencia.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cds.asistencia.domain.entities.Position;

@Repository
public interface PositionRepository extends JpaRepository<Position, Long> {

    boolean existsByNameIgnoreCase(String name);

}
