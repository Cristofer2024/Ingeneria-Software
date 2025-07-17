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

import proyecto.aduana.duoc.proyecto.aduana.duoc.Model.Viajero;
import proyecto.aduana.duoc.proyecto.aduana.duoc.repository.repositoryViajero;

@RestController
@RequestMapping("/viajero")
public class controllerViajero {

    @Autowired
    private repositoryViajero viajeroRepository;

    @PostMapping("/guardar")
    public ResponseEntity<String> guardarViajero(@ModelAttribute Viajero viajero) {
        try {
            // Normalizar el RUT antes de la verificación y la inserción
            // Esto es crucial para asegurar que el RUT se busque/almacene en un formato consistente (sin puntos ni guiones)
            String rutNormalizado = viajero.getRut().replace(".", "").replace("-", "");
            viajero.setRut(rutNormalizado); // Actualizar el RUT en el objeto Viajero

            // 1. Verificar si el RUT ya existe ANTES de intentar insertar
            // Usamos el nuevo método que solo busca por RUT
            Viajero existingViajero = viajeroRepository.buscarViajeroPorRut(viajero.getRut());
            if (existingViajero != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                                     .body("El RUT " + viajero.getRut() + " ya está registrado. Por favor, inicie sesión o use otro RUT.");
            }

            // 2. Insertar el viajero con la contraseña en texto plano (RECORDATORIO: ¡Encriptar es vital!)
            viajeroRepository.insertarViajero(
                viajero.getNombre(),
                viajero.getRut(),
                viajero.getPassword(),
                viajero.getEmail(),
                viajero.getNacionalidad(),
                viajero.getFechaNacimiento()
            );
            return ResponseEntity.ok("Registro de viajero exitoso");
        } catch (DataIntegrityViolationException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.CONFLICT)
                                 .body("Error de integridad de datos: El RUT o email podrían ya estar registrados. " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Error interno al registrar viajero: " + e.getMessage());
        }
    }

    @GetMapping("/buscarPorRut/{rut}/{password}") // Este es tu endpoint de login
    public ResponseEntity<?> loginViajero(@PathVariable String rut, @PathVariable String password) {
        try {
            // Normalizar el RUT y la contraseña antes de buscar para login
            // Asume que el SP sp_busca_viajero espera el RUT sin puntos ni guiones
            String rutNormalizado = rut.replace(".", "").replace("-", "");
            // IMPORTANTE: Aquí se debería HASHEAR la 'password' que llega del usuario
            // y comparar el hash con el hash ALMACENADO.
            // Por ahora, para que funcione con tu estructura actual, se pasa en texto plano.
            // String hashedPassword = passwordEncoder.encode(password); // Si usas BCrypt

            Viajero viajero = viajeroRepository.buscarViajeroPorRutYPassword(rutNormalizado, password); // Pasar contraseña en texto plano

            if (viajero != null) {
                // MODIFICADO: Devolver el objeto Viajero directamente.
                // Asegúrate de que tu modelo Viajero tenga getters y setters adecuados (Lombok @Data lo hace).
                // Si no quieres enviar la contraseña al frontend, puedes crear un DTO o setearla a null.
                viajero.setPassword(null); // MUY RECOMENDADO: No enviar la contraseña al frontend.
                return ResponseEntity.ok(viajero);
            }
            // Usuario no encontrado o contraseña incorrecta
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales de viajero incorrectas: RUT o contraseña inválidos.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al procesar el login del viajero: " + e.getMessage());
        }
    }
}
