package com.cds.asistencia.security.auth;

import com.cds.asistencia.util.Role;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class AuthenticationResponse {

    
    private String name;
    private String gmail;
    private String phoneNumber;
    private Role role;
    private String jwt;



}
