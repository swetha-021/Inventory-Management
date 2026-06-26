package com.inventory.dto;

import java.time.Instant;
import java.util.List;

public final class ReportDtos {
    private ReportDtos() {
    }

    public record AuditLogResponse(
            Long id,
            Long actorId,
            String actorEmail,
            String action,
            String entityType,
            String entityId,
            String details,
            Instant createdAt
    ) {
    }

    public record DashboardResponse(
            long totalProducts,
            Long lowStockCount,
            List<StockDtos.StockMovementResponse> recentMovements
    ) {
    }
}
