package com.cds.asistencia.util;

import java.util.Arrays;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;



@AllArgsConstructor
public enum Role {

    ADMIN(Arrays.asList(Permission.CREATE,Permission.UPDATE,Permission.READ,Permission.DELETE )),

    LEADS(Arrays.asList(Permission.UPDATE,Permission.READ,Permission.DELETE )),

    USER(Arrays.asList(Permission.READ, Permission.CREATE));

    private List<Permission> permissions;

    public List<Permission> getPermissions() {
        return permissions;
    }

    public void setPermissions(List<Permission> permissions) {
        this.permissions = permissions;
    }



}
