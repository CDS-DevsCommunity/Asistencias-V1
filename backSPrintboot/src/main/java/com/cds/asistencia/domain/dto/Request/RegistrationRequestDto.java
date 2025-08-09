package com.cds.asistencia.domain.dto.Request;



import jakarta.persistence.Column;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistrationRequestDto {

    private boolean asistio;
    
    private String metodoRegistro;
    
    @Column(length = 500)
    private String observaciones;

    private Long registrationId;


}
