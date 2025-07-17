package proyecto.aduana.duoc.proyecto.aduana.duoc.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;

import java.time.LocalDate; // Importar LocalDate para fechas

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Viajero {

    @Id // El RUT como clave primaria. Asegúrate de que sea único en tu DB.
    private String rut;

    private String nombre;
    private String password; // Almacenará la contraseña en texto plano (sin encriptación)
    private String email;
    private String nacionalidad;
    private LocalDate fechaNacimiento; // Cambiado a LocalDate para mejor manejo de fechas
}
