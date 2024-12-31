package com.example.prestabanco.controllers;
import com.example.prestabanco.entities.TotalCostsEntity;
import com.example.prestabanco.repositories.TotalCostsRepository;
import com.example.prestabanco.services.TotalCostsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/total-costs")
@CrossOrigin("*")
public class TotalCostsController {

    @Autowired
    private TotalCostsService totalCostsService;
    @Autowired
    private TotalCostsRepository totalCostsRepository;

    @GetMapping("/{requestId}")
    public TotalCostsEntity getTotalCosts(@PathVariable Long requestId) {
        System.out.println("Request ID......................................: " + requestId);
        return totalCostsRepository.getTotalCostsByRequestId(requestId);


    }

    @PostMapping("/create/{requestId}")
    public void createTotalCosts(@PathVariable Long requestId) {
       TotalCostsEntity totalCosts = totalCostsService.calculateTotalCosts(requestId);
         totalCostsRepository.save(totalCosts);

    }

}
