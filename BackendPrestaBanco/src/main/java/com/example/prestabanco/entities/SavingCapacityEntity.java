package com.example.prestabanco.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;

@Entity
@Table(name = "saving_capacity")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SavingCapacityEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "request_id")
    private int requestId;

    @Column(name = "min_amount")
    private boolean minAmount;

    @Column(name = "consistent_history")
    private boolean consistentHistory;

    @Column(name = "periodic_deposits")
    private boolean periodicDeposits;

    @Column(name = "relation_amount_years")
    private boolean relationAmountYears;

    @Column(name = "recent_withdrawals")
    private boolean recentWithdrawals;

    @Column(name = "capacity_result")
    private String capacityResult;
}
