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

import com.cds.asistencia.domain.dto.Request.PositionRequestDto;
import com.cds.asistencia.domain.dto.Request.UserRegistrationRequestDto;
import com.cds.asistencia.domain.dto.Response.PositionResponseDto;
import com.cds.asistencia.domain.dto.Response.UserResponseDto;
import com.cds.asistencia.domain.entities.Position;
import com.cds.asistencia.domain.entities.User;
import com.cds.asistencia.mappers.UserMapper;
import com.cds.asistencia.services.UserService;
import com.cds.asistencia.util.Role;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = "/cds/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    @GetMapping
    public ResponseEntity<List<UserResponseDto>> listUsers() {
        List<UserResponseDto> userDtos = userService.listUsers()
                                        .stream()
                                        .map(userMapper::toDto)
                                        .toList();
        return ResponseEntity.ok(userDtos);
    }

    @GetMapping(path = "/position/{position_id}")
    public ResponseEntity<List<UserResponseDto>> getUsersByPosition(
        @PathVariable("position_id") Long positionId
    ) {
        List<UserResponseDto> userDtos = userService.getUserByPosition(positionId)
                                        .stream()
                                        .map(userMapper::toDto)
                                        .toList();
        return ResponseEntity.ok(userDtos);
    }

    @GetMapping(path = "/{user_id}")
    public ResponseEntity<Optional<UserResponseDto>> getUser(
        @PathVariable("user_id") Long userId
    ) {
        return ResponseEntity.ok(
            Optional.ofNullable(userService.getUser(userId))
                    .map(userMapper::toDto)
        );
    }

    @PutMapping(path = "/{user_id}")
    public ResponseEntity<UserResponseDto> updateUser(
        @PathVariable("user_id") Long userId, 
        @RequestBody UserRegistrationRequestDto userRegistrationRequestDto
    ) {
        
        User updatedUser = userService.updatedUser(userId, userRegistrationRequestDto);
        
        return ResponseEntity.ok(
            userMapper.toDto(updatedUser)
        );
    }

    @DeleteMapping(path = "/{user_id}")
    public ResponseEntity<Void> deleteUser(@PathVariable("user_id") Long userId) {
        userService.deletedUser(userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping(path = "/role/{user_id}")
    public ResponseEntity<UserResponseDto> updateRolUser(
        @PathVariable("user_id") Long userId, 
        @RequestBody Role rol
    ) {
        
        User updatedUser = userService.updatedRoleUser(userId, rol);
        
        return ResponseEntity.ok(
            userMapper.toDto(updatedUser)
        );
    }

    @PutMapping(path = "/position/{user_id}/{position_id}")
    public ResponseEntity<UserResponseDto> updatePositionUser(
        @PathVariable("user_id") Long userId, 
        @PathVariable("position_id") Long positionId
    ) {
        
        User updatedUser = userService.updatedPositionUser(userId, positionId);
        
        return ResponseEntity.ok(
            userMapper.toDto(updatedUser)
        );
    }

    
}