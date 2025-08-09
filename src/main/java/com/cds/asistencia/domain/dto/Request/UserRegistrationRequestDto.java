package com.cds.asistencia.domain.dto.Request;

import com.cds.asistencia.domain.entities.Position;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRegistrationRequestDto {
    
    @NotBlank
    private String name;

    @Email
    private String email;

    private String phoneNumber;
    
    @NotBlank
    private String password;

    
}
