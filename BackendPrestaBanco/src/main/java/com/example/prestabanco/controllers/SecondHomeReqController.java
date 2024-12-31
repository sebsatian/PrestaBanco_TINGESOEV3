package com.example.prestabanco.controllers;

import com.example.prestabanco.entities.SecondHomeReqEntity;
import com.example.prestabanco.entities.SimulationEntity;
import com.example.prestabanco.services.SecondHomeReqService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@RestController
@RequestMapping("/secondhomereq")
@CrossOrigin("*")
public class SecondHomeReqController {
    @Autowired
    private SecondHomeReqService secondHomeReqService;

    @PostMapping("/create")
    public SecondHomeReqEntity createSecondHomeRequest(
            @RequestPart("simulation") SimulationEntity simulation,
            @RequestPart("appraisalCertificate") MultipartFile appraisalCertificate,
            @RequestPart("incomeProof") MultipartFile incomeProof,
            @RequestPart("savingsAccount") MultipartFile savingsAccount,
            @RequestPart("jobContract") MultipartFile jobContract,
            @RequestPart("creditHistory") MultipartFile creditHistory,
            @RequestPart("firstHomeDeed") MultipartFile firstHomeDeed,
            @RequestParam("monthlyIncome") BigDecimal monthlyIncome) {
        try {
            // Obtener los bytes de los archivos
            byte[] appraisalCertificateBytes = appraisalCertificate.getBytes();
            byte[] incomeProofBytes = incomeProof.getBytes();
            byte[] savingsAccountBytes = savingsAccount.getBytes();
            byte[] jobContractBytes = jobContract.getBytes();
            byte[] creditHistoryBytes = creditHistory.getBytes();
            byte[] firstHomeDeedBytes = firstHomeDeed.getBytes();

            // Imprimir información para depuración
            System.out.println("Appraisal Certificate Size: " + appraisalCertificateBytes.length);
            System.out.println("Income Proof Size: " + incomeProofBytes.length);
            System.out.println("Job Contract Size: " + jobContractBytes.length);
            System.out.println("Credit History Size: " + creditHistoryBytes.length);
            System.out.println("First Home Deed Size: " + firstHomeDeedBytes.length);
            System.out.println("Simulation: " + simulation);
            System.out.println("Monthly Income: " + monthlyIncome);

            return secondHomeReqService.createSecondHomeRequest(
                    simulation,
                    appraisalCertificateBytes,
                    incomeProofBytes,
                    savingsAccountBytes,
                    jobContractBytes,
                    creditHistoryBytes,
                    firstHomeDeedBytes,
                    monthlyIncome);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error al procesar la solicitud");
        }
    }
}