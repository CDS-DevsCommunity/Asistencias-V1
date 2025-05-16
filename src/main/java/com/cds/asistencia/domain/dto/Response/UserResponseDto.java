package com.cds.asistencia.domain.dto.Response;

import com.cds.asistencia.domain.entities.Person;
import com.cds.asistencia.domain.entities.Position;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDto {
    private Long id;
    private String email;
    private boolean activo;
    private Position position;
    private Person person;
}
