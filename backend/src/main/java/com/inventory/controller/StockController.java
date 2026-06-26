package com.inventory.controller;

import com.inventory.dto.PageResponse;
import com.inventory.dto.StockDtos.StockMovementRequest;
import com.inventory.dto.StockDtos.StockMovementResponse;
import com.inventory.service.StockService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;

    @PostMapping("/stock/in")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('STAFF','MANAGER','ADMIN')")
    public StockMovementResponse stockIn(@Valid @RequestBody StockMovementRequest request) {
        return stockService.stockIn(request);
    }

    @PostMapping("/stock/out")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('STAFF','MANAGER','ADMIN')")
    public StockMovementResponse stockOut(@Valid @RequestBody StockMovementRequest request) {
        return stockService.stockOut(request);
    }

    @GetMapping("/stock/movements")
    @PreAuthorize("hasAnyRole('STAFF','MANAGER','ADMIN')")
    public PageResponse<StockMovementResponse> movements(
            @PageableDefault(size = 20, sort = "createdAt", direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable
    ) {
        return PageResponse.from(stockService.list(pageable));
    }
}
