package com.aduana.aduana.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.aduana.aduana.model.Admin;
import com.aduana.aduana.service.AdminService;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    private AdminService adminService;

    @GetMapping
    public List<Admin> getAllAdmins() {
        return adminService.findAll();
    }

    @GetMapping("/{id}")
    public Admin getAdminById(@PathVariable Long id) {
        return adminService.findById(id);
    }
    // @PostMapping
    // public String registrarAdmin(@RequestBody Admin admin) {
    //     System.out.println("Nuevo Admin registrado: " + admin);
    //     return "Admin registrado correctamente!";
    
    @PostMapping
    public Admin createAdmin(@RequestBody Admin admin) {
        return adminService.save(admin);
    }

    @PutMapping("/{id}")
    public Admin updateAdmin(@PathVariable Integer id, @RequestBody Admin admin) {
        admin.setId(id);
        return adminService.save(admin);
    }

    @DeleteMapping("/{id}")
    public void deleteAdmin(@PathVariable Long id) {
        adminService.deleteById(id);
    }

    @GetMapping("/buscarPorRut/{rut}")
public boolean existeAdminPorRut(@PathVariable String rut) {
    return adminService.existePorRut(rut);
}

}