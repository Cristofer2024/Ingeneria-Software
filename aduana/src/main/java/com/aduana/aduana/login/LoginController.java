package com.aduana.aduana.login;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aduana.aduana.model.Admin;
import com.aduana.aduana.model.FuncionarioAduana;
import com.aduana.aduana.model.Viajero;
import com.aduana.aduana.repository.AdminRepository;
import com.aduana.aduana.repository.FuncionarioAduanaRepository;
import com.aduana.aduana.repository.ViajeroRepository;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.Optional;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
public class LoginController {

    @Autowired
    private AdminRepository adminRepo;

    @Autowired
    private FuncionarioAduanaRepository funcionarioRepo;

    @Autowired
    private ViajeroRepository viajeroRepo;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO login) {
        Optional<Admin> admin = adminRepo.findByRutAndPassword(login.getRut(), login.getPassword());
        if (admin.isPresent()) {
            return ResponseEntity.ok(Map.of("rol", "admin"));
        }

        Optional<FuncionarioAduana> funcionario = funcionarioRepo.findByRutAndPassword(login.getRut(), login.getPassword());
        if (funcionario.isPresent()) {
            return ResponseEntity.ok(Map.of("rol", "funcionario"));
        }

        Optional<Viajero> viajero = viajeroRepo.findByRutAndPassword(login.getRut(), login.getPassword());
        if (viajero.isPresent()) {
            return ResponseEntity.ok(Map.of("rol", "viajero"));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
    }
}
