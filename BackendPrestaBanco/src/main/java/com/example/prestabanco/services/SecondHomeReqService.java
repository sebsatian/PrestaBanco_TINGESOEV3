package com.example.prestabanco.services;
import com.example.prestabanco.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.prestabanco.entities.SecondHomeReqEntity;
import com.example.prestabanco.entities.SimulationEntity;
import com.example.prestabanco.repositories.SecondHomeReqRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;


@Service
public class SecondHomeReqService {

    @Autowired
    private SecondHomeReqRepository secondHomeReqRepository;
    @Autowired
    private ClientRepository clientRepository;
    public SecondHomeReqEntity createSecondHomeRequest(SimulationEntity simulation,
                                                       byte[] appraisalCertificate,
                                                       byte[] incomeProof,
                                                       byte[] savingsAccount,
                                                       byte[] jobContract,
                                                       byte[] creditHistory,
                                                       byte[] firstHomeDeed,
                                                       BigDecimal monthlyIncome) {
        int loanType = 2;
        SecondHomeReqEntity secondHomeRequest = new SecondHomeReqEntity();

        String rut = clientRepository.getClientRutById((long) simulation.getClientId());
        secondHomeRequest.setClientRut(rut);
        secondHomeRequest.setLoanType(loanType);
        secondHomeRequest.setCreditHistory(creditHistory);
        secondHomeRequest.setSavingsAccount(savingsAccount);
        secondHomeRequest.setJobContract(jobContract);
        secondHomeRequest.setIncomeProof(incomeProof);
        secondHomeRequest.setAppraisalCertificate(appraisalCertificate);
        secondHomeRequest.setCreationDate(LocalDateTime.now());
        secondHomeRequest.setLoanAmount(simulation.getLoanAmount());
        secondHomeRequest.setYears(simulation.getYears());
        secondHomeRequest.setCurrentStatus("En revisión inicial");
        secondHomeRequest.setAnnualInterestRate(BigDecimal.valueOf(simulation.getAnnualInterestRate()));
        secondHomeRequest.setMonthlyPayment(simulation.getMonthlyPayment());
        secondHomeRequest.setMonthlyIncome(monthlyIncome);
        secondHomeRequest.setFirstHomeDeed(firstHomeDeed);

        return secondHomeReqRepository.save(secondHomeRequest);
    }
}
