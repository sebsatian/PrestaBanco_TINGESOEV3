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
@Table(name = "remodeling_request")
@PrimaryKeyJoinColumn(name = "id")
public class RemodelingReqEntity extends RequestEntity {
    @JdbcTypeCode(SqlTypes.BINARY)
    @Column(name = "remodeling_budget")
    private byte[] remodelingBudget;
}