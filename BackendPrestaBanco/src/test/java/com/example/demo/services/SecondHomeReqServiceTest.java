package com.example.demo.services;

import com.example.prestabanco.entities.SecondHomeReqEntity;
import com.example.prestabanco.entities.SimulationEntity;
import com.example.prestabanco.repositories.SecondHomeReqRepository;
import com.example.prestabanco.repositories.ClientRepository;
import com.example.prestabanco.services.SecondHomeReqService;
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
public class SecondHomeReqServiceTest {

    @InjectMocks
    private SecondHomeReqService secondHomeReqService;

    @Mock
    private SecondHomeReqRepository secondHomeReqRepository;

    @Mock
    private ClientRepository clientRepository;

    @Test
    void whenCreatingSecondHomeRequest_thenCorrect() {
        // Given
        SimulationEntity simulation = new SimulationEntity();
        simulation.setClientId(1);
        simulation.setLoanAmount(BigDecimal.valueOf(100000));
        simulation.setYears(10);
        simulation.setAnnualInterestRate(5.0f);
        simulation.setMonthlyPayment(BigDecimal.valueOf(1000));

        byte[] appraisalCertificate = new byte[]{1, 2, 3};
        byte[] incomeProof = new byte[]{4, 5, 6};
        byte[] savingsAccount = new byte[]{7, 8, 9};
        byte[] jobContract = new byte[]{10, 11, 12};
        byte[] creditHistory = new byte[]{13, 14, 15};
        byte[] firstHomeDeed = new byte[]{16, 17, 18};
        BigDecimal monthlyIncome = BigDecimal.valueOf(5000);

        SecondHomeReqEntity secondHomeReq = new SecondHomeReqEntity();
        secondHomeReq.setClientRut("12.345.678-2");
        secondHomeReq.setLoanType(2);
        secondHomeReq.setAppraisalCertificate(appraisalCertificate);
        secondHomeReq.setIncomeProof(incomeProof);
        secondHomeReq.setSavingsAccount(savingsAccount);
        secondHomeReq.setJobContract(jobContract);
        secondHomeReq.setCreditHistory(creditHistory);
        secondHomeReq.setFirstHomeDeed(firstHomeDeed);
        secondHomeReq.setCreationDate(LocalDateTime.now());
        secondHomeReq.setLoanAmount(simulation.getLoanAmount());
        secondHomeReq.setYears(simulation.getYears());
        secondHomeReq.setCurrentStatus("En revisión inicial");
        secondHomeReq.setAnnualInterestRate(BigDecimal.valueOf(simulation.getAnnualInterestRate()));
        secondHomeReq.setMonthlyPayment(simulation.getMonthlyPayment());
        secondHomeReq.setMonthlyIncome(monthlyIncome);

        when(clientRepository.getClientRutById(1L)).thenReturn("12.345.678-2");

        when(secondHomeReqRepository.save(org.mockito.ArgumentMatchers.any(SecondHomeReqEntity.class))).thenReturn(secondHomeReq);

        SecondHomeReqEntity secondHomeReqTest = secondHomeReqService.createSecondHomeRequest(simulation, appraisalCertificate, incomeProof, savingsAccount, jobContract, creditHistory, firstHomeDeed, monthlyIncome);

        assertThat(secondHomeReqTest).isEqualToComparingFieldByField(secondHomeReq);
    }
}