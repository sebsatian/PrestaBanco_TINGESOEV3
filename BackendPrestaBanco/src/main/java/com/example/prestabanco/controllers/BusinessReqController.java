package com.example.prestabanco.controllers;

import com.example.prestabanco.entities.BusinessReqEntity;
import com.example.prestabanco.entities.SimulationEntity;
import com.example.prestabanco.services.BusinessReqService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@RestController
@RequestMapping("/businessreq")
@CrossOrigin("*")
public class BusinessReqController {
    @Autowired
    private BusinessReqService businessReqService;

    @PostMapping("/create")
    public BusinessReqEntity createBusinessRequest(
            @RequestPart("simulation") SimulationEntity simulation,
            @RequestPart("businessPlan") MultipartFile businessPlan,
            @RequestPart("financialStatement") MultipartFile financialStatement,
            @RequestPart("incomeProof") MultipartFile incomeProof,
            @RequestPart("savingsAccount") MultipartFile savingsAccount,
            @RequestPart("appraisalCertificate") MultipartFile appraisalCertificate,
            @RequestParam("monthlyIncome") BigDecimal monthlyIncome) {
        try {
            // Obtener los bytes de los archivos
            byte[] businessPlanBytes = businessPlan.getBytes();
            byte[] financialStatementBytes = financialStatement.getBytes();
            byte[] incomeProofBytes = incomeProof.getBytes();
            byte[] appraisalCertificateBytes = appraisalCertificate.getBytes();
            byte[] savingsAccountBytes = savingsAccount.getBytes();

            // Imprimir información para depuración
            System.out.println("Business Plan Size: " + businessPlanBytes.length);
            System.out.println("Financial Statement Size: " + financialStatementBytes.length);
            System.out.println("Income Proof Size: " + incomeProofBytes.length);
            System.out.println("Appraisal Certificate Size: " + appraisalCertificateBytes.length);
            System.out.println("Simulation: " + simulation);
            System.out.println("Monthly Income: " + monthlyIncome);

            return businessReqService.createBusinessRequest(
                    simulation,
                    businessPlanBytes,
                    financialStatementBytes,
                    incomeProofBytes,
                    appraisalCertificateBytes,
                    savingsAccountBytes,
                    monthlyIncome);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error al procesar la solicitud");
        }
    }
}