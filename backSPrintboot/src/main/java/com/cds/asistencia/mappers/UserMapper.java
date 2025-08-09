package com.cds.asistencia.mappers;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.cds.asistencia.domain.dto.Request.UserRegistrationRequestDto;
import com.cds.asistencia.domain.dto.Response.UserResponseDto;
import com.cds.asistencia.domain.entities.Person;
import com.cds.asistencia.domain.entities.User;

@Mapper(componentModel = "spring")
public interface UserMapper{

    @Mapping(target = "activo", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "person", ignore = true)
    @Mapping(target = "position", ignore = true)
    @Mapping(target = "role", ignore = true)
    User toEntity(UserRegistrationRequestDto dto);
    
    @Mapping(target = "name", ignore = true)
    @Mapping(target = "phoneNumber", ignore = true)
    UserResponseDto toDto(User entity);
    List<User> toEntityList(List<UserRegistrationRequestDto> dtoList);
    List<UserResponseDto> toDtoList(List<User> entityList);
    @Mapping(target = "activo", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "person", ignore = true)
    @Mapping(target = "position", ignore = true)
    UserResponseDto toDtoUserResponse(UserRegistrationRequestDto dto);
}
