package com.cds.asistencia.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.cds.asistencia.domain.dto.Request.PersonRequestDto;
import com.cds.asistencia.domain.dto.Response.PersonResponseDto;
import com.cds.asistencia.domain.entities.Person;

@Mapper(componentModel = "spring")
public interface PersonMapper {

    PersonResponseDto toDto(Person person);
    
    @Mapping(target = "id", ignore = true) 
    @Mapping(target = "registrations", ignore = true) 
    @Mapping(target = "user", ignore = true) 
    Person toEntity (PersonRequestDto personRequestDto);

}
