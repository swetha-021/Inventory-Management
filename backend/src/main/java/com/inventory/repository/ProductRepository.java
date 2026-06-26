package com.inventory.repository;

import com.inventory.entity.Product;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    boolean existsBySkuIgnoreCase(String sku);

    boolean existsBySkuIgnoreCaseAndIdNot(String sku, Long id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Product p WHERE p.id = :id")
    Optional<Product> findByIdForUpdate(@Param("id") Long id);

    @Query("""
            SELECT p FROM Product p
            LEFT JOIN p.category c
            LEFT JOIN p.supplier s
            WHERE (:search IS NULL OR :search = ''
                OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(p.sku) LIKE LOWER(CONCAT('%', :search, '%')))
              AND (:categoryId IS NULL OR c.id = :categoryId)
              AND (:supplierId IS NULL OR s.id = :supplierId)
            """)
    Page<Product> search(
            @Param("search") String search,
            @Param("categoryId") Long categoryId,
            @Param("supplierId") Long supplierId,
            Pageable pageable
    );

    @Query("SELECT p FROM Product p WHERE p.quantity <= p.reorderLevel ORDER BY p.quantity ASC")
    List<Product> findLowStock();

    @Query("SELECT COUNT(p) FROM Product p WHERE p.quantity <= p.reorderLevel")
    long countLowStock();
}
