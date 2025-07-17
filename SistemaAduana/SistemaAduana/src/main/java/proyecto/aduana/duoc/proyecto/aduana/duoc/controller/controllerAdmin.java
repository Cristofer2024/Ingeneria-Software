package proyecto.aduana.duoc.proyecto.aduana.duoc.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import proyecto.aduana.duoc.proyecto.aduana.duoc.Model.Admin;
import proyecto.aduana.duoc.proyecto.aduana.duoc.repository.repositoryAdmin;

@RestController
@RequestMapping("/admin")
public class controllerAdmin {

    @Autowired
    private repositoryAdmin adminRepository;

    @PostMapping("/guardar")
    public ResponseEntity<String> guardarAdmin(@ModelAttribute Admin admin) {
        try {
            // 1. Verificar si el RUT ya existe ANTES de intentar insertar
            // Nota: Con esta configuración, la contraseña se maneja en texto plano.
            Admin existingAdmin = adminRepository.buscarAdminPorRutYPassword(admin.getRut(), admin.getPassword()); // Usamos el método que busca por RUT y Password
            if (existingAdmin != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                                     .body("El RUT " + admin.getRut() + " ya está registrado para un administrador. Por favor, utilice otro RUT.");
            }

            // 2. Insertar el administrador con la contraseña en texto plano
            adminRepository.insertarAdmin(
                admin.getNombre(),
                admin.getRut(),
                admin.getPassword(), // Contraseña en texto plano
                admin.getEmail()
            );
            return ResponseEntity.ok("Registro de administrador exitoso");
        } catch (DataIntegrityViolationException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.CONFLICT)
                                 .body("Error de integridad de datos: El RUT o email podrían ya estar registrados. " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Error interno al registrar administrador: " + e.getMessage());
        }
    }

    @GetMapping("/buscarPorRut/{rut}/{password}")
    public ResponseEntity<?> loginAdmin(@PathVariable String rut, @PathVariable String password) {
        try {
            // Buscar al administrador por RUT y Contraseña (en texto plano)
            Admin admin = adminRepository.buscarAdminPorRutYPassword(rut, password);

            if (admin != null) {
                // Si se encuentra el administrador, las credenciales son correctas
                return ResponseEntity.ok(admin);
            }
            // Usuario no encontrado o contraseña incorrecta
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales de administrador incorrectas: Usuario o contraseña inválidos.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al procesar el login del administrador: " + e.getMessage());
        }
    }
}
