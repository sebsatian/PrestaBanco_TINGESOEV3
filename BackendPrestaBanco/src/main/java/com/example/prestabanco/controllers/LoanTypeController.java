package com.example.prestabanco.controllers;

import com.example.prestabanco.entities.LoanTypeEntity;
import com.example.prestabanco.services.LoanTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/loan-types")
@CrossOrigin("*")
public class LoanTypeController {

    @Autowired
    private LoanTypeService loanTypeService;

    // Endpoint to get a loan type by ID
    @GetMapping("/{loanTypeId}")
    public ResponseEntity<?> getLoanTypeById(@PathVariable Long loanTypeId) {
        try {
            LoanTypeEntity loanType = loanTypeService.getLoanTypeById(loanTypeId);
            return ResponseEntity.ok(loanType);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An unexpected error occurred");
        }
    }

    // Endpoint to update a loan type by ID
    @PutMapping("/{loanTypeId}")
    public ResponseEntity<?> updateLoanType(@PathVariable Long loanTypeId, @RequestBody LoanTypeEntity updatedLoanType) {
        try {
            LoanTypeEntity loanType = loanTypeService.updateLoanType(loanTypeId, updatedLoanType);
            return ResponseEntity.ok(loanType);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An unexpected error occurred");
        }
    }

    // Endpoint to get all loan types
    @GetMapping
    public ResponseEntity<?> getAllLoanTypes() {
        try {
            List<LoanTypeEntity> loanTypes = loanTypeService.getAllLoanTypes();
            return ResponseEntity.ok(loanTypes);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An unexpected error occurred");
        }
    }
}