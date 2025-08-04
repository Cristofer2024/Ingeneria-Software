package proyecto.aduana.duoc.proyecto.aduana.duoc.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;

@Entity // Indica que esta clase es una entidad JPA
@Data // Genera automáticamente getters, setters, toString, equals y hashCode
@NoArgsConstructor // Genera un constructor sin argumentos (necesario para JPA)
@AllArgsConstructor // Genera un constructor con todos los argumentos
public class Funcionario {

    @Id // Marca el campo 'rut' como la clave primaria de la entidad
    private String rut; // El RUT es el identificador único para el funcionario

    private String nombre;
    private String password;
    private String email;
    private String especialidad; // Nuevo campo
    private String organismo;    // Nuevo campo

    // No necesitas fec_nac para funcionarios a menos que sea un requisito
    // Si tu tabla de funcionario tiene más campos, agrégalos aquí.
}
