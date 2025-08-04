package proyecto.aduana.duoc.proyecto.aduana.duoc.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import proyecto.aduana.duoc.proyecto.aduana.duoc.Model.Funcionario;
import java.util.List;

@Repository
public class repositoryFuncionario {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public void insertarFuncionario(String nombre, String rut, String password, // Contraseña en texto plano
                                    String email, String especialidad, String organismo) {

        entityManager.createNativeQuery("CALL sp_inserta_funcionario(?, ?, ?, ?, ?, ?)")
                .setParameter(1, nombre)
                .setParameter(2, rut)
                .setParameter(3, password) // Pasar contraseña en texto plano al SP
                .setParameter(4, email)
                .setParameter(5, especialidad)
                .setParameter(6, organismo)
                .executeUpdate();
    }

    // Este método busca por RUT y Contraseña (ahora en texto plano)
    @Transactional
    public Funcionario buscarFuncionarioPorRutYPassword(String rut, String password) { // Recibe ambos parámetros
        List<Object[]> result = entityManager.createNativeQuery("CALL sp_busca_funcionario(?, ?)") // SP espera ambos
                .setParameter(1, rut)
                .setParameter(2, password)
                .getResultList();

        if (!result.isEmpty()) {
            Object[] row = result.get(0);
            Funcionario funcionario = new Funcionario();
            funcionario.setRut((String) row[0]);
            funcionario.setNombre((String) row[1]);
            funcionario.setPassword((String) row[2]); // Obtener contraseña en texto plano
            funcionario.setEmail((String) row[3]);
            funcionario.setEspecialidad((String) row[4]);
            funcionario.setOrganismo((String) row[5]);
            return funcionario;
        }
        return null;
    }
}