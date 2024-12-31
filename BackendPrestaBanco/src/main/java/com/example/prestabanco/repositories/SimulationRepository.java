package com.example.prestabanco.repositories;

import com.example.prestabanco.entities.SimulationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SimulationRepository extends JpaRepository<SimulationEntity, Long> {
    Optional<SimulationEntity> findByClientId(Long clientId);
    SimulationEntity getSimulationEntityById(Long clientId);
}
