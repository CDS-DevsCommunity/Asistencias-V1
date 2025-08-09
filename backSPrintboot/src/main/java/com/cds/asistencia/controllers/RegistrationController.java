package com.cds.asistencia.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cds.asistencia.domain.dto.Request.RegistrationRequestDto;
import com.cds.asistencia.domain.entities.Registration;
import com.cds.asistencia.mappers.RegistrationMapper;
import com.cds.asistencia.services.RegistrationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = "/cds/registrations")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    private final RegistrationMapper registrationMapper;

    // 1. Listar todas las registraciones
    @GetMapping
    public ResponseEntity<List<Registration>> listRegistrations() {
        List<Registration> registrations = registrationService.listRegistration();
        return ResponseEntity.ok(registrations);
    }

    // 2. Crear una nueva registración (requiere el ID de la persona)
    @PostMapping("/create/{personId}")
    public ResponseEntity<Registration> createRegistration(
            @RequestBody RegistrationRequestDto registrationRequestDto,
            @PathVariable Long personId
    ) {

        Registration registration = registrationMapper.toEntity(registrationRequestDto);

        Registration createdRegistration = registrationService.createdRegistration(registration, personId);
        return new ResponseEntity<>(createdRegistration, HttpStatus.CREATED);
    }

    // 3. Actualizar la asistencia de una registración
    @PatchMapping("/{registrationId}/attendence")
    public ResponseEntity<Registration> updateAttendence(
            @PathVariable Long registrationId,
            @RequestParam Boolean attendence
    ) {
        Registration updatedRegistration = registrationService.updatedRegistrationAttendence(registrationId, attendence);
        return ResponseEntity.ok(updatedRegistration);
    }

    // 4. Eliminar una registración
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRegistration(@PathVariable Long id) {
        registrationService.deletedRegistration(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
