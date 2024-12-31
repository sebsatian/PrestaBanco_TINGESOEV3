package com.example.demo.services;

import com.example.prestabanco.entities.RemodelingReqEntity;
import com.example.prestabanco.entities.SimulationEntity;
import com.example.prestabanco.repositories.RemodelingReqRepository;
import com.example.prestabanco.repositories.ClientRepository;
import com.example.prestabanco.services.RemodelingReqService;
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
public class RemodelingReqServiceTest {

    @InjectMocks
    private RemodelingReqService remodelingReqService;

    @Mock
    private RemodelingReqRepository remodelingReqRepository;

    @Mock
    private ClientRepository clientRepository;

    @Test
    void whenCreatingRemodelingReq_thenCorrect() {

        SimulationEntity simulation = new SimulationEntity();
        simulation.setClientId(1);
        simulation.setLoanAmount(BigDecimal.valueOf(100000));
        simulation.setYears(10);
        simulation.setAnnualInterestRate(5.0f);
        simulation.setMonthlyPayment(BigDecimal.valueOf(1000));

        byte[] incomeProof = new byte[]{1, 2, 3};
        byte[] appraisalCertificate = new byte[]{4, 5, 6};
        byte[] savingsAccount = new byte[]{7, 8, 9};
        byte[] remodelingBudget = new byte[]{10, 11, 12};
        BigDecimal monthlyIncome = BigDecimal.valueOf(5000);

        RemodelingReqEntity remodelingReq = new RemodelingReqEntity();
        remodelingReq.setClientRut("12.345.678-2");
        remodelingReq.setLoanType(4);
        remodelingReq.setIncomeProof(incomeProof);
        remodelingReq.setAppraisalCertificate(appraisalCertificate);
        remodelingReq.setSavingsAccount(savingsAccount);
        remodelingReq.setRemodelingBudget(remodelingBudget);
        remodelingReq.setCreationDate(LocalDateTime.now());
        remodelingReq.setLoanAmount(simulation.getLoanAmount());
        remodelingReq.setYears(simulation.getYears());
        remodelingReq.setCurrentStatus("En revisión inicial");
        remodelingReq.setAnnualInterestRate(BigDecimal.valueOf(simulation.getAnnualInterestRate()));
        remodelingReq.setMonthlyPayment(simulation.getMonthlyPayment());
        remodelingReq.setMonthlyIncome(monthlyIncome);


        when(clientRepository.getClientRutById(1L)).thenReturn("12.345.678-2");


        when(remodelingReqRepository.save(org.mockito.ArgumentMatchers.any(RemodelingReqEntity.class))).thenReturn(remodelingReq);


        RemodelingReqEntity remodelingReqTest = remodelingReqService.createRemodelingReq(simulation, incomeProof, appraisalCertificate, savingsAccount, remodelingBudget, monthlyIncome);


        assertThat(remodelingReqTest).isEqualToComparingFieldByField(remodelingReq);
    }
}