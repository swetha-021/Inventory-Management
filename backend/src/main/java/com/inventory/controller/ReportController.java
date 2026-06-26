package com.inventory.controller;

import com.inventory.dto.PageResponse;
import com.inventory.dto.ProductDtos.ProductResponse;
import com.inventory.dto.ReportDtos.AuditLogResponse;
import com.inventory.dto.ReportDtos.DashboardResponse;
import com.inventory.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/reports/low-stock")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    public List<ProductResponse> lowStock() {
        return reportService.lowStock();
    }

    @GetMapping("/audit-logs")
    @PreAuthorize("hasRole('ADMIN')")
    public PageResponse<AuditLogResponse> auditLogs(
            @PageableDefault(size = 20, sort = "createdAt", direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable
    ) {
        return reportService.auditLogs(pageable);
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('STAFF','MANAGER','ADMIN')")
    public DashboardResponse dashboard() {
        return reportService.dashboard();
    }
}
