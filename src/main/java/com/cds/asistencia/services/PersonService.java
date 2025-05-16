package com.cds.asistencia.services;

import java.util.List;
import java.util.Optional;

import com.cds.asistencia.domain.entities.Person;

public interface PersonService {

    List<Person> ListPerson();
    Optional<Person> getPerson(Long id);
    // List<Person> getPersonsByEvent(Long eventId);
    Person createPerson(Person person);
    Person updatePerson(Long id,Person person);
    void deletePerson(Long id);

}
