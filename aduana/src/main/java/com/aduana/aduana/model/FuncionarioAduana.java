package com.aduana.aduana.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "funcionario_aduana")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class FuncionarioAduana {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AUTO_INCREMENT en la BD
    private Integer id;
    @NotNull
    private String nombre;

    @NotNull
    @Column(unique = true)
    private String rut;

    @NotNull
    @Email
    @Column(unique = true)
    private String email;

    @NotNull
    private String contrasena;

    @NotNull
    private String especialidad;

    @NotNull
    private String organismo;
}