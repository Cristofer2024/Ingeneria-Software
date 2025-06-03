package com.aduana.aduana.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aduana.aduana.model.Admin;

public interface AdminRepository extends JpaRepository<Admin, Integer> {
    Optional<Admin> findByRut(String rut);

}
