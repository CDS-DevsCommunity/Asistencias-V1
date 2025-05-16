package com.cds.asistencia.domain.dto.Response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PersonResponseDto {

    private Long id;
    private String name;
    private String email;
    private String phoneNumber;
    
}
