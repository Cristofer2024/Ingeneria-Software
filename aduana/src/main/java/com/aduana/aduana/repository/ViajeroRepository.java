package com.aduana.aduana.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aduana.aduana.model.Viajero;

public interface ViajeroRepository extends JpaRepository<Viajero, Long> {
    Optional<Viajero> findByRut(String rut);
    Optional<Viajero> findByRutAndPassword(String rut, String password);
}
