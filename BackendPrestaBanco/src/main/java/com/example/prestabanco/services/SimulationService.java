package com.example.prestabanco.services;

import com.example.prestabanco.entities.ClientEntity;
import com.example.prestabanco.entities.SimulationEntity;
import com.example.prestabanco.repositories.ClientRepository;
import com.example.prestabanco.repositories.LoanTypeRepository;
import com.example.prestabanco.repositories.SimulationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class SimulationService {

    @Autowired
    SimulationRepository simulationRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private LoanTypeRepository loanTypeRepository;

    public SimulationEntity calculateMontlyPayment(String rut, int propertyValue, Long loanType, int years, float percentage){
        // Obtain the client ID by RUT
        ClientEntity client = clientRepository.findClientByRut(rut);
        if (client == null) {
            System.out.println("Client not found with the provided RUT");
            throw new IllegalArgumentException("Client not found with the provided RUT");
        }
        // Obtain the annual interest rate from the loan type
        double annualInterestRate = loanTypeRepository.getInterestRateById(loanType);
        // Calculate the monthly interest rate
        double monthlyInterestRate = (annualInterestRate / 100) / 12;
        // Calculate the total number of payments
        int numberOfPayments = years * 12;
        // Calculate the loan amount
        double loanAmount = propertyValue * percentage;
        // Calculate the monthly payment using the correct formula
        double aux1PlusR = monthlyInterestRate + 1;
        // Calculate the monthly payment
        double monthlyPayment = loanAmount * (monthlyInterestRate * Math.pow(aux1PlusR, numberOfPayments)) / (Math.pow(aux1PlusR, numberOfPayments) - 1);
        // Calculate the final amount to pay
        double finalAmount = monthlyPayment * numberOfPayments;
        // Extract the ID from the client
        Long id = client.getId();
        int clientId = id.intValue();

        // Convert values to BigDecimal where necessary to maintain precision
        BigDecimal propertyValueBD = BigDecimal.valueOf(propertyValue);
        BigDecimal loanAmountBD = BigDecimal.valueOf(loanAmount);
        BigDecimal monthlyPaymentBD = BigDecimal.valueOf(monthlyPayment);
        BigDecimal finalAmountBD = BigDecimal.valueOf(finalAmount);
        // Create a new instance of SimulationEntity
        SimulationEntity newSimulation = new SimulationEntity();
        newSimulation.setClientId(clientId);
        newSimulation.setLoanType(loanType.intValue());
        newSimulation.setPropertyValue(propertyValueBD);
        newSimulation.setLoanAmount(loanAmountBD);
        newSimulation.setAnnualInterestRate((float) annualInterestRate);
        newSimulation.setYears(years);
        newSimulation.setNumberOfPayments(numberOfPayments);
        newSimulation.setMonthlyPayment(monthlyPaymentBD);
        newSimulation.setPercentage(percentage);
        newSimulation.setFinalAmount(finalAmountBD);
        return newSimulation;
    }

    public SimulationEntity createSimulation(String rut, int propertyValue, Long loanType, int years, float percentage) {
        // Obtain the client by RUT
        ClientEntity client = clientRepository.findClientByRut(rut);
        if (client == null) {
            System.out.println("Client not found with the provided RUT");
            throw new IllegalArgumentException("Client not found with the provided RUT");
        }
        System.out.println("Client found with RUT: " + rut);

        // Call the method to calculate the monthly payment
        SimulationEntity newSimulation = calculateMontlyPayment(rut, propertyValue, loanType, years, percentage);

        // Save the new simulation to the database
        simulationRepository.save(newSimulation);

        // Return the saved simulation entity
        return newSimulation;
    }

    // Update the simulation with the new values
    public SimulationEntity updateSimulation(Long simulationId, String rut, int propertyValue, Long loanType, int years, float percentage) {
        // Find the existing simulation by ID
        SimulationEntity existingSimulation = simulationRepository.findById(simulationId)
                .orElseThrow(() -> new IllegalArgumentException("Simulation not found with the provided ID"));

        // Call the method to calculate the updated monthly payment
        SimulationEntity updatedValues = calculateMontlyPayment(rut, propertyValue, loanType, years, percentage);

        // Update the values of the existing simulation with the new calculated values
        existingSimulation.setPropertyValue(updatedValues.getPropertyValue());
        existingSimulation.setLoanAmount(updatedValues.getLoanAmount());
        existingSimulation.setAnnualInterestRate(updatedValues.getAnnualInterestRate());
        existingSimulation.setYears(updatedValues.getYears());
        existingSimulation.setNumberOfPayments(updatedValues.getNumberOfPayments());
        existingSimulation.setMonthlyPayment(updatedValues.getMonthlyPayment());
        existingSimulation.setPercentage(updatedValues.getPercentage());
        existingSimulation.setFinalAmount(updatedValues.getFinalAmount());
        existingSimulation.setLoanType(loanType.intValue());

        // Save the updated simulation to the database
        simulationRepository.save(existingSimulation);

        // Return the updated simulation entity
        return existingSimulation;
    }




}
