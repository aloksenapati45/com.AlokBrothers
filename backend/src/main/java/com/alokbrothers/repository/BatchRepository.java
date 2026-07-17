package com.alokbrothers.repository;

import com.alokbrothers.model.Batch;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BatchRepository extends JpaRepository<Batch, Long> {
}
