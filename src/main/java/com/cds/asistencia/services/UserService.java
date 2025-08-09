package com.cds.asistencia.services;

import java.util.List;

import com.cds.asistencia.domain.dto.Request.UserRegistrationRequestDto;
import com.cds.asistencia.domain.entities.Position;
import com.cds.asistencia.domain.entities.User;
import com.cds.asistencia.util.Role;

public interface UserService {

    List<User> listUsers();
    List<User> getUserByPosition(Long CargoId);
    User getUser(Long Id);
    User updatedUser(Long id, UserRegistrationRequestDto userRegistrationRequestDto);
    void deletedUser(Long id);
    User updatedRoleUser(Long id, Role role);
    User updatedPositionUser(Long id, Long positionId);

}
