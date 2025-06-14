package com.aduana.aduana.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aduana.aduana.model.FuncionarioAduana;

public interface FuncionarioAduanaRepository extends JpaRepository<FuncionarioAduana, Long> {
    Optional<FuncionarioAduana> findByRut(String rut);
    Optional<FuncionarioAduana> findByRutAndPassword(String rut, String password);

}
