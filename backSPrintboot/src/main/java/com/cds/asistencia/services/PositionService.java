package com.cds.asistencia.services;

import java.util.List;

import com.cds.asistencia.domain.entities.Position;

public interface PositionService {

    List<Position> listPosition();
    Position createdPosition(Position position);
    Position updatedPosition(Long id, Position position);
    void deletePosition(Long id);
}
