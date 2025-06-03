package com.aduana.aduana.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.aduana.aduana.model.FuncionarioAduana;
import com.aduana.aduana.service.FuncionarioAduanaService;

import java.util.List;

@RestController
@RequestMapping("/api/funcionario_aduana")
public class FuncionarioAduanaController {
    @Autowired
    private FuncionarioAduanaService funcionarioAduanaService;

    @GetMapping
    public List<FuncionarioAduana> getAllFuncionarios() {
        return funcionarioAduanaService.findAll();
    }

    @GetMapping("/{id}")
    public FuncionarioAduana getFuncionarioById(@PathVariable Integer id) {
        return funcionarioAduanaService.findById(id);
    }

    @PostMapping
    public FuncionarioAduana createFuncionario(@RequestBody FuncionarioAduana funcionarioAduana) {
        return funcionarioAduanaService.save(funcionarioAduana);
    }

    @PutMapping("/{id}")
    public FuncionarioAduana updateFuncionario(@PathVariable Integer id, @RequestBody FuncionarioAduana funcionarioAduana) {
        funcionarioAduana.setId(id);
        return funcionarioAduanaService.save(funcionarioAduana);
    }

    @DeleteMapping("/{id}")
    public void deleteFuncionario(@PathVariable Integer id) {
        funcionarioAduanaService.deleteById(id);
    }

    @GetMapping("/buscarPorRut/{rut}")
    public boolean existeFuncionarioPorRut(@PathVariable String rut) {
    return funcionarioAduanaService.existePorRut(rut);
}

}