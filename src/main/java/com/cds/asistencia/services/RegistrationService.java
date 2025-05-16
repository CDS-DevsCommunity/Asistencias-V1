package com.cds.asistencia.services;

import java.util.List;

import com.cds.asistencia.domain.entities.Registration;

public interface RegistrationService {

    List<Registration> listRegistration();
    Registration createdRegistration(Registration registration);
    Registration updatedRegistration(Long id);
    void deletedRegistration(Long id);

}
