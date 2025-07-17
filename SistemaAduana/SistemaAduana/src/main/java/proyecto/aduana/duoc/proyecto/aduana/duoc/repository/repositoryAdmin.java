package proyecto.aduana.duoc.proyecto.aduana.duoc.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import proyecto.aduana.duoc.proyecto.aduana.duoc.Model.Admin;
import java.util.List;

@Repository
public class repositoryAdmin {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public void insertarAdmin(String nombre, String rut, String password, String email) { // Contraseña en texto plano

        entityManager.createNativeQuery("CALL sp_inserta_admin(?, ?, ?, ?)")
                .setParameter(1, nombre)
                .setParameter(2, rut)
                .setParameter(3, password) // Pasar contraseña en texto plano al SP
                .setParameter(4, email)
                .executeUpdate();
    }

    // Este método busca por RUT y Contraseña (ahora en texto plano)
    @Transactional
    public Admin buscarAdminPorRutYPassword(String rut, String password) { // Recibe ambos parámetros
        List<Object[]> result = entityManager.createNativeQuery("CALL sp_busca_admin(?, ?)") // SP espera ambos
                .setParameter(1, rut)
                .setParameter(2, password)
                .getResultList();

        if (!result.isEmpty()) {
            Object[] row = result.get(0);
            Admin admin = new Admin();
            admin.setRut((String) row[0]);
            admin.setNombre((String) row[1]);
            admin.setPassword((String) row[2]); // Obtener contraseña en texto plano
            admin.setEmail((String) row[3]);
            return admin;
        }
        return null;
    }
}
