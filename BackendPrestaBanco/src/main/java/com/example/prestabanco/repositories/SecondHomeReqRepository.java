package com.example.prestabanco.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.prestabanco.entities.SecondHomeReqEntity;
import org.springframework.stereotype.Repository;

@Repository
public interface SecondHomeReqRepository extends JpaRepository<SecondHomeReqEntity, Long> {
}
