package proyecto.aduana.duoc.proyecto.aduana.duoc.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Admin {

    @Id // El RUT como clave primaria
    private String rut;

    private String nombre;
    private String password; // Almacenará la contraseña en texto plano (sin encriptación)
    private String email;
}
