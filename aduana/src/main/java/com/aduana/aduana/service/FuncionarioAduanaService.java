package com.aduana.aduana.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aduana.aduana.model.FuncionarioAduana;
import com.aduana.aduana.repository.FuncionarioAduanaRepository;

import java.util.List;

@Service
public class FuncionarioAduanaService {
    @Autowired
    private FuncionarioAduanaRepository funcionarioAduanaRepository;

    public List<FuncionarioAduana> findAll() {
        return funcionarioAduanaRepository.findAll();
    }

    public FuncionarioAduana findById(Long id) {
        return funcionarioAduanaRepository.findById(id).orElse(null);
    }

    public FuncionarioAduana save(FuncionarioAduana funcionarioAduana) {
        return funcionarioAduanaRepository.save(funcionarioAduana);
    }

    public void deleteById(Long id) {
        funcionarioAduanaRepository.deleteById(id);
    }

    public boolean existePorRut(String rut) {
    return funcionarioAduanaRepository.findByRut(rut).isPresent();
}

}