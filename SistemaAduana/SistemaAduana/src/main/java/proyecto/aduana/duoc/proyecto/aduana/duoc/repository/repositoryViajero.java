package proyecto.aduana.duoc.proyecto.aduana.duoc.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import proyecto.aduana.duoc.proyecto.aduana.duoc.Model.Viajero;
import java.util.List;
import java.sql.Date;
import java.time.LocalDate;

@Repository
public class repositoryViajero {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public void insertarViajero(String nombre, String rut, String password,
                                 String email, String nacionalidad, LocalDate fechaNacimiento) {

        Date sqlDate = Date.valueOf(fechaNacimiento);

        // Asegúrate de que el procedimiento almacenado 'sp_inserta_viajero'
        // espere los parámetros en este orden y con los tipos correctos.
        // Asumiendo que rut se pasa sin puntos ni guiones aquí si se normaliza en el frontend.
        entityManager.createNativeQuery("CALL sp_inserta_viajero(?, ?, ?, ?, ?, ?)")
                .setParameter(1, nombre)
                .setParameter(2, rut)
                .setParameter(3, password)
                .setParameter(4, email)
                .setParameter(5, nacionalidad)
                .setParameter(6, sqlDate)
                .executeUpdate();
    }

    // Nuevo método para buscar viajero SOLO por RUT para verificar existencia
    @Transactional
    public Viajero buscarViajeroPorRut(String rut) {
        // Asegúrate de que tu procedimiento almacenado 'sp_busca_viajero_por_rut'
        // (o como lo llames) solo necesite el RUT y devuelva el Viajero si existe.
        // Si no tienes un SP así, puedes usar una query JPQL o Criteria API.
        // Ejemplo de JPQL si tu Viajero es una entidad JPA completa:
        try {
            // Asume que la columna en Viajero es 'rut' y que la base de datos almacena el RUT de la misma forma que lo pasas.
            return entityManager.createQuery("SELECT v FROM Viajero v WHERE v.rut = :rut", Viajero.class)
                                .setParameter("rut", rut)
                                .getSingleResult();
        } catch (NoResultException e) {
            return null; // No se encontró ningún viajero con ese RUT
        }
    }


    // Este método busca por RUT y Contraseña (ahora en texto plano)
    // Usado para el login
    @Transactional
    public Viajero buscarViajeroPorRutYPassword(String rut, String password) {
        List<Object[]> result = entityManager.createNativeQuery("CALL sp_busca_viajero(?, ?)")
                .setParameter(1, rut)
                .setParameter(2, password)
                .getResultList();

        if (!result.isEmpty()) {
            Object[] row = result.get(0);
            Viajero viajero = new Viajero();
            viajero.setRut((String) row[0]);
            viajero.setNombre((String) row[1]);
            viajero.setPassword((String) row[2]);
            viajero.setEmail((String) row[3]);
            viajero.setNacionalidad((String) row[4]);

            if (row[5] instanceof Date) {
                viajero.setFechaNacimiento(((Date) row[5]).toLocalDate());
            } else if (row[5] != null) {
                try {
                    viajero.setFechaNacimiento(LocalDate.parse(row[5].toString()));
                } catch (Exception e) {
                    System.err.println("Error al parsear fecha de nacimiento: " + row[5] + " - " + e.getMessage());
                    viajero.setFechaNacimiento(null);
                }
            } else {
                viajero.setFechaNacimiento(null);
            }

            return viajero;
        }
        return null;
    }
}