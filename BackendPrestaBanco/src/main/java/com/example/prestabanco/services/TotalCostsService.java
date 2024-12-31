package com.example.prestabanco.services;

import com.example.prestabanco.entities.RequestEntity;
import com.example.prestabanco.entities.SimulationEntity;
import com.example.prestabanco.entities.TotalCostsEntity;
import com.example.prestabanco.repositories.RequestRepository;
import com.example.prestabanco.repositories.TotalCostsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class TotalCostsService {

    @Autowired
    private TotalCostsRepository totalCostsRepository;
    @Autowired
    private RequestRepository requestRepository;

    public TotalCostsEntity calculateTotalCosts(Long requestId) {

        System.out.println("Calculating total costs----------------------------------------------------------------------------------------------------");
        System.out.println("Request id: " + requestId);

        // Create a new TotalCostsEntity object
        TotalCostsEntity totalCosts = new TotalCostsEntity();

        // Verify if there is already an entity with the requestId
        TotalCostsEntity existingTotalCosts = totalCostsRepository.getTotalCostsByRequestId(requestId);
        if (existingTotalCosts != null) {
            return existingTotalCosts;
        }


        // Get the request from the requestService
        RequestEntity request = requestRepository.findById(requestId).orElse(null);

        // If the request is null, return null
        if (request == null) {
            System.out.println("Request is null----------------------------------------------------------------------------------------------------");
            return null;
        }

        // Calculate the credit life insurance (0,03% of the monthly payment) per month
        BigDecimal zeroPointZeroThreePercent = new BigDecimal("0.0003");
        BigDecimal creditLifeInsurance = request.getMonthlyPayment().multiply(zeroPointZeroThreePercent);

        // Calculate the fire insurance (20000 per month)
        // Get the quantity of months by multiplying the years by 12
        BigDecimal months = new BigDecimal(request.getYears()).multiply(new BigDecimal("12"));

        // Multiply the quantity of months by 20000
        BigDecimal fireInsurance = new BigDecimal("20000").multiply(months);


        // Calculate the administration fee (1% of the loan amount)
        BigDecimal onePercent = new BigDecimal("0.01");
        BigDecimal administrationFee = request.getLoanAmount().multiply(onePercent);

        // Calculate the monthly cost (sum of the monthly payment, credit life insurance and fire insurance)
        BigDecimal monthlyCost = request.getMonthlyPayment().add(creditLifeInsurance);


        // Calculate the total cost (multiply the monthly cost by the quantity of months, add the administration fee,
        // and add the total fire insurance cost)
        BigDecimal totalCost = monthlyCost.multiply(months).add(administrationFee).add(fireInsurance);

        // Set the calculated values to the totalCosts object
        totalCosts.setCreditLifeInsurance(creditLifeInsurance);
        totalCosts.setFireInsurance(fireInsurance);
        totalCosts.setAdministrationFee(administrationFee);
        totalCosts.setMonthlyCost(monthlyCost);
        totalCosts.setTotalCost(totalCost);
        totalCosts.setRequestId(Math.toIntExact(requestId));

        // Return the totalCosts object
        return totalCosts;
    }
}
