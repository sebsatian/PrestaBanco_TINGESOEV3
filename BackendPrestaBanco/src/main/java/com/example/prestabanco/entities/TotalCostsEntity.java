package com.example.prestabanco.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "total_costs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TotalCostsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "request_id")
    private int requestId;

    @Column(name = "credit_life_insurance")
    private BigDecimal creditLifeInsurance;

    @Column(name = "fire_insurance")
    private BigDecimal fireInsurance;

    @Column(name = "administration_fee")
    private BigDecimal administrationFee;

    @Column(name = "monthly_cost")
    private BigDecimal monthlyCost;

    @Column(name = "total_cost")
    private BigDecimal totalCost;
}
