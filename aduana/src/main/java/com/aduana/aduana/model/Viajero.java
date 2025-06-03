package com.aduana.aduana.model;

import java.time.LocalDate;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "viajero")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class Viajero {
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
    private String nacionalidad;

    @NotNull
    private LocalDate fechaNacimiento;
}
