package com.example.prestabanco.services;

import com.example.prestabanco.entities.EvaluationEntity;
import com.example.prestabanco.entities.RequestEntity;
import com.example.prestabanco.entities.SavingCapacityEntity;
import com.example.prestabanco.repositories.EvaluationRepository;
import com.example.prestabanco.repositories.RequestRepository;
import com.example.prestabanco.repositories.SavingCapacityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Period;

@Service
public class SavingCapacityService {
    @Autowired
    private SavingCapacityRepository savingCapacityRepository;
    @Autowired
    private EvaluationRepository evaluationRepository;
    @Autowired
    private RequestRepository requestRepository;

    public void evaluateSavingCapacity(EvaluationEntity evaluation) {

        // Check if the evaluation entity exists, in case it exist, update the evaluation
        SavingCapacityEntity savingCapacity = savingCapacityRepository.findByRequestId(evaluation.getRequestId());
        if (savingCapacity == null) {
            savingCapacity = new SavingCapacityEntity();
        }


        // 1- The client must have at least 10% of the loan amount in their savings account
        BigDecimal tenPercent = BigDecimal.valueOf(0.1); // 10%

        //Obtain the request id from the evaluation entity
        int requestId = evaluation.getRequestId();

        //Obtain the request entity from the evaluation entity
        RequestEntity request = requestRepository.findById((long) requestId).orElse(null);

        //Obtain the loan amount from the request entity
        BigDecimal loanAmount = request.getLoanAmount();

        // Obtain the 10% of the loan amount
        BigDecimal tenPercentOfLoanAmount = loanAmount.multiply(tenPercent);

        // If the balance of the savings account is greater than the 10% of the loan amount
        if (evaluation.getBalance().compareTo(tenPercentOfLoanAmount) >= 0) {
            savingCapacity.setMinAmount(true);
        } else {
            savingCapacity.setMinAmount(false);
        }

        // 2- The client must have at least 12 months with the savings account and didn't make any withdrawals
        // over 50% of the balance, plus, the actual balance must be greater than 12 months ago


        // Obtain the biggest withdrawal last 12 months and the balance after that withdrawal
        BigDecimal biggestWithdrawalLast12Months = evaluation.getBiggestWithdrawalLast12Months();
        BigDecimal balanceAfterBw12Months = evaluation.getBalanceAfterBW12Months();


        // Obtain the balance 12 months ago and the current balance
        BigDecimal balance12MonthsAgo = evaluation.getBalance12MonthsAgo();
        BigDecimal balance = evaluation.getBalance();

        System.out.println("biggest withdrawal last 12 months: " + biggestWithdrawalLast12Months);
        System.out.println("balance after bw 12 months: " + balanceAfterBw12Months);
        System.out.println("balance 12 months ago: " + balance12MonthsAgo);
        // If the balance after the biggest withdrawal last 12 months is greater than the biggest withdrawal last 12 months
        if (balanceAfterBw12Months.compareTo(biggestWithdrawalLast12Months) > 0 && balance.compareTo(balance12MonthsAgo)> 0) {

            savingCapacity.setConsistentHistory(true);
        } else {
            savingCapacity.setConsistentHistory(false);
        }

        // 3- The client must have at least 1 deposit per trimester in the last 12 months and
        // the sum of all deposits must be greater than the sum of the 5% of the annual income

        // Obtain the number of deposits in each trimester
        int numDepositsFirst4Months = evaluation.getNumDepositsFirst4Months();
        int numDepositsLast4Months = evaluation.getNumDepositsLast4Months();
        int numDepositsSecond4Months = evaluation.getNumDepositsSecond4Months();

        // Obtain the sum of all deposits
        BigDecimal sumAllDeposits = evaluation.getSumAllDeposits();

        // Obtain the 5% of the annual income
        BigDecimal fivePercent = BigDecimal.valueOf(0.05); // 5%
        BigDecimal annualIncome = evaluation.getMonthlySalary().multiply(BigDecimal.valueOf(12));
        BigDecimal fivePercentOfAnnualIncome = annualIncome.multiply(fivePercent);

        // If the number of deposits in each trimester is less than 1 or the sum of all deposits is less
        // than the 5% of the annual income
        if (numDepositsFirst4Months < 1 || numDepositsLast4Months < 1 || numDepositsSecond4Months < 1 ||
                sumAllDeposits.compareTo(fivePercentOfAnnualIncome) < 0) {
            savingCapacity.setPeriodicDeposits(false);
        } else {
            savingCapacity.setPeriodicDeposits(true);
        }


        // 4- If the client has less than 2 years with the savings account, the balance must be
        // at least the 20% of the loan amount

        // Obtain the creation date of the savings account
        LocalDate creationSavingAccountDate = evaluation.getCreationSavingAccountDate();

        // Calculate the years the client has with the savings account
        LocalDate currentDate = LocalDate.now();
        Period period = Period.between(creationSavingAccountDate, currentDate);
        int years = period.getYears();
        // Obtain the 20% of the loan amount by multiplying the 10% of the loan amount by 2
        BigDecimal twentyPercentOfLoanAmount = tenPercentOfLoanAmount.multiply(BigDecimal.valueOf(2));

        // If the years the client has with the savings account is less than 2 years and the balance isn't at least
        // the 20% of the loan amount or the client has more than 2 years with the savings account
        // and the balance is less than the 10% of the loan amount
        if ((years < 2 && evaluation.getBalance().compareTo(twentyPercentOfLoanAmount) <= 0) ||
                (years >= 2 && evaluation.getBalance().compareTo(tenPercentOfLoanAmount) < 0)) {
            savingCapacity.setRelationAmountYears(false);
        } else {
            savingCapacity.setRelationAmountYears(true);
        }

        // 5- The client must not have retired more than 30% of the balance in the last 6 months

        // Obtain the biggest withdrawal last 6 months and the balance after that withdrawal
        BigDecimal biggestWithdrawalLast6Months = evaluation.getBiggestWithdrawalLast6Months();
        BigDecimal balanceAfterBw6Months = evaluation.getBalanceAfterBW6Months();

        // Calculate the balance before the biggest withdrawal last 6 months
        BigDecimal balanceBeforeBw6Months = balanceAfterBw6Months.add(biggestWithdrawalLast6Months);

        // If the biggest withdrawal last 6 months is greater than the 30% of the balance before that withdrawal
        if (biggestWithdrawalLast6Months.compareTo(balanceBeforeBw6Months.multiply(BigDecimal.valueOf(0.3))) > 0) {
            savingCapacity.setRecentWithdrawals(false);
        } else {
            savingCapacity.setRecentWithdrawals(true);
        }

        // Set the results of the saving capacity
        setResults(savingCapacity);

        // Set the request id
        savingCapacity.setRequestId(evaluation.getRequestId());

        // Save the saving capacity
        savingCapacityRepository.save(savingCapacity);

        System.out.println("Saving capacity evaluated successfully");
    }

    public void setResults(SavingCapacityEntity savingCapacity) {
        int trueValues = 0;
        if (savingCapacity.isMinAmount()) {
            trueValues++;
        }
        if (savingCapacity.isConsistentHistory()) {
            trueValues++;
        }
        if (savingCapacity.isPeriodicDeposits()) {
            trueValues++;
        }
        if (savingCapacity.isRelationAmountYears()) {
            trueValues++;
        }
        if (savingCapacity.isRecentWithdrawals()) {
            trueValues++;
        }

        // If the number of true values is 2 or less
        if (trueValues <= 2) {
            savingCapacity.setCapacityResult("insuficiente");
        }
        // If the number of true values is 3 or 4
        else if (trueValues == 3 || trueValues == 4) {
            savingCapacity.setCapacityResult("moderada");
        }
        // If the number of true values is 5
        else {
            savingCapacity.setCapacityResult("sólida");
        }
    }
}

