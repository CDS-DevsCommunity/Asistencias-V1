package com.cds.asistencia.domain.dto.Response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistrationResponseDto {
    private Long id;
    private LocalDateTime horaEntrada;
    private LocalDateTime horaSalida;
    private String observaciones;
    private PersonResponseDto person;
}
