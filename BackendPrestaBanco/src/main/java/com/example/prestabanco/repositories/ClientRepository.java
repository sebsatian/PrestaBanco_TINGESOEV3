package com.example.prestabanco.repositories;

import com.example.prestabanco.entities.ClientEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<ClientEntity, Long> {
    ClientEntity findClientByRut(@Param("rut") String rut);

    @Query("SELECT c.rut FROM ClientEntity c WHERE c.id = :id")
    String getClientRutById(@Param("id") Long id);
}
