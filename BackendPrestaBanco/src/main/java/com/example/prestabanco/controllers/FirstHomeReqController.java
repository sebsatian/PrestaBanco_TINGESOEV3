package com.example.prestabanco.controllers;

import com.example.prestabanco.entities.FirstHomeReqEntity;
import com.example.prestabanco.entities.SimulationEntity;
import com.example.prestabanco.services.FirstHomeReqService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@RestController
@RequestMapping("/firsthomereq")
@CrossOrigin("*")
public class FirstHomeReqController {
    @Autowired
    private FirstHomeReqService firstHomeReqService;

    @PostMapping("/create")
    public FirstHomeReqEntity createFirstHomeRequest(
            @RequestPart("simulation") SimulationEntity simulation,
            @RequestPart("appraisalCertificate") MultipartFile appraisalCertificate,
            @RequestPart("incomeProof") MultipartFile incomeProof,
            @RequestPart("jobContract") MultipartFile jobContract,
            @RequestPart("savingsAccount") MultipartFile savingsAccount,
            @RequestPart("creditHistory") MultipartFile creditHistory,
            @RequestParam("monthlyIncome") BigDecimal monthlyIncome) {
        try {
            // Obtain the bytes from the files
            byte[] appraisalCertificateBytes = appraisalCertificate.getBytes();
            byte[] incomeProofBytes = incomeProof.getBytes();
            byte[] jobContractBytes = jobContract.getBytes();
            byte[] creditHistoryBytes = creditHistory.getBytes();
            byte[] savingsAccountBytes = savingsAccount.getBytes();

            // create the request
            return firstHomeReqService.createFirstHomeRequest(
                    simulation,
                    appraisalCertificateBytes,
                    incomeProofBytes,
                    savingsAccountBytes,
                    jobContractBytes,
                    creditHistoryBytes,
                    monthlyIncome);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error al procesar la solicitud");
        }
    }
}