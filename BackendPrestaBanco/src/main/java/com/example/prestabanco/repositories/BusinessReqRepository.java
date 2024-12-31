package com.example.prestabanco.repositories;


import com.example.prestabanco.entities.BusinessReqEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BusinessReqRepository extends JpaRepository<BusinessReqEntity, Long> {
}
