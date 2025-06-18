package com.aduana.aduana.DTO;

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
    public ResponseEntity<?> login(@RequestBody LoginRequest login) {
        String rut = login.getRut();
        String password = login.getPassword();
        String rol = login.getRol();

        switch (rol.toLowerCase()) {
            case "admin":
                Optional<Admin> admin = adminRepo.findByRutAndPassword(rut, password);
                if (admin.isPresent()) {
                    return ResponseEntity.ok(Map.of("rol", "admin"));
                }
                break;
            case "funcionario":
                Optional<FuncionarioAduana> funcionario = funcionarioRepo.findByRutAndPassword(rut, password);
                if (funcionario.isPresent()) {
                    return ResponseEntity.ok(Map.of("rol", "funcionario"));
                }
                break;
            case "viajero":
                Optional<Viajero> viajero = viajeroRepo.findByRutAndPassword(rut, password);
                if (viajero.isPresent()) {
                    return ResponseEntity.ok(Map.of("rol", "viajero"));
                }
                break;
            default:
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Rol inválido");
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
    }
}
