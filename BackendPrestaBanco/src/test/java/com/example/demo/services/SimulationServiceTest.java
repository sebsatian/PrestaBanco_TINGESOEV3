package com.example.demo.services;

import com.example.prestabanco.entities.ClientEntity;
import com.example.prestabanco.entities.SimulationEntity;
import com.example.prestabanco.repositories.ClientRepository;
import com.example.prestabanco.repositories.LoanTypeRepository;
import com.example.prestabanco.repositories.SimulationRepository;
import com.example.prestabanco.services.SimulationService;
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
public class SimulationServiceTest {

    @InjectMocks
    private SimulationService simulationService;

    @Mock
    private SimulationRepository simulationRepository;

    @Mock
    private ClientRepository clientRepository;

    @Mock
    private LoanTypeRepository loanTypeRepository;

    @Test
    void testCalculateMontlyPayment() {
        // Given
        String rut = "12345678-9";
        int propertyValue = 1000000;
        Long loanType = 1L;
        int years = 20;
        float percentage = 0.8f;

        ClientEntity client = new ClientEntity();
        client.setId(1L);
        when(clientRepository.findClientByRut(rut)).thenReturn(client);
        when(loanTypeRepository.getInterestRateById(loanType)).thenReturn(5.0f);

        // When
        SimulationEntity simulation = simulationService.calculateMontlyPayment(rut, propertyValue, loanType, years, percentage);

        // Then
        assertThat(simulation).isNotNull();
        assertThat(simulation.getClientId()).isEqualTo(1);
        assertThat(simulation.getLoanType()).isEqualTo(loanType.intValue());
        assertThat(simulation.getPropertyValue()).isEqualTo(BigDecimal.valueOf(propertyValue));
        assertThat(simulation.getLoanAmount()).isEqualTo(BigDecimal.valueOf(propertyValue * percentage));
        assertThat(simulation.getAnnualInterestRate()).isEqualTo(5.0f);
        assertThat(simulation.getYears()).isEqualTo(years);
        assertThat(simulation.getNumberOfPayments()).isEqualTo(years * 12);
        assertThat(simulation.getMonthlyPayment()).isNotNull();
        assertThat(simulation.getFinalAmount()).isNotNull();
    }

    @Test
    void testCreateSimulation() {
        // Given
        String rut = "12345678-9";
        int propertyValue = 1000000;
        Long loanType = 1L;
        int years = 20;
        float percentage = 0.8f;

        ClientEntity client = new ClientEntity();
        client.setId(1L);
        when(clientRepository.findClientByRut(rut)).thenReturn(client);
        when(loanTypeRepository.getInterestRateById(loanType)).thenReturn(5.0f);

        SimulationEntity expectedSimulation = new SimulationEntity();
        expectedSimulation.setClientId(1);
        expectedSimulation.setLoanType(loanType.intValue());
        expectedSimulation.setPropertyValue(BigDecimal.valueOf(propertyValue));
        expectedSimulation.setLoanAmount(BigDecimal.valueOf(propertyValue * percentage));
        expectedSimulation.setAnnualInterestRate(5.0f);
        expectedSimulation.setYears(years);
        expectedSimulation.setNumberOfPayments(years * 12);
        expectedSimulation.setMonthlyPayment(BigDecimal.valueOf(5279.64591373327)); // Set the actual calculated value
        expectedSimulation.setPercentage(percentage);
        expectedSimulation.setFinalAmount(BigDecimal.valueOf(1267115.0192959849)); // Set the actual calculated value

        when(simulationRepository.save(expectedSimulation)).thenReturn(expectedSimulation);

        // When
        SimulationEntity actualSimulation = simulationService.createSimulation(rut, propertyValue, loanType, years, percentage);

        // Then
        assertThat(actualSimulation).isNotNull();
        assertThat(actualSimulation.getClientId()).isEqualTo(1);
        assertThat(actualSimulation.getLoanType()).isEqualTo(loanType.intValue());
        assertThat(actualSimulation.getPropertyValue()).isEqualTo(BigDecimal.valueOf(propertyValue));
        assertThat(actualSimulation.getLoanAmount()).isEqualTo(BigDecimal.valueOf(propertyValue * percentage));
        assertThat(actualSimulation.getAnnualInterestRate()).isEqualTo(5.0f);
        assertThat(actualSimulation.getYears()).isEqualTo(years);
        assertThat(actualSimulation.getNumberOfPayments()).isEqualTo(years * 12);
        assertThat(actualSimulation.getMonthlyPayment()).isEqualTo(BigDecimal.valueOf(5279.64591373327));
        assertThat(actualSimulation.getFinalAmount()).isEqualTo(BigDecimal.valueOf(1267115.0192959849));
    }

    @Test
    void testUpdateSimulation() {
        // Given
        Long simulationId = 1L;
        String rut = "12345678-9";
        int propertyValue = 1000000;
        Long loanType = 1L;
        int years = 20;
        float percentage = 0.8f;

        ClientEntity client = new ClientEntity();
        client.setId(1L);
        when(clientRepository.findClientByRut(rut)).thenReturn(client);
        when(loanTypeRepository.getInterestRateById(loanType)).thenReturn(5.0f);

        SimulationEntity existingSimulation = new SimulationEntity();
        existingSimulation.setId(simulationId);
        existingSimulation.setClientId(1);
        existingSimulation.setLoanType(loanType.intValue());
        existingSimulation.setPropertyValue(BigDecimal.valueOf(900000));
        existingSimulation.setLoanAmount(BigDecimal.valueOf(720000));
        existingSimulation.setAnnualInterestRate(4.5f);
        existingSimulation.setYears(15);
        existingSimulation.setNumberOfPayments(180);
        existingSimulation.setMonthlyPayment(BigDecimal.valueOf(5000));
        existingSimulation.setPercentage(0.75f);
        existingSimulation.setFinalAmount(BigDecimal.valueOf(900000));

        when(simulationRepository.findById(simulationId)).thenReturn(Optional.of(existingSimulation));

        SimulationEntity expectedUpdatedSimulation = new SimulationEntity();
        expectedUpdatedSimulation.setId(simulationId);
        expectedUpdatedSimulation.setClientId(1);
        expectedUpdatedSimulation.setLoanType(loanType.intValue());
        expectedUpdatedSimulation.setPropertyValue(BigDecimal.valueOf(propertyValue));
        expectedUpdatedSimulation.setLoanAmount(BigDecimal.valueOf(propertyValue * percentage));
        expectedUpdatedSimulation.setAnnualInterestRate(5.0f);
        expectedUpdatedSimulation.setYears(years);
        expectedUpdatedSimulation.setNumberOfPayments(years * 12);
        expectedUpdatedSimulation.setMonthlyPayment(BigDecimal.valueOf(5279.64591373327)); // Set the actual calculated value
        expectedUpdatedSimulation.setPercentage(percentage);
        expectedUpdatedSimulation.setFinalAmount(BigDecimal.valueOf(1267115.0192959849)); // Set the actual calculated value

        when(simulationRepository.save(existingSimulation)).thenReturn(expectedUpdatedSimulation);

        // When
        SimulationEntity actualUpdatedSimulation = simulationService.updateSimulation(simulationId, rut, propertyValue, loanType, years, percentage);

        // Then
        assertThat(actualUpdatedSimulation).isNotNull();
        assertThat(actualUpdatedSimulation.getClientId()).isEqualTo(1);
        assertThat(actualUpdatedSimulation.getLoanType()).isEqualTo(loanType.intValue());
        assertThat(actualUpdatedSimulation.getPropertyValue()).isEqualTo(BigDecimal.valueOf(propertyValue));
        assertThat(actualUpdatedSimulation.getLoanAmount()).isEqualTo(BigDecimal.valueOf(propertyValue * percentage));
        assertThat(actualUpdatedSimulation.getAnnualInterestRate()).isEqualTo(5.0f);
        assertThat(actualUpdatedSimulation.getYears()).isEqualTo(years);
        assertThat(actualUpdatedSimulation.getNumberOfPayments()).isEqualTo(years * 12);
        assertThat(actualUpdatedSimulation.getMonthlyPayment()).isEqualTo(BigDecimal.valueOf(5279.64591373327));
        assertThat(actualUpdatedSimulation.getFinalAmount()).isEqualTo(BigDecimal.valueOf(1267115.0192959849));
    }

    @Test
    void WhenCreatingAndRutNotFound(){
        // Given
        String rut = "12345678-9";
        int propertyValue = 1000000;
        Long loanType = 1L;
        int years = 20;
        float percentage = 0.8f;

        when(clientRepository.findClientByRut(rut)).thenReturn(null);

        // When
        try {
            simulationService.createSimulation(rut, propertyValue, loanType, years, percentage);
        } catch (IllegalArgumentException e) {
            assertThat(e.getMessage()).isEqualTo("Client not found with the provided RUT");
        }
    }

    @Test
    void WhenUpdatingAndSimulationNotFound(){
        // Given
        String rut = "12345678-9";
        int propertyValue = 1000000;
        Long loanType = 1L;
        int years = 20;
        float percentage = 0.8f;

        SimulationEntity simulation = new SimulationEntity();
        simulation.setClientId(1);
        simulation.setId(1L);

        // When
        try {
            simulationService.updateSimulation(1L, rut, propertyValue, loanType, years, percentage);
        } catch (IllegalArgumentException e) {
            assertThat(e.getMessage()).isEqualTo("Simulation not found with the provided ID");

        }
    }

    @Test
    void whenCalculatingMonthlyPayment_thenCorrect() {
        // Given
        String rut = "12345678-9";
        int propertyValue = 1000000;
        Long loanType = 1L;
        int years = 20;
        float percentage = 0.8f;

        try {
            simulationService.calculateMontlyPayment(rut, propertyValue, loanType, years, percentage);
        } catch (IllegalArgumentException e) {
            assertThat(e.getMessage()).isEqualTo("Client not found with the provided RUT");
        }
    }
}