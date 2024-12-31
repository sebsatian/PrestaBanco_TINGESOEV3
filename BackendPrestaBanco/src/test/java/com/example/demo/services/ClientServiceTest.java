package com.example.demo.services;

import com.example.prestabanco.entities.ClientEntity;
import com.example.prestabanco.repositories.ClientRepository;
import com.example.prestabanco.services.ClientService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class) // JUnit 5 Jupiter para usar Mockito
public class ClientServiceTest {

    @InjectMocks
    private ClientService clientService;

    @Mock
    private ClientRepository clientRepository;

    @Test
    void whenRegisterClient_thenCorrect() {
        // Given
        ClientEntity client = new ClientEntity();
        client.setId(1L);
        client.setRut("12.345.678-2");
        client.setName("Raul");
        client.setPassword("1234");
        client.setBirthDate(LocalDate.parse("1990-01-01"));

        // Simula que no existe un cliente con el mismo RUT en el repositorio
        when(clientRepository.findClientByRut("12.345.678-2")).thenReturn(null);

        // Simula que el método save devuelve el cliente que se pasa como argumento
        when(clientRepository.save(client)).thenReturn(client);

        // When
        ClientEntity clientTest = clientService.registerClient(client);

        // Then
        assertThat(clientTest).isEqualTo(client);
    }

    @Test
    void whenRegisterClient_thenError() {
        // Given
        ClientEntity client = new ClientEntity();
        client.setId(1L);
        client.setRut("12.345.678-2");
        client.setName("Raul");
        client.setPassword("1234");
        client.setBirthDate(LocalDate.parse("1990-01-01"));

        // Simula que existe un cliente con el mismo RUT en el repositorio
        when(clientRepository.findClientByRut("12.345.678-2")).thenReturn(client);

        // When
        try {
            clientService.registerClient(client);
        } catch (RuntimeException e) {
            // Then
            assertThat(e.getMessage()).isEqualTo("El RUT ya está registrado");
        }
    }


}
