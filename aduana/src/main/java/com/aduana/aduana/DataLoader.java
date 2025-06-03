package com.aduana.aduana;

import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.aduana.aduana.model.Admin;
import com.aduana.aduana.model.Viajero;
import com.aduana.aduana.model.FuncionarioAduana;
import com.aduana.aduana.repository.AdminRepository;
import com.aduana.aduana.repository.FuncionarioAduanaRepository;
import com.aduana.aduana.repository.ViajeroRepository;

import net.datafaker.Faker;

@Profile("dev")
@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private ViajeroRepository viajeroRepository;

    @Autowired
    private FuncionarioAduanaRepository funcionarioAduanaRepository;

    @Override
    public void run(String... args) throws Exception {
        Faker faker = new Faker();

        // Generar 20 Admins
        for (int i = 0; i < 20; i++) {
            Admin admin = Admin.builder()
                .nombre(faker.name().fullName())
                .rut(faker.idNumber().valid())
                .email(faker.internet().emailAddress())
                .contrasena(faker.internet().password())
                .build();

            adminRepository.save(admin);
        }

        // Generar 20 Viajeros
            // Generar 20 Viajeros
            for (int i = 0; i < 20; i++) {
            Viajero viajero = Viajero.builder()
                .nombre(faker.name().fullName())
                .rut(faker.idNumber().valid())
                .email(faker.internet().emailAddress())
                .contrasena(faker.internet().password())
                .nacionalidad(faker.country().name())
                .fechaNacimiento(faker.date().birthday(18, 90).toInstant()
                    .atZone(java.time.ZoneId.systemDefault())
                    .toLocalDate())
                .build();

            viajeroRepository.save(viajero);
            }


        // Generar 20 Funcionarios de Aduana
        for (int i = 0; i < 20; i++) {
    FuncionarioAduana funcionarioAduana = FuncionarioAduana.builder()
        .nombre(faker.name().fullName())
        .rut(faker.idNumber().valid())
        .email(faker.internet().emailAddress())
        .contrasena(faker.internet().password())
        .especialidad(faker.job().title())
        .organismo(List.of("Aduana", "SAG", "PDI").get(new Random().nextInt(3)))
        .build();

    funcionarioAduanaRepository.save(funcionarioAduana);
}

        System.out.println("✅ Datos aleatorios insertados correctamente (Admins, Viajeros y Funcionarios).");
    }
}
