package com.example.prestabanco.repositories;

import com.example.prestabanco.entities.LoanTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LoanTypeRepository extends JpaRepository<LoanTypeEntity, Long> {
    LoanTypeEntity findTypeById(long id);
    @Query("SELECT l.annualInterestRate FROM LoanTypeEntity l WHERE l.id = :loanTypeId")
    float getInterestRateById(@Param("loanTypeId") Long loanTypeId);





}
