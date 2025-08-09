package com.cds.asistencia.services.Impl;


import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.cds.asistencia.domain.entities.Position;
import com.cds.asistencia.repositories.PositionRepository;
import com.cds.asistencia.services.PositionService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PositionServiceImpl implements PositionService{


    private final PositionRepository positionRepository;

    @Override
    public List<Position> listPosition() {
        return positionRepository.findAll();
    }

    
    @Override
    public Position createdPosition(Position position) {

        if (position.getName() == null || position.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre no puede estar vacío");
        }

        String name = position.getName();
        if (positionRepository.existsByNameIgnoreCase(name)) {
            throw new IllegalArgumentException("Ya existe un cargo con el nombre: " + name);
        }
        
        return positionRepository.save(position);
    }

    
    @Override
    public Position updatedPosition(Long id, Position position) {

        if(null == position.getId()){
            throw new IllegalArgumentException("Task list must be an ID");
        }

        if (Objects.equals(position.getId(), id)) {
            throw new IllegalArgumentException("Attempting to change Task List Id, this is not permitted!");
        }

        Position existingPosition = positionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task List not found!"));

        existingPosition.setName(position.getName());
        existingPosition.setDescription(position.getDescription());
        existingPosition.setName(position.getName());

        return positionRepository.save(position);

    }

    @Override
    public void deletePosition(Long id) {
        Optional<Position> position = positionRepository.findById(id);
        if (position.isPresent()) {
            positionRepository.deleteById(id);
        } 
    }

}
