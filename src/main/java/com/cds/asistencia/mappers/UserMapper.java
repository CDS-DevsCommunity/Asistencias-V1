package com.cds.asistencia.mappers;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.cds.asistencia.domain.dto.Request.UserRegistrationRequestDto;
import com.cds.asistencia.domain.dto.Response.UserResponseDto;
import com.cds.asistencia.domain.entities.User;

@Mapper(componentModel = "spring")
public interface UserMapper{

    @Mapping(target = "activo", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "person", ignore = true)
    User toEntity(UserRegistrationRequestDto dto);
    UserResponseDto toDto(User entity);
    List<User> toEntityList(List<UserRegistrationRequestDto> dtoList);
    List<UserResponseDto> toDtoList(List<User> entityList);
}
