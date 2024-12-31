package com.example.prestabanco.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "request_entity")
@Inheritance(strategy = InheritanceType.JOINED)
public class RequestEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "annual_interest_rate")
    private BigDecimal annualInterestRate;

    @JdbcTypeCode(SqlTypes.BINARY)
    @Column(name = "appraisal_certificate")
    private byte[] appraisalCertificate;

    @JdbcTypeCode(SqlTypes.BINARY)
    @Column(name = "savings_account")
    private byte[] savingsAccount;

    @Column(name = "client_rut")
    private String clientRut;

    @Column(name = "creation_date")
    private LocalDateTime creationDate;

    @Column(name = "current_status")
    private String currentStatus;

    @JdbcTypeCode(SqlTypes.BINARY)
    @Column(name = "income_proof")
    private byte[] incomeProof;

    @Column(name = "loan_amount")
    private BigDecimal loanAmount;

    @Column(name = "loan_type")
    private Integer loanType;

    @Column(name = "monthly_income")
    private BigDecimal monthlyIncome;

    @Column(name = "monthly_payment")
    private BigDecimal monthlyPayment;

    @Column(name = "years")
    private Integer years;

    // Will not be null only if the request is rejected or needs more information
    @Column(name = "details")
    private String details;

}