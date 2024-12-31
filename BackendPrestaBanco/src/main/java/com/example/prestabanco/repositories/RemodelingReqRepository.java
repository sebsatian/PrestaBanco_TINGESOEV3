package com.example.prestabanco.repositories;

import com.example.prestabanco.entities.RemodelingReqEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RemodelingReqRepository extends JpaRepository<RemodelingReqEntity, Long> {
}
