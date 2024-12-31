package com.example.prestabanco.services;

import com.example.prestabanco.entities.BusinessReqEntity;
import com.example.prestabanco.entities.SimulationEntity;
import com.example.prestabanco.repositories.BusinessReqRepository;
import com.example.prestabanco.repositories.ClientRepository;
import com.example.prestabanco.repositories.SimulationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class BusinessReqService {
    @Autowired
    private BusinessReqRepository businessReqRepository;
    @Autowired
    private ClientRepository clientRepository;
    public BusinessReqEntity createBusinessRequest(SimulationEntity simulation,
                                                   byte[] businessPlan,
                                                   byte[] financialStatement,
                                                   byte[] incomeProof,
                                                   byte[] appraisalCertificate,
                                                   byte[] savingsAccount,
                                                   BigDecimal monthlyIncome) {
        int loanType = 3;
        BusinessReqEntity businessReq = new BusinessReqEntity();
        String rut = clientRepository.getClientRutById((long) simulation.getClientId());
        businessReq.setClientRut(rut);
        businessReq.setLoanType(loanType);
        businessReq.setBusinessPlan(businessPlan);
        businessReq.setFinancialStatement(financialStatement);
        businessReq.setBusinessPlan(businessPlan);
        businessReq.setIncomeProof(incomeProof);
        businessReq.setAppraisalCertificate(appraisalCertificate);
        businessReq.setSavingsAccount(savingsAccount);
        businessReq.setCreationDate(java.time.LocalDateTime.now());
        businessReq.setLoanAmount(simulation.getLoanAmount());
        businessReq.setYears(simulation.getYears());
        businessReq.setCurrentStatus("En revisión inicial");
        businessReq.setAnnualInterestRate(BigDecimal.valueOf(simulation.getAnnualInterestRate()));
        businessReq.setMonthlyPayment(simulation.getMonthlyPayment());
        businessReq.setMonthlyIncome(monthlyIncome);
        return businessReqRepository.save(businessReq);

    }
}
