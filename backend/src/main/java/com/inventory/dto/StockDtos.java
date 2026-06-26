package com.inventory.dto;

import com.inventory.entity.MovementType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;

public final class StockDtos {
    private StockDtos() {
    }

    public record StockMovementRequest(
            @NotNull Long productId,
            @NotNull @Min(1) Integer quantity,
            @Size(max = 255) String reason
    ) {
    }

    public record StockMovementResponse(
            Long id,
            Long productId,
            String productName,
            String sku,
            MovementType type,
            int quantity,
            String reason,
            Long performedById,
            String performedByEmail,
            Instant createdAt
    ) {
    }
}
