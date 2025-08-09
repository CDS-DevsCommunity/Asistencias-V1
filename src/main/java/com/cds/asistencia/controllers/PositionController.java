package com.cds.asistencia.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cds.asistencia.domain.dto.Request.PositionRequestDto;
import com.cds.asistencia.domain.dto.Response.PositionResponseDto;
import com.cds.asistencia.domain.entities.Position;
import com.cds.asistencia.mappers.PositionMapper;
import com.cds.asistencia.services.PositionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = "/cds/positions")
@RequiredArgsConstructor
public class PositionController {

    private final PositionService positionService;
    
    private final PositionMapper positionMapper;

    @GetMapping
    public ResponseEntity<List<PositionResponseDto>> ListPositions() {
        List<PositionResponseDto> positionDtos = positionService.listPosition()
                                        .stream()
                                        .map(positionMapper::toDto)
                                        .toList();
        return ResponseEntity.ok(positionDtos);
    }

    @PostMapping("/post")
    public ResponseEntity<PositionResponseDto> createPosition(
                @RequestBody PositionRequestDto positionDto
    ) {
        System.out.println(positionDto);
        Position positionToCreate =  positionMapper.toEntity(positionDto);
        Position savedPosition = positionService.createdPosition(positionToCreate);

        return new ResponseEntity<>(
            positionMapper.toDto(savedPosition),
            HttpStatus.CREATED
        );
    }

    @DeleteMapping(path = "/{id}")
    public ResponseEntity<Void> deletePosition(@PathVariable Long id) {
        positionService.deletePosition(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}

