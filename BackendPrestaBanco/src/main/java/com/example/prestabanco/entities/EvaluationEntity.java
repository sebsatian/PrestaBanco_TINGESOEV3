package com.example.prestabanco.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "evaluation")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "request_id", nullable = false)
    private int requestId;

    @Column(name = "balance", nullable = false)
    private BigDecimal balance;

    @Column(name = "minimum_balance")
    private BigDecimal minimumBalance;

    @Column(name = "balance_12_months_ago", nullable = false)
    private BigDecimal balance12MonthsAgo;

    @Column(name = "num_deposits_first_4_months", nullable = false)
    private int numDepositsFirst4Months;

    @Column(name = "num_deposits_second_4_months", nullable = false)
    private int numDepositsSecond4Months;

    @Column(name = "num_deposits_last_4_months", nullable = false)
    private int numDepositsLast4Months;

    @Column(name = "sum_all_deposits", nullable = false)
    private BigDecimal sumAllDeposits;

    @Column(name = "monthly_salary", nullable = false)
    private BigDecimal monthlySalary;

    @Column(name = "creation_saving_account_date", nullable = false)
    private LocalDate creationSavingAccountDate;

    @Column(name = "biggest_withdrawal_last_12_months", nullable = false)
    private BigDecimal biggestWithdrawalLast12Months;

    @Column(name = "balance_after_bw_12_months", nullable = false)
    private BigDecimal balanceAfterBW12Months;

    @Column(name = "biggest_withdrawal_last_6_months", nullable = false)
    private BigDecimal biggestWithdrawalLast6Months;

    @Column(name = "balance_after_bw_6_months", nullable = false)
    private BigDecimal balanceAfterBW6Months;

    @Column(name = "sum_all_debts", nullable = false)
    private BigDecimal sumAllDebts;

    @Column(name = "cost_to_income_ratio")
    private boolean costToIncomeRatio;

    @Column(name = "credit_history", nullable = false)
    private boolean creditHistory;

    @Column(name = "job_status", nullable = false)
    private boolean jobStatus;

    @Column(name = "debt_to_income_ratio")
    private boolean debtToIncomeRatio;

    @Column(name = "in_age")
    private boolean inAge;
}
