package com.cds.asistencia.services.Impl;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.cds.asistencia.domain.dto.Request.UserRegistrationRequestDto;
import com.cds.asistencia.domain.entities.Person;
import com.cds.asistencia.domain.entities.Position;
import com.cds.asistencia.domain.entities.Registration;
import com.cds.asistencia.domain.entities.User;
import com.cds.asistencia.repositories.PersonRepository;
import com.cds.asistencia.repositories.PositionRepository;
import com.cds.asistencia.repositories.UserRepository;
import com.cds.asistencia.services.UserService;
import com.cds.asistencia.util.Role;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final PersonRepository personRepository;

    private final PasswordEncoder passwordEncoder;

    private final PositionRepository positionRepository;

    @Override
    public List<User> listUsers() {
        return userRepository.findAll();
    }

    @Override
    public List<User> getUserByPosition(Long CargoId) {
        return userRepository.findByPositionId(CargoId);
    }


    @Override
    public User updatedUser(Long id, UserRegistrationRequestDto user) {

        
        
        User userToUpdate = userRepository.findById(id).orElseThrow(()-> new IllegalArgumentException("User not found with id: " + id  ));

        Person personToUpdate = personRepository.findById(userToUpdate.getPerson().getId()).orElseThrow(()-> new IllegalArgumentException("Person not found with id: " + id  ));

        if (user.getEmail() != userToUpdate.getEmail() && userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email is already exist");
        }
        
        
        userToUpdate.setEmail(user.getEmail());
        userToUpdate.setPassword(passwordEncoder.encode(user.getPassword()));
        
        personToUpdate.setPhoneNumber(user.getPhoneNumber());
        personToUpdate.setEmail(user.getEmail());
        personToUpdate.setName(user.getName());

        personRepository.save(personToUpdate);
        

        return userRepository.save(userToUpdate);

    }

    @Override
    public void deletedUser(Long id) {
        
        User userToDelete = userRepository.findById(id).orElseThrow(()-> new IllegalArgumentException("User not found with id: " + id  ));

        Person personToDelete = personRepository.findById(userToDelete.getPerson().getId()).orElseThrow(()-> new IllegalArgumentException("User not found with id: " + id  ));

        userRepository.deleteById(userToDelete.getId());
        personRepository.deleteById(personToDelete.getId());
    }

    @Override
    public User getUser(Long id) {
        return userRepository.findById(id).orElseThrow(()-> new IllegalArgumentException("User not found with id: " + id  ));
    }

    @Override
    public User updatedRoleUser(Long id, Role role) {
        
        User userToUpdate = userRepository.findById(id).orElseThrow(()-> new IllegalArgumentException("User not found with id: " + id  ));

        userToUpdate.setRole(role);

        return userRepository.save(userToUpdate);
    }

    @Override
    public User updatedPositionUser(Long id, Long positionId) {
        User userToUpdate = userRepository.findById(id).orElseThrow(()-> new IllegalArgumentException("User not found with id: " + id  ));

        Position position = positionRepository.findById(positionId).orElseThrow(()-> new IllegalArgumentException("Position not found with id: " + positionId));

        userToUpdate.setPosition(position);

        return userRepository.save(userToUpdate);
    }


}
