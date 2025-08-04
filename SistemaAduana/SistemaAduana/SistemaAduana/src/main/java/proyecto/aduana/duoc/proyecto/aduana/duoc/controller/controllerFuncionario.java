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

import proyecto.aduana.duoc.proyecto.aduana.duoc.Model.Funcionario;
import proyecto.aduana.duoc.proyecto.aduana.duoc.repository.repositoryFuncionario;

@RestController
@RequestMapping("/funcionario")
public class controllerFuncionario {

    @Autowired
    private repositoryFuncionario funcionarioRepository;

    @PostMapping("/guardar")
    public ResponseEntity<String> guardarFuncionario(@ModelAttribute Funcionario funcionario) {
        try {
            // 1. Verificar si el RUT ya existe ANTES de intentar insertar
            // Nota: Con esta configuración, la contraseña se maneja en texto plano.
            Funcionario existingFuncionario = funcionarioRepository.buscarFuncionarioPorRutYPassword(funcionario.getRut(), funcionario.getPassword()); // Usamos el método que busca por RUT y Password
            if (existingFuncionario != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                                     .body("El RUT " + funcionario.getRut() + " ya está registrado para un funcionario. Por favor, utilice otro RUT.");
            }

            // 2. Insertar el funcionario con la contraseña en texto plano
            funcionarioRepository.insertarFuncionario(
                funcionario.getNombre(),
                funcionario.getRut(),
                funcionario.getPassword(), // Contraseña en texto plano
                funcionario.getEmail(),
                funcionario.getEspecialidad(),
                funcionario.getOrganismo()
            );
            return ResponseEntity.ok("Registro de funcionario exitoso");
        } catch (DataIntegrityViolationException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.CONFLICT)
                                 .body("Error de integridad de datos: El RUT o email podrían ya estar registrados. " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Error interno al registrar funcionario: " + e.getMessage());
        }
    }

    @GetMapping("/buscarPorRut/{rut}/{password}")
    public ResponseEntity<?> loginFuncionario(@PathVariable String rut, @PathVariable String password) {
        try {
            // Buscar al funcionario por RUT y Contraseña (en texto plano)
            Funcionario funcionario = funcionarioRepository.buscarFuncionarioPorRutYPassword(rut, password);

            if (funcionario != null) {
                // Si se encuentra el funcionario, las credenciales son correctas
                return ResponseEntity.ok(funcionario);
            }
            // Usuario no encontrado o contraseña incorrecta
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales de funcionario incorrectas: Usuario o contraseña inválidos.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al procesar el login del funcionario: " + e.getMessage());
        }
    }
}