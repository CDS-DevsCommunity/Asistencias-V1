package com.cds.asistencia.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.cds.asistencia.domain.dto.Request.RegistrationRequestDto;
import com.cds.asistencia.domain.dto.Response.RegistrationResponseDto;
import com.cds.asistencia.domain.entities.Position;
import com.cds.asistencia.domain.entities.Registration;

@Mapper(componentModel = "spring")
public interface RegistrationMapper {

    @Mapping(target = "person", ignore = true)
    RegistrationResponseDto toDto(Position position);
    
    @Mapping(target = "person", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "fechaRegistro", ignore = true)
    Registration toEntity (RegistrationRequestDto reqRegistrationRequestDto);

}
