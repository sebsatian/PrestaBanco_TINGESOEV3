package com.example.demo.services;

import com.example.prestabanco.entities.RequestEntity;
import com.example.prestabanco.entities.TotalCostsEntity;
import com.example.prestabanco.repositories.RequestRepository;
import com.example.prestabanco.repositories.TotalCostsRepository;
import com.example.prestabanco.services.TotalCostsService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class TotalCostsServiceTest {

    @InjectMocks
    private TotalCostsService totalCostsService;

    @Mock
    private TotalCostsRepository totalCostsRepository;

    @Mock
    private RequestRepository requestRepository;


    @Test
    void testCalculateTotalCostsWithExistingTotalCosts() {
        // Given
        Long requestId = 1L;
        TotalCostsEntity existingTotalCosts = new TotalCostsEntity();
        existingTotalCosts.setRequestId(requestId.intValue());

        when(totalCostsRepository.getTotalCostsByRequestId(requestId)).thenReturn(existingTotalCosts);

        // When
        TotalCostsEntity totalCosts = totalCostsService.calculateTotalCosts(requestId);

        // Then
        assertThat(totalCosts).isEqualTo(existingTotalCosts);
    }

    @Test
    void testCalculateTotalCostsWithNullRequest() {
        // Given
        Long requestId = 1L;

        when(requestRepository.findById(requestId)).thenReturn(Optional.empty());

        // When
        TotalCostsEntity totalCosts = totalCostsService.calculateTotalCosts(requestId);

        // Then
        assertThat(totalCosts).isNull();
    }
    @Test
    void testCalculateTotalCosts() {
        // Given
        Long requestId = 1L;
        RequestEntity request = new RequestEntity();
        request.setId(requestId);
        request.setMonthlyPayment(BigDecimal.valueOf(10000));
        request.setYears(20);
        request.setLoanAmount(BigDecimal.valueOf(800000));

        when(requestRepository.findById(requestId)).thenReturn(Optional.of(request));
        when(totalCostsRepository.getTotalCostsByRequestId(requestId)).thenReturn(null);

        // When
        TotalCostsEntity totalCosts = totalCostsService.calculateTotalCosts(requestId);

        // Then
        assertThat(totalCosts).isNotNull();
    }
}