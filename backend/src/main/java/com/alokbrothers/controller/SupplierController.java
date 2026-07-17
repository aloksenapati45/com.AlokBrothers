package com.alokbrothers.controller;

import com.alokbrothers.model.Supplier;
import com.alokbrothers.repository.SupplierRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierRepository supplierRepository;

    public SupplierController(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    @GetMapping
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    @PostMapping
    public Supplier createSupplier(@RequestBody Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    @PutMapping("/{id}")
    public Supplier updateSupplier(@PathVariable Long id, @RequestBody Supplier updated) {
        Supplier s = supplierRepository.findById(id).orElseThrow();
        s.setName(updated.getName());
        s.setContact(updated.getContact());
        s.setPhone(updated.getPhone());
        s.setEmail(updated.getEmail());
        s.setCity(updated.getCity());
        s.setState(updated.getState());
        s.setFishTypes(updated.getFishTypes());
        s.setPricePer(updated.getPricePer());
        s.setMinOrder(updated.getMinOrder());
        s.setReliability(updated.getReliability());
        s.setPayTerms(updated.getPayTerms());
        s.setStatus(updated.getStatus());
        s.setLastPurchase(updated.getLastPurchase());
        s.setTotalPurchased(updated.getTotalPurchased());
        return supplierRepository.save(s);
    }

    @DeleteMapping("/{id}")
    public void deleteSupplier(@PathVariable Long id) {
        supplierRepository.deleteById(id);
    }
}
