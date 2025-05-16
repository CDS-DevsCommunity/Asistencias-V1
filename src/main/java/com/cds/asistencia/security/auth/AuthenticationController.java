package com.cds.asistencia.security.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cds.asistencia.domain.dto.Request.UserRegistrationRequestDto;
import com.cds.asistencia.security.services.AuthenticationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path= "/auth")
@RequiredArgsConstructor
public class AuthenticationController{

    
    private final AuthenticationService authenticationService;


    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
        @RequestBody @Valid UserRegistrationRequestDto userRegistrationRequestDto
    ){
        AuthenticationResponse jwt = authenticationService.register(userRegistrationRequestDto);
        return ResponseEntity.ok(jwt);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(
        @RequestBody @Valid AuthenticationRequest authenticationRequest
    ){

        AuthenticationResponse jwtDto = authenticationService.login(authenticationRequest);

        return ResponseEntity.ok(jwtDto);
    }

    @GetMapping("/public-access")
    public String publicAccessEndpoint(){
        return "este endpoint es publico";
    }

}