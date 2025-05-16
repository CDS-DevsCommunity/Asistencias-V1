package com.cds.asistencia.domain.dto.Request;

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

    
    @Size(min = 3, max = 20)
    private String username;

    @Email
    private String email;

    private String phoneNumber;
    
    @NotBlank
    private String password;
    
}
