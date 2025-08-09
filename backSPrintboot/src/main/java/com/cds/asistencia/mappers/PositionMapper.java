package com.cds.asistencia.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.cds.asistencia.domain.dto.Request.PositionRequestDto;
import com.cds.asistencia.domain.dto.Response.PositionResponseDto;
import com.cds.asistencia.domain.entities.Position;

@Mapper(componentModel = "spring")
public interface PositionMapper {

    PositionResponseDto toDto(Position position);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "users", ignore = true)
    Position toEntity (PositionRequestDto positionRequestDto);

}
