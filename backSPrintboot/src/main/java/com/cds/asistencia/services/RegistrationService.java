package com.cds.asistencia.services;

import java.util.List;

import com.cds.asistencia.domain.entities.Registration;

public interface RegistrationService {

    List<Registration> listRegistration();
    Registration createdRegistration(Registration registration, Long userId);
    Registration updatedRegistrationAttendence(Long registrationid, Boolean attendence);
    void deletedRegistration(Long id);

}
