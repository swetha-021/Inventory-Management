package com.inventory.repository;

import com.inventory.entity.StockMovement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;

import java.util.List;

public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {

    @EntityGraph(attributePaths = {"product", "performedBy"})
    List<StockMovement> findTop10ByOrderByCreatedAtDesc();

    @EntityGraph(attributePaths = {"product", "performedBy"})
    Page<StockMovement> findAll(Pageable pageable);
}
