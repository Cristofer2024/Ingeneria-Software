package com.aduana.aduana.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.aduana.aduana.model.Viajero;
import com.aduana.aduana.service.ViajeroService;

import java.util.List;

@RestController
@RequestMapping("/api/viajero")
public class ViajeroController {
    @Autowired
    private ViajeroService viajeroService;

    @GetMapping
    public List<Viajero> getAllViajeros() {
        return viajeroService.findAll();
    }

    @GetMapping("/{id}")
    public Viajero getViajeroById(@PathVariable Long id) {
        return viajeroService.findById(id);
    }

    @PostMapping
    public Viajero createViajero(@RequestBody Viajero viajero) {
        return viajeroService.save(viajero);
    }

    @PutMapping("/{id}")
    public Viajero updateViajero(@PathVariable Integer id, @RequestBody Viajero viajero) {
        viajero.setId(id);
        return viajeroService.save(viajero);
    }

    @DeleteMapping("/{id}")
    public void deleteViajero(@PathVariable Long id) {
        viajeroService.deleteById(id);
    }

    @GetMapping("/buscarPorRut/{rut}")
public boolean existeViajeroPorRut(@PathVariable String rut) {
    return viajeroService.existePorRut(rut);
}

}