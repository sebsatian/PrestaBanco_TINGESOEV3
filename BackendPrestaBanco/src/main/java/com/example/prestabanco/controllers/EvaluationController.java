package com.example.prestabanco.controllers;

import com.example.prestabanco.entities.EvaluationEntity;
import com.example.prestabanco.entities.RequestEntity;
import com.example.prestabanco.repositories.EvaluationRepository;
import com.example.prestabanco.services.EvaluationService;
import com.example.prestabanco.services.SavingCapacityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@RestController
@RequestMapping("/evaluation")
@CrossOrigin("*")
public class EvaluationController {
    @Autowired
    private EvaluationService evaluationService;
    @Autowired
    private EvaluationRepository evaluationRepository;
    @Autowired
    private SavingCapacityService savingCapacityService;

    @PostMapping("/evaluate")
    public void evaluateRequest(
            @RequestBody RequestEntity request,
            @RequestParam String creationSavingAccountDate,
            @RequestParam boolean jobStatus,
            @RequestParam BigDecimal balance,
            @RequestParam BigDecimal sumAllDeposits,
            @RequestParam BigDecimal balance12MonthsAgo,
            @RequestParam BigDecimal biggestWithdrawalLast12Months,
            @RequestParam BigDecimal balanceAfterBw12Months,
            @RequestParam BigDecimal biggestWithdrawalLast6Months,
            @RequestParam BigDecimal balanceAfterBw6Months,
            @RequestParam int numDepositsFirst4Months,
            @RequestParam int numDepositsLast4Months,
            @RequestParam int numDepositsSecond4Months,
            @RequestParam boolean creditHistory,
            @RequestParam BigDecimal sumAllDebts) {
        try {
            EvaluationEntity evaluation =  evaluationService.createEvaluation(request,
                    creationSavingAccountDate,
                    jobStatus,
                    balance,
                    sumAllDeposits,
                    balance12MonthsAgo,
                    biggestWithdrawalLast12Months,
                    balanceAfterBw12Months,
                    biggestWithdrawalLast6Months,
                    balanceAfterBw6Months,
                    numDepositsFirst4Months,
                    numDepositsLast4Months,
                    numDepositsSecond4Months,
                    creditHistory,
                    sumAllDebts);

            evaluationRepository.save(evaluation);
            // Calculate the saving capacity
            savingCapacityService.evaluateSavingCapacity(evaluation);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error al procesar la solicitud");
        }
    }

    // Get the evaluation by request id
    @GetMapping("/{id}")
    public EvaluationEntity getEvaluationByRequestId(@PathVariable Long id) {
        return evaluationRepository.findByRequestId(id).orElse(null);
    }
}