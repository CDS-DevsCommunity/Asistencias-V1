package com.cds.asistencia.services.Impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.cds.asistencia.domain.entities.Person;
import com.cds.asistencia.domain.entities.Registration;
import com.cds.asistencia.domain.entities.User;
import com.cds.asistencia.repositories.PersonRepository;
import com.cds.asistencia.repositories.RegistrationRepository;
import com.cds.asistencia.repositories.UserRepository;
import com.cds.asistencia.services.RegistrationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RegistrationServiceImpl implements RegistrationService{

    private final RegistrationRepository registrationRepository;

    private final PersonRepository personRepository;

    @Override
    public List<Registration> listRegistration() {
        return registrationRepository.findAll();
    }

    @Override
    public Registration createdRegistration(Registration registration, Long personId) {
        
        Person person =  personRepository.findById(personId).orElseThrow(()-> new IllegalArgumentException("User not found"));
        
        registration.setPerson(person);

        LocalDateTime now = LocalDateTime.now();

        registration.setFechaRegistro(now);
        
        return registration;
    }

    @Override
    public Registration updatedRegistrationAttendence(Long registrationid,Boolean attendence) {
        Registration registration = registrationRepository.findById(registrationid).orElseThrow(()-> new IllegalArgumentException("registration not found"));
        
        registration.setAsistio(attendence);

        return registrationRepository.save(registration);
        
    }

    @Override
    public void deletedRegistration(Long id) {
        registrationRepository.deleteById(id);
    }

}
