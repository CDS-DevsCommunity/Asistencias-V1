package com.cds.asistencia.security.services;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.cds.asistencia.domain.dto.Request.UserRegistrationRequestDto;
import com.cds.asistencia.domain.entities.Person;
import com.cds.asistencia.domain.entities.User;
import com.cds.asistencia.repositories.PersonRepository;
import com.cds.asistencia.repositories.UserRepository;
import com.cds.asistencia.security.auth.AuthenticationRequest;
import com.cds.asistencia.security.auth.AuthenticationResponse;
import com.cds.asistencia.security.jwt.JwtService;
import com.cds.asistencia.util.Role;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    
    private final AuthenticationManager authenticationManager;

    private final UserRepository userRepository;

    private final PersonRepository personRepository;

    private final JwtService jwtService;

    private final PasswordEncoder passwordEncoder;

    public AuthenticationResponse login(AuthenticationRequest authenticationRequest) {

        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
            authenticationRequest.getGmail(), authenticationRequest.getPassword()
        );

        authenticationManager.authenticate(authToken);

        User user = userRepository.findByEmail(authenticationRequest.getGmail()).get();

        String jwt = jwtService.generateToken(user,generateExtractClaims(user));

        return new AuthenticationResponse(jwt);

    }

    private Map<String, Object> generateExtractClaims(User user) {
        
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("gmail", user.getEmail());
        extraClaims.put("role", user.getRole().name());
        extraClaims.put("permissions", user.getAuthorities());

        return extraClaims;
    }

    public AuthenticationResponse register(UserRegistrationRequestDto userRegistrationRequestDto) {

        if (userRepository.findByEmail(userRegistrationRequestDto.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already in use");
        }

        Role role =  Role.USER;

        Person newPerson = new Person();

        String newEmail = userRegistrationRequestDto.getEmail();
        String newName = userRegistrationRequestDto.getName();
        String newPhoneNumber = userRegistrationRequestDto.getPhoneNumber();


        newPerson.setEmail(newEmail);
        newPerson.setName(newName);
        newPerson.setPhoneNumber(newPhoneNumber);
        
        
        personRepository.save(newPerson);

        Person person = personRepository.findByEmail(newEmail)
                                        .orElseThrow(()-> new IllegalArgumentException("Person not found "));

        User newUser = new User();
        newUser.setEmail(userRegistrationRequestDto.getEmail());
        newUser.setPassword(passwordEncoder.encode(userRegistrationRequestDto.getPassword()));
        newUser.setPerson(person);
        newUser.setRole(role);
        newUser.setActivo(true);

        userRepository.save(newUser);
    

        String jwt = jwtService.generateToken(newUser, generateExtractClaims(newUser));

        return new AuthenticationResponse(jwt);
    }

}
