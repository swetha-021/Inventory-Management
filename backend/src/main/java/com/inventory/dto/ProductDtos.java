package com.inventory.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.Instant;

public final class ProductDtos {
    private ProductDtos() {
    }

    public record ProductRequest(
            @NotBlank @Size(max = 100) String sku,
            @NotBlank @Size(max = 255) String name,
            String description,
            Long categoryId,
            Long supplierId,
            @NotNull @Min(0) Integer reorderLevel,
            @NotNull @DecimalMin("0.00") BigDecimal unitPrice
    ) {
    }

    public record ProductResponse(
            Long id,
            String sku,
            String name,
            String description,
            Long categoryId,
            String categoryName,
            Long supplierId,
            String supplierName,
            int quantity,
            int reorderLevel,
            BigDecimal unitPrice,
            boolean lowStock,
            Instant createdAt,
            Instant updatedAt
    ) {
    }
}
