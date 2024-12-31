package com.example.prestabanco.repositories;

import com.example.prestabanco.entities.TotalCostsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TotalCostsRepository extends JpaRepository<TotalCostsEntity, Long> {

    TotalCostsEntity getTotalCostsByRequestId(Long requestId);

}
