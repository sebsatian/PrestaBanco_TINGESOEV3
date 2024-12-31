package com.example.prestabanco.services;

import com.example.prestabanco.entities.LoanTypeEntity;
import com.example.prestabanco.repositories.LoanTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LoanTypeService {

    @Autowired
    private LoanTypeRepository loanTypeRepository;

    public LoanTypeEntity getLoanTypeById(Long loanTypeId) {
        Optional<LoanTypeEntity> loanTypeOpt = loanTypeRepository.findById(loanTypeId);
        if (loanTypeOpt.isPresent()) {
            return loanTypeOpt.get();
        } else {
            throw new IllegalArgumentException("Loan type not found with ID: " + loanTypeId);
        }
    }

    public LoanTypeEntity updateLoanType(Long loanTypeId, LoanTypeEntity updatedLoanType) {
        LoanTypeEntity existingLoanType = loanTypeRepository.findById(loanTypeId)
                .orElseThrow(() -> new IllegalArgumentException("Loan type not found with ID: " + loanTypeId));

        existingLoanType.setType(updatedLoanType.getType());
        existingLoanType.setMaximumTerm(updatedLoanType.getMaximumTerm());
        existingLoanType.setMaxFinance(updatedLoanType.getMaxFinance());
        existingLoanType.setMinInterestRate(updatedLoanType.getMinInterestRate());
        existingLoanType.setMaxInterestRate(updatedLoanType.getMaxInterestRate());
        existingLoanType.setAnnualInterestRate(updatedLoanType.getAnnualInterestRate());

        return loanTypeRepository.save(existingLoanType);
    }

    public List<LoanTypeEntity> getAllLoanTypes() {
        return loanTypeRepository.findAll();
    }
}