package com.example.demo.services;

import com.example.prestabanco.entities.FirstHomeReqEntity;
import com.example.prestabanco.entities.SimulationEntity;
import com.example.prestabanco.repositories.FirstHomeReqRepository;
import com.example.prestabanco.repositories.ClientRepository;
import com.example.prestabanco.services.FirstHomeReqService;
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
public class FirstHomeReqServiceTest {

    @InjectMocks
    private FirstHomeReqService firstHomeReqService;

    @Mock
    private FirstHomeReqRepository firstHomeReqRepository;

    @Mock
    private ClientRepository clientRepository;

    @Test
    void whenCreatingFirstHomeRequest_thenCorrect() {
        // Given
        SimulationEntity simulation = new SimulationEntity();
        simulation.setClientId(1);
        simulation.setLoanAmount(BigDecimal.valueOf(100000));
        simulation.setYears(10);
        simulation.setAnnualInterestRate(5.0f);
        simulation.setMonthlyPayment(BigDecimal.valueOf(1000));

        byte[] appraisalCertificate = new byte[]{1, 2, 3};
        byte[] incomeProof = new byte[]{4, 5, 6};
        byte[] savingsAccountBytes = new byte[]{7, 8, 9};
        byte[] jobContract = new byte[]{10, 11, 12};
        byte[] creditHistory = new byte[]{13, 14, 15};
        BigDecimal monthlyIncome = BigDecimal.valueOf(5000);

        FirstHomeReqEntity firstHomeReq = new FirstHomeReqEntity();
        firstHomeReq.setClientRut("12.345.678-2");
        firstHomeReq.setLoanType(1);
        firstHomeReq.setAppraisalCertificate(appraisalCertificate);
        firstHomeReq.setIncomeProof(incomeProof);
        firstHomeReq.setSavingsAccount(savingsAccountBytes);
        firstHomeReq.setJobContract(jobContract);
        firstHomeReq.setCreditHistory(creditHistory);
        firstHomeReq.setCreationDate(LocalDateTime.now());
        firstHomeReq.setLoanAmount(simulation.getLoanAmount());
        firstHomeReq.setYears(simulation.getYears());
        firstHomeReq.setCurrentStatus("En revisión inicial");
        firstHomeReq.setAnnualInterestRate(BigDecimal.valueOf(simulation.getAnnualInterestRate()));
        firstHomeReq.setMonthlyPayment(simulation.getMonthlyPayment());
        firstHomeReq.setMonthlyIncome(monthlyIncome);

        when(clientRepository.getClientRutById(1L)).thenReturn("12.345.678-2");

        when(firstHomeReqRepository.save(org.mockito.ArgumentMatchers.any(FirstHomeReqEntity.class))).thenReturn(firstHomeReq);

        FirstHomeReqEntity firstHomeReqTest = firstHomeReqService.createFirstHomeRequest(simulation, appraisalCertificate, incomeProof, savingsAccountBytes, jobContract, creditHistory, monthlyIncome);

        assertThat(firstHomeReqTest).isEqualToComparingFieldByField(firstHomeReq);
    }
}