package com.cds.asistencia.domain.dto.Request;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistrationRequestDto {

    private LocalDateTime horaEntrada;
    private LocalDateTime horaSalida;
    private String observaciones;
    private PersonRequestDto person;

}
