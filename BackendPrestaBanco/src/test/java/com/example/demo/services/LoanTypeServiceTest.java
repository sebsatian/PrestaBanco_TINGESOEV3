package com.example.demo.services;

import com.example.prestabanco.entities.LoanTypeEntity;
import com.example.prestabanco.repositories.LoanTypeRepository;
import com.example.prestabanco.services.LoanTypeService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class LoanTypeServiceTest {

    @InjectMocks
    private LoanTypeService loanTypeService;

    @Mock
    private LoanTypeRepository loanTypeRepository;

    @Test
    void whenGettingLoanTypeById_thenCorrect() {
        // Given
        Long loanTypeId = 1L;
        LoanTypeEntity loanType = new LoanTypeEntity();
        loanType.setId(loanTypeId);
        loanType.setType("Home Loan");
        loanType.setAnnualInterestRate(BigDecimal.valueOf(5.0));
        loanType.setMinInterestRate(BigDecimal.valueOf(100000));
        loanType.setMaxFinance(BigDecimal.valueOf(1000000));
        loanType.setMaximumTerm(5);

        when(loanTypeRepository.findById(loanTypeId)).thenReturn(Optional.of(loanType));

        // When
        LoanTypeEntity loanTypeTest = loanTypeService.getLoanTypeById(loanTypeId);

        // Then
        assertThat(loanTypeTest).isEqualToComparingFieldByField(loanType);
    }


    @Test
    void whenUpdatingLoanType_thenUpdated() {
        // Given
        Long loanTypeId = 1L;
        LoanTypeEntity existingLoanType = new LoanTypeEntity();
        existingLoanType.setId(loanTypeId);
        existingLoanType.setType("Home Loan");
        existingLoanType.setAnnualInterestRate(BigDecimal.valueOf(5.0));
        existingLoanType.setMinInterestRate(BigDecimal.valueOf(100000));
        existingLoanType.setMaxFinance(BigDecimal.valueOf(1000000));
        existingLoanType.setMaximumTerm(5);
        existingLoanType.setMaxInterestRate(BigDecimal.valueOf(6.0));

        LoanTypeEntity updatedLoanType = new LoanTypeEntity();
        updatedLoanType.setType("Personal Loan");
        updatedLoanType.setAnnualInterestRate(BigDecimal.valueOf(4.5));
        updatedLoanType.setMinInterestRate(BigDecimal.valueOf(50000));
        updatedLoanType.setMaxFinance(BigDecimal.valueOf(500000));
        updatedLoanType.setMaximumTerm(10);
        updatedLoanType.setMaxInterestRate(BigDecimal.valueOf(5.5));

        when(loanTypeRepository.findById(loanTypeId)).thenReturn(Optional.of(existingLoanType));
        when(loanTypeRepository.save(existingLoanType)).thenReturn(existingLoanType);

        // When
        LoanTypeEntity result = loanTypeService.updateLoanType(loanTypeId, updatedLoanType);

        // Then
        assertThat(result.getType()).isEqualTo(updatedLoanType.getType());
        assertThat(result.getAnnualInterestRate()).isEqualTo(updatedLoanType.getAnnualInterestRate());
        assertThat(result.getMinInterestRate()).isEqualTo(updatedLoanType.getMinInterestRate());
        assertThat(result.getMaxFinance()).isEqualTo(updatedLoanType.getMaxFinance());
        assertThat(result.getMaximumTerm()).isEqualTo(updatedLoanType.getMaximumTerm());
        assertThat(result.getMaxInterestRate()).isEqualTo(updatedLoanType.getMaxInterestRate());
    }

    @Test
    void whenGettingAllLoanTypes_thenCorrect() {
        // Given
        LoanTypeEntity loanType1 = new LoanTypeEntity();
        loanType1.setId(1L);
        loanType1.setType("Home Loan");
        loanType1.setAnnualInterestRate(BigDecimal.valueOf(5.0));
        loanType1.setMinInterestRate(BigDecimal.valueOf(100000));
        loanType1.setMaxFinance(BigDecimal.valueOf(1000000));
        loanType1.setMaximumTerm(5);

        LoanTypeEntity loanType2 = new LoanTypeEntity();
        loanType2.setId(2L);
        loanType2.setType("Personal Loan");
        loanType2.setAnnualInterestRate(BigDecimal.valueOf(4.5));
        loanType2.setMinInterestRate(BigDecimal.valueOf(50000));
        loanType2.setMaxFinance(BigDecimal.valueOf(500000));
        loanType2.setMaximumTerm(10);

        when(loanTypeRepository.findAll()).thenReturn(List.of(loanType1, loanType2));

        // When
        List<LoanTypeEntity> loanTypes = loanTypeService.getAllLoanTypes();

        // Then
        assertThat(loanTypes).hasSize(2);
        assertThat(loanTypes).containsExactlyInAnyOrder(loanType1, loanType2);
    }

    @Test
    void whenGettingLoanTypeById_thenError() {
        // Given
        Long loanTypeId = 1L;

        when(loanTypeRepository.findById(loanTypeId)).thenReturn(Optional.empty());

        // When
        try {
            loanTypeService.getLoanTypeById(loanTypeId);
        } catch (IllegalArgumentException e) {
            assertThat(e.getMessage()).isEqualTo("Loan type not found with ID: " + loanTypeId);
        }
    }
}