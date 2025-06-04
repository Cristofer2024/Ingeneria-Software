package com.aduana.aduana.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aduana.aduana.model.Viajero;
import com.aduana.aduana.repository.ViajeroRepository;

import java.util.List;

@Service
public class ViajeroService {
    @Autowired
    private ViajeroRepository viajeroRepository;

    public List<Viajero> findAll() {
        return viajeroRepository.findAll();
    }

    public Viajero findById(Long id) {
        return viajeroRepository.findById(id).orElse(null);
    }

    public Viajero save(Viajero viajero) {
        return viajeroRepository.save(viajero);
    }

    public void deleteById(Long id) {
        viajeroRepository.deleteById(id);
    }

    public boolean existePorRut(String rut) {
    return viajeroRepository.findByRut(rut).isPresent();
}

}