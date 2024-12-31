package com.example.prestabanco.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "second_home_request")
public class SecondHomeReqEntity extends RequestEntity {

    @JdbcTypeCode(SqlTypes.BINARY)
    @Column(name = "first_home_deed")
    private byte[] firstHomeDeed;

    @JdbcTypeCode(SqlTypes.BINARY)
    @Column(name = "credit_history")
    private byte[] creditHistory;

    @JdbcTypeCode(SqlTypes.BINARY)
    @Column(name = "job_contract")
    private byte[] jobContract;
}
