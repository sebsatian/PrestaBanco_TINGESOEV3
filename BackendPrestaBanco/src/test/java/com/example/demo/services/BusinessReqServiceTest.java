package com.example.demo.services;

import com.example.prestabanco.entities.BusinessReqEntity;
import com.example.prestabanco.entities.SimulationEntity;
import com.example.prestabanco.repositories.BusinessReqRepository;
import com.example.prestabanco.repositories.ClientRepository;
import com.example.prestabanco.services.BusinessReqService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class BusinessReqServiceTest {

    @InjectMocks
    private BusinessReqService businessReqService;

    @Mock
    private BusinessReqRepository businessReqRepository;

    @Mock
    private ClientRepository clientRepository;

    @Test
    void whenCreatingBusinessRequest_thenCorrect() {
        // Given
        SimulationEntity simulation = new SimulationEntity();
        simulation.setClientId(1);
        simulation.setLoanAmount(BigDecimal.valueOf(100000));
        simulation.setYears(10);
        simulation.setAnnualInterestRate(5.0f);
        simulation.setMonthlyPayment(BigDecimal.valueOf(1000));

        byte[] businessPlan = new byte[]{1, 2, 3};
        byte[] financialStatement = new byte[]{4, 5, 6};
        byte[] incomeProof = new byte[]{7, 8, 9};
        byte[] appraisalCertificate = new byte[]{10, 11, 12};
        byte[] savingsAccount = new byte[]{13, 14, 15};
        BigDecimal monthlyIncome = BigDecimal.valueOf(5000);

        BusinessReqEntity businessReq = new BusinessReqEntity();
        businessReq.setClientRut("12.345.678-2");
        businessReq.setLoanType(3);
        businessReq.setBusinessPlan(businessPlan);
        businessReq.setFinancialStatement(financialStatement);
        businessReq.setIncomeProof(incomeProof);
        businessReq.setAppraisalCertificate(appraisalCertificate);
        businessReq.setSavingsAccount(savingsAccount);
        businessReq.setCreationDate(LocalDateTime.now());
        businessReq.setLoanAmount(simulation.getLoanAmount());
        businessReq.setYears(simulation.getYears());
        businessReq.setCurrentStatus("En revisión inicial");
        businessReq.setAnnualInterestRate(BigDecimal.valueOf(simulation.getAnnualInterestRate()));
        businessReq.setMonthlyPayment(simulation.getMonthlyPayment());
        businessReq.setMonthlyIncome(monthlyIncome);

        // Simula que el método getClientRutById devuelve el RUT del cliente
        when(clientRepository.getClientRutById(1L)).thenReturn("12.345.678-2");

        // Simula que el método save devuelve la solicitud de negocio que se pasa como argumento
        when(businessReqRepository.save(org.mockito.ArgumentMatchers.any(BusinessReqEntity.class))).thenReturn(businessReq);

        // When
        BusinessReqEntity businessReqTest = businessReqService.createBusinessRequest(simulation, businessPlan, financialStatement, incomeProof, appraisalCertificate, savingsAccount, monthlyIncome);

        // Then
        assertThat(businessReqTest).isEqualToComparingFieldByField(businessReq);
    }
}