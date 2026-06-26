package com.inventory.service;

import com.inventory.dto.PageResponse;
import com.inventory.dto.ProductDtos.ProductResponse;
import com.inventory.dto.ReportDtos.AuditLogResponse;
import com.inventory.dto.ReportDtos.DashboardResponse;
import com.inventory.dto.StockDtos.StockMovementResponse;
import com.inventory.entity.AuditLog;
import com.inventory.entity.RoleName;
import com.inventory.entity.User;
import com.inventory.repository.AuditLogRepository;
import com.inventory.repository.ProductRepository;
import com.inventory.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ProductRepository productRepository;
    private final AuditLogRepository auditLogRepository;
    private final ProductService productService;
    private final StockService stockService;
    private final CurrentUserService currentUserService;

    @Transactional(readOnly = true)
    public List<ProductResponse> lowStock() {
        return productRepository.findLowStock().stream().map(productService::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public PageResponse<AuditLogResponse> auditLogs(Pageable pageable) {
        return PageResponse.from(auditLogRepository.findAll(pageable).map(this::toAuditResponse));
    }

    @Transactional(readOnly = true)
    public DashboardResponse dashboard() {
        long totalProducts = productRepository.count();
        Long lowStockCount = null;
        if (currentUserService.hasRole(RoleName.MANAGER) || currentUserService.hasRole(RoleName.ADMIN)) {
            lowStockCount = productRepository.countLowStock();
        }
        List<StockMovementResponse> recent = stockService.recent();
        return new DashboardResponse(totalProducts, lowStockCount, recent);
    }

    private AuditLogResponse toAuditResponse(AuditLog log) {
        User actor = log.getActor();
        return new AuditLogResponse(
                log.getId(),
                actor == null ? null : actor.getId(),
                actor == null ? null : actor.getEmail(),
                log.getAction(),
                log.getEntityType(),
                log.getEntityId(),
                log.getDetails(),
                log.getCreatedAt()
        );
    }
}
