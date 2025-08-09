package com.cds.asistencia.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cds.asistencia.domain.dto.Request.PersonRequestDto;
import com.cds.asistencia.domain.dto.Response.PersonResponseDto;
import com.cds.asistencia.domain.entities.Person;
import com.cds.asistencia.mappers.PersonMapper;
import com.cds.asistencia.services.PersonService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = "/cds/persons")
@RequiredArgsConstructor
public class PersonController {

    private final PersonService personService;
    private final PersonMapper personMapper;

    @GetMapping
    public ResponseEntity<List<PersonResponseDto>> ListPerson() {
        List<PersonResponseDto> positionDtos = personService.ListPerson()
                                        .stream()
                                        .map(personMapper::toDto)
                                        .toList();
        return ResponseEntity.ok(positionDtos);
    }

    @PostMapping
    public ResponseEntity<PersonResponseDto> postPerson(@RequestBody PersonRequestDto personRequestDto){

        Person createdPerson = personMapper.toEntity(personRequestDto);
        Person savedPerson = personService.createPerson(createdPerson);

        return new ResponseEntity<>(
            personMapper.toDto(savedPerson),
            HttpStatus.CREATED
        );

    }

    @GetMapping(path = "/{person_id}")
    public ResponseEntity<Optional<PersonResponseDto>> ListPerson(
        @PathVariable("person_id") Long personId
    ) {
        return ResponseEntity.ok(
            personService
                    .getPerson(personId)
                    .map(personMapper::toDto)
        );
    }

    @PutMapping(path = "/{person_id}")
    public ResponseEntity<PersonResponseDto> putPerson(
        @PathVariable("person_id") Long personId, 
        @RequestBody PersonRequestDto personRequestDto
    ){

        Person dtoToPerson = personMapper.toEntity(personRequestDto);
        Person updatedPerson = personService.updatePerson(personId, dtoToPerson);

        return ResponseEntity.ok(
            personMapper.toDto(updatedPerson)
        );

    }

    @DeleteMapping(path = "/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        personService.deletePerson(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
