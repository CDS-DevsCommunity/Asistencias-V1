package com.cds.asistencia.domain.dto.Request;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PersonRequestDto {

    private String name;
    private String email;
    private String phoneNumber;

}
