package com.cds.asistencia.services;

import java.util.List;

import com.cds.asistencia.domain.entities.Registration;
import com.cds.asistencia.domain.entities.User;

public interface UserService {

    List<User> listUsers();
    List<User> getUserByCargo(Long CargoId);
    Registration createdUser(Registration registration);
    Registration updatedUser(Long id);
    void deletedUser(Long id);

}
