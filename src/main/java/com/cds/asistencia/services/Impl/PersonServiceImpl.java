package com.cds.asistencia.services.Impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.cds.asistencia.domain.entities.Person;
import com.cds.asistencia.domain.entities.Position;
import com.cds.asistencia.mappers.PersonMapper;
import com.cds.asistencia.repositories.PersonRepository;
import com.cds.asistencia.repositories.UserRepository;
import com.cds.asistencia.services.PersonService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PersonServiceImpl implements PersonService {

    private final PersonRepository personRepository;

    private final UserRepository userRepository;

    @Override
    public List<Person> ListPerson() {
        return personRepository.findAll();
    }

    // @Override
    // public List<Person> getPersonsByEvent(Long eventId) {
    //     return personRepository.findByEventId(eventId);
    // }

    @Override
    public Person createPerson(Person person) {

        if (person.getName() == null || person.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be empty");
        }

        String email = person.getEmail();
        if (personRepository.existsByNameIgnoreCase(email)) {
            throw new IllegalArgumentException("Email is already exist: " + email);
        }
        
        return personRepository.save(person);

    }

    @Override
    public Person updatePerson(Long id, Person person) {
        
        Person personToSave = personRepository.findById(id)
                        .orElseThrow(()-> new IllegalArgumentException("Person not found with"));

        personToSave.setName(person.getName());
        personToSave.setEmail(person.getEmail());
        personToSave.setPhoneNumber(person.getPhoneNumber());
        
        return personRepository.save(personToSave);

    }

    @Override
    public void deletePerson(Long id) {
         
        Person person = personRepository.findById(id).orElseThrow(()-> new IllegalArgumentException("Person not found with id: " + id));
        
        userRepository.deleteByEmail(person.getEmail());

        personRepository.deleteById(id);
        
    }

    @Override
    public Optional<Person>  getPerson(Long id) {

        return personRepository.findById(id);
    }

}
