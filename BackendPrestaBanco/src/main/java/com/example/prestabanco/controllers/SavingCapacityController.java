package com.example.prestabanco.controllers;

import com.example.prestabanco.entities.SavingCapacityEntity;
import com.example.prestabanco.repositories.SavingCapacityRepository;
import com.example.prestabanco.services.SavingCapacityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/saving-capacity")
@CrossOrigin("*")
public class SavingCapacityController {

    @Autowired
    private SavingCapacityService savingCapacityService;

    @Autowired
    private SavingCapacityRepository savingCapacityRepository;

    @GetMapping("/{requestId}")
    public SavingCapacityEntity getSavingCapacity(@PathVariable int requestId) {
        return savingCapacityRepository.findByRequestId(requestId);
    }


}
