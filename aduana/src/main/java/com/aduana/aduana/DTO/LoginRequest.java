package com.aduana.aduana.DTO;

import lombok.Data;

@Data
public class LoginRequest {
    private String rut;
    private String password;
    private String rol;
}
