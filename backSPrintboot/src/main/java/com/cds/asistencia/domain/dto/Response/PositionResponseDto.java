package com.cds.asistencia.domain.dto.Response;


import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PositionResponseDto {

    private Long id;
    private String name;
    private String description;
    private List<UserResponseDto> users;
}
