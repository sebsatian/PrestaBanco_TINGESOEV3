package com.example.prestabanco.controllers;

import com.example.prestabanco.entities.RequestEntity;
import com.example.prestabanco.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/requests")
@CrossOrigin("*")
public class    RequestController {
    @Autowired
    private RequestRepository requestRepository;
    @Autowired
    private FirstHomeReqRepository firstHomeReqRepository;
    @Autowired
    private SecondHomeReqRepository secondHomeReqRepository;
    @Autowired
    private BusinessReqRepository businessReqRepository;
    @Autowired
    private RemodelingReqRepository remodelingReqRepository;


    @GetMapping("/all")
    public List<RequestEntity> getAllRequests() {
        return requestRepository.findAll();
    }

    @GetMapping("/{id}")
    public RequestEntity getRequestById(@PathVariable Long id) {
        RequestEntity request = requestRepository.findById(id).orElse(null);
        if (request == null) {
            return null;
        }

        switch (request.getLoanType()) {
            case 1:
                return firstHomeReqRepository.findById(id).orElse(null);
            case 2:
                return secondHomeReqRepository.findById(id).orElse(null);
            case 3:
                return businessReqRepository.findById(id).orElse(null);
            case 4:
                return remodelingReqRepository.findById(id).orElse(null);
            default:
                return request;
        }
    }

    @GetMapping("/{id}/appraisalCertificate")
    public byte[] getAppraisalCertificate(@PathVariable Long id) {
        RequestEntity request = requestRepository.findById(id).orElse(null);
        if (request != null && request.getAppraisalCertificate() != null) {
            return request.getAppraisalCertificate();
        }
        return new byte[0];
    }

    @GetMapping("/rut/{rut}")
    public List<RequestEntity> getRequestsByRut(@PathVariable String rut) {
        return requestRepository.findByClientRut(rut);
    }

    @PostMapping("/{id}/status")
    public void updateRequestStatus(@PathVariable Long id, @RequestBody Map<String, String> statusUpdate) {
        Optional<RequestEntity> requestEntityOptional = requestRepository.findById(id);
        if (requestEntityOptional.isPresent()) {
            RequestEntity request = requestEntityOptional.get();
            request.setCurrentStatus(statusUpdate.get("statusUpdate"));
            requestRepository.save(request);
        } else {
            System.out.println("Request not found");
        }
    }
    @PostMapping("/{id}/details")
    public void updateRequestDetails(@PathVariable Long id, @RequestBody Map<String, String> detailsUpdate) {
        Optional<RequestEntity> requestEntityOptional = requestRepository.findById(id);
        if (requestEntityOptional.isPresent()) {
            RequestEntity request = requestEntityOptional.get();
            request.setDetails(detailsUpdate.get("detailsUpdate"));
            requestRepository.save(request);
        } else {
            System.out.println("Request not found");
        }
    }




}