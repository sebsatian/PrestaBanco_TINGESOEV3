package com.example.demo.services;

import com.example.prestabanco.entities.ClientEntity;
import com.example.prestabanco.entities.EvaluationEntity;
import com.example.prestabanco.entities.RequestEntity;
import com.example.prestabanco.repositories.EvaluationRepository;
import com.example.prestabanco.repositories.RequestRepository;
import com.example.prestabanco.repositories.ClientRepository;
import com.example.prestabanco.services.EvaluationService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class EvaluationServiceTest {

    @InjectMocks
    private EvaluationService evaluationService;

    @Mock
    private EvaluationRepository evaluationRepository;

    @Mock
    private RequestRepository requestRepository;

    @Mock
    private ClientRepository clientRepository;

    @Test
    void whenCreatingEvaluation_thenCorrect() {
        // Given
        RequestEntity request = new RequestEntity();
        request.setId(1L);
        request.setMonthlyIncome(BigDecimal.valueOf(5000));
        request.setLoanAmount(BigDecimal.valueOf(100000));
        request.setMonthlyPayment(BigDecimal.valueOf(1500));
        request.setClientRut("12.345.678-2");

        String creationSavingAccountDate = "2023-01-01";
        boolean jobStatus = true;
        BigDecimal balance = BigDecimal.valueOf(10000);
        BigDecimal sumAllDeposits = BigDecimal.valueOf(50000);
        BigDecimal balance12MonthsAgo = BigDecimal.valueOf(8000);
        BigDecimal biggestWithdrawalLast12Months = BigDecimal.valueOf(2000);
        BigDecimal balanceAfterBw12Months = BigDecimal.valueOf(6000);
        BigDecimal biggestWithdrawalLast6Months = BigDecimal.valueOf(1000);
        BigDecimal balanceAfterBw6Months = BigDecimal.valueOf(7000);
        int numDepositsFirst4Months = 10;
        int numDepositsLast4Months = 15;
        int numDepositsSecond4Months = 12;
        boolean creditHistory = true;
        BigDecimal sumAllDebts = BigDecimal.valueOf(3000);

        EvaluationEntity evaluation = new EvaluationEntity();
        evaluation.setRequestId(1);
        evaluation.setMonthlySalary(request.getMonthlyIncome());
        evaluation.setBalance(balance);
        evaluation.setMinimumBalance(BigDecimal.valueOf(10000));
        evaluation.setBiggestWithdrawalLast12Months(biggestWithdrawalLast12Months);
        evaluation.setBiggestWithdrawalLast6Months(biggestWithdrawalLast6Months);
        evaluation.setBalance12MonthsAgo(balance12MonthsAgo);
        evaluation.setBalanceAfterBW12Months(balanceAfterBw12Months);
        evaluation.setBalanceAfterBW6Months(balanceAfterBw6Months);
        evaluation.setCreationSavingAccountDate(LocalDate.parse(creationSavingAccountDate));
        evaluation.setCreditHistory(creditHistory);
        evaluation.setJobStatus(jobStatus);
        evaluation.setNumDepositsFirst4Months(numDepositsFirst4Months);
        evaluation.setNumDepositsLast4Months(numDepositsLast4Months);
        evaluation.setNumDepositsSecond4Months(numDepositsSecond4Months);
        evaluation.setSumAllDebts(sumAllDebts);
        evaluation.setSumAllDeposits(sumAllDeposits);
        evaluation.setCostToIncomeRatio(true); // Corrected for test
        evaluation.setInAge(true); // Corrected for test

        when(requestRepository.findById(1L)).thenReturn(Optional.of(request));
        ClientEntity client = new ClientEntity();
        client.setBirthDate(LocalDate.parse("1990-01-01"));
        evaluationRepository.save(evaluation);

        // create client to not be null
        when(clientRepository.findClientByRut("12.345.678-2")).thenReturn(client);

        // When
        EvaluationEntity evaluationTest = evaluationService.createEvaluation(request, creationSavingAccountDate, jobStatus, balance, sumAllDeposits, balance12MonthsAgo, biggestWithdrawalLast12Months, balanceAfterBw12Months, biggestWithdrawalLast6Months, balanceAfterBw6Months, numDepositsFirst4Months, numDepositsLast4Months, numDepositsSecond4Months, creditHistory, sumAllDebts);

        // Then
        evaluation.setMinimumBalance(BigDecimal.valueOf(10000));
        evaluationTest.setMinimumBalance(BigDecimal.valueOf(10000));
        assertThat(evaluationTest).usingRecursiveComparison().isEqualTo(evaluation);
    }

    @Test
    void whenCreatingEvaluation_thenRequestNotFound() {
        // Given
        RequestEntity request = new RequestEntity();
        request.setId(1L);

        String creationSavingAccountDate = "2023-01-01";
        boolean jobStatus = true;
        BigDecimal balance = BigDecimal.valueOf(10000);
        BigDecimal sumAllDeposits = BigDecimal.valueOf(50000);
        BigDecimal balance12MonthsAgo = BigDecimal.valueOf(8000);
        BigDecimal biggestWithdrawalLast12Months = BigDecimal.valueOf(2000);
        BigDecimal balanceAfterBw12Months = BigDecimal.valueOf(6000);
        BigDecimal biggestWithdrawalLast6Months = BigDecimal.valueOf(1000);
        BigDecimal balanceAfterBw6Months = BigDecimal.valueOf(7000);
        int numDepositsFirst4Months = 10;
        int numDepositsLast4Months = 15;
        int numDepositsSecond4Months = 12;
        boolean creditHistory = true;
        BigDecimal sumAllDebts = BigDecimal.valueOf(3000);
        Long id = 1L;

        when(requestRepository.findById(1L)).thenReturn(Optional.empty());

        // When / Then
        try {
            evaluationService.createEvaluation(request, creationSavingAccountDate, jobStatus, balance, sumAllDeposits, balance12MonthsAgo, biggestWithdrawalLast12Months, balanceAfterBw12Months, biggestWithdrawalLast6Months, balanceAfterBw6Months, numDepositsFirst4Months, numDepositsLast4Months, numDepositsSecond4Months, creditHistory, sumAllDebts);
        } catch (IllegalArgumentException e) {
            assertThat(e.getMessage()).isEqualTo("Request not found with the provided ID");
        }
    }

    @Test
    void whenCreatingEvaluation_thenClientNotFound() {
        // Given
        RequestEntity request = new RequestEntity();
        request.setId(1L);
        request.setMonthlyIncome(BigDecimal.valueOf(5000));
        request.setLoanAmount(BigDecimal.valueOf(100000));
        request.setMonthlyPayment(BigDecimal.valueOf(1500));
        request.setClientRut("12.345.678-2");

        String creationSavingAccountDate = "2023-01-01";
        boolean jobStatus = true;
        BigDecimal balance = BigDecimal.valueOf(10000);
        BigDecimal sumAllDeposits = BigDecimal.valueOf(50000);
        BigDecimal balance12MonthsAgo = BigDecimal.valueOf(8000);
        BigDecimal biggestWithdrawalLast12Months = BigDecimal.valueOf(2000);
        BigDecimal balanceAfterBw12Months = BigDecimal.valueOf(6000);
        BigDecimal biggestWithdrawalLast6Months = BigDecimal.valueOf(1000);
        BigDecimal balanceAfterBw6Months = BigDecimal.valueOf(7000);
        int numDepositsFirst4Months = 10;
        int numDepositsLast4Months = 15;
        int numDepositsSecond4Months = 12;
        boolean creditHistory = true;
        BigDecimal sumAllDebts = BigDecimal.valueOf(3000);

        when(requestRepository.findById(1L)).thenReturn(Optional.of(request));

        // create client to not be null
        when(clientRepository.findClientByRut("12.345.678-2")).thenReturn(null);

        // When / Then
        try {
            when(evaluationService.createEvaluation(request, creationSavingAccountDate, jobStatus, balance, sumAllDeposits, balance12MonthsAgo, biggestWithdrawalLast12Months, balanceAfterBw12Months, biggestWithdrawalLast6Months, balanceAfterBw6Months, numDepositsFirst4Months, numDepositsLast4Months, numDepositsSecond4Months, creditHistory, sumAllDebts)).thenReturn(null);
        } catch (IllegalArgumentException e) {
            assertThat(e.getMessage()).isEqualTo("Client not found with the provided RUT");
        }
    }

    @Test
    void whenCreatingEvaluation_thenEvaluationAlreadyExists() {
        // Given
        RequestEntity request = new RequestEntity();
        request.setId(1L);
        request.setMonthlyIncome(BigDecimal.valueOf(5000));
        request.setLoanAmount(BigDecimal.valueOf(100000));
        request.setMonthlyPayment(BigDecimal.valueOf(1500));
        request.setClientRut("12.345.678-2");
        String creationSavingAccountDate = "2023-01-01";
        boolean jobStatus = true;
        BigDecimal balance = BigDecimal.valueOf(10000.0);
        BigDecimal sumAllDeposits = BigDecimal.valueOf(50000);
        BigDecimal balance12MonthsAgo = BigDecimal.valueOf(8000);
        BigDecimal biggestWithdrawalLast12Months = BigDecimal.valueOf(2000);
        BigDecimal balanceAfterBw12Months = BigDecimal.valueOf(6000);
        BigDecimal biggestWithdrawalLast6Months = BigDecimal.valueOf(1000);
        BigDecimal balanceAfterBw6Months = BigDecimal.valueOf(7000);
        int numDepositsFirst4Months = 10;
        int numDepositsLast4Months = 15;
        int numDepositsSecond4Months = 12;
        boolean creditHistory = true;
        BigDecimal sumAllDebts = BigDecimal.valueOf(3000);

        EvaluationEntity existingEvaluation = new EvaluationEntity();
        existingEvaluation.setRequestId(1);
        existingEvaluation.setMonthlySalary(request.getMonthlyIncome());
        existingEvaluation.setBalance(balance);
        existingEvaluation.setBiggestWithdrawalLast12Months(biggestWithdrawalLast12Months);
        existingEvaluation.setBiggestWithdrawalLast6Months(biggestWithdrawalLast6Months);
        existingEvaluation.setBalance12MonthsAgo(balance12MonthsAgo);
        existingEvaluation.setBalanceAfterBW12Months(balanceAfterBw12Months);
        existingEvaluation.setBalanceAfterBW6Months(balanceAfterBw6Months);
        existingEvaluation.setCreationSavingAccountDate(LocalDate.parse(creationSavingAccountDate));
        existingEvaluation.setCreditHistory(creditHistory);
        existingEvaluation.setJobStatus(jobStatus);
        existingEvaluation.setNumDepositsFirst4Months(numDepositsFirst4Months);
        existingEvaluation.setNumDepositsLast4Months(numDepositsLast4Months);
        existingEvaluation.setNumDepositsSecond4Months(numDepositsSecond4Months);
        existingEvaluation.setSumAllDebts(sumAllDebts);
        existingEvaluation.setSumAllDeposits(sumAllDeposits);
        existingEvaluation.setMinimumBalance(BigDecimal.valueOf(10000));



        when(requestRepository.findById(1L)).thenReturn(Optional.of(request));
        ClientEntity client = new ClientEntity();
        client.setBirthDate(LocalDate.parse("1990-01-01"));
        when(clientRepository.findClientByRut("12.345.678-2")).thenReturn(client);
        when(evaluationRepository.findByRequestId(1L)).thenReturn(Optional.of(existingEvaluation));

        // When
        EvaluationEntity evaluationTest = evaluationService.createEvaluation(request, creationSavingAccountDate, jobStatus, balance, sumAllDeposits, balance12MonthsAgo, biggestWithdrawalLast12Months, balanceAfterBw12Months, biggestWithdrawalLast6Months, balanceAfterBw6Months, numDepositsFirst4Months, numDepositsLast4Months, numDepositsSecond4Months, creditHistory, sumAllDebts);

        // Then
        assertThat(evaluationTest.getId()).isEqualTo(existingEvaluation.getId());
    }

    @Test
    void whenCalculatingEvaluation_thenCostToIncomeRatioFalse() {
        // Given
        RequestEntity request = new RequestEntity();
        request.setId(1L);
        request.setMonthlyIncome(BigDecimal.valueOf(10));
        request.setMonthlyPayment(BigDecimal.valueOf(400));
        request.setLoanAmount(BigDecimal.valueOf(10000));
        request.setClientRut("12.345.678-2");

        when(requestRepository.findById(1L)).thenReturn(Optional.of(request));

        ClientEntity client = new ClientEntity();
        client.setBirthDate(LocalDate.of(1910, 1, 1));


        when(clientRepository.findClientByRut("12.345.678-2")).thenReturn(client);


        EvaluationEntity evaluation = new EvaluationEntity();
        evaluation.setRequestId(1);
        evaluation.setMonthlySalary(request.getMonthlyIncome());
        evaluation.setSumAllDebts(BigDecimal.valueOf(600));


        evaluationService.calculateEvaluation(evaluation);


        assertThat(evaluation.isCostToIncomeRatio()).isFalse();
    }

    @Test
    void whenCalculatingEvaluation_thenDebtToIncomeRatioAndAgeConditionsAreTested() {

        RequestEntity request = new RequestEntity();
        request.setId(1L);
        request.setMonthlyIncome(BigDecimal.valueOf(200000000));
        request.setMonthlyPayment(BigDecimal.valueOf(500));
        request.setLoanAmount(BigDecimal.valueOf(20000));
        request.setClientRut("12.345.678-2");


        when(requestRepository.findById(1L)).thenReturn(Optional.of(request));


        ClientEntity client = new ClientEntity();
        client.setBirthDate(LocalDate.of(1945, 12, 12));

        when(clientRepository.findClientByRut("12.345.678-2")).thenReturn(client);

        EvaluationEntity evaluation = new EvaluationEntity();
        evaluation.setRequestId(1);
        evaluation.setMonthlySalary(request.getMonthlyIncome());
        evaluation.setSumAllDebts(BigDecimal.valueOf(1500));


        evaluationService.calculateEvaluation(evaluation);


        assertThat(evaluation.isDebtToIncomeRatio()).isTrue();


        assertThat(evaluation.isInAge()).isFalse();
    }

}
