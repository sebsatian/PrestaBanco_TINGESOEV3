package com.example.prestabanco.repositories;

import com.example.prestabanco.entities.FirstHomeReqEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FirstHomeReqRepository extends JpaRepository<FirstHomeReqEntity, Long> {
}