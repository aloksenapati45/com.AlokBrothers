package com.alokbrothers.repository;

import com.alokbrothers.model.Fish;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FishRepository extends JpaRepository<Fish, Long> {
    List<Fish> findByCategory(String category);
}
