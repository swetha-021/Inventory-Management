package com.inventory.service;

import com.inventory.dto.StockDtos.StockMovementRequest;
import com.inventory.dto.StockDtos.StockMovementResponse;
import com.inventory.entity.MovementType;
import com.inventory.entity.Product;
import com.inventory.entity.StockMovement;
import com.inventory.entity.User;
import com.inventory.exception.InsufficientStockException;
import com.inventory.exception.ResourceNotFoundException;
import com.inventory.repository.ProductRepository;
import com.inventory.repository.StockMovementRepository;
import com.inventory.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StockService {

    private final ProductRepository productRepository;
    private final StockMovementRepository stockMovementRepository;
    private final CurrentUserService currentUserService;

    @Transactional
    public StockMovementResponse stockIn(StockMovementRequest request) {
        return recordMovement(request, MovementType.IN);
    }

    @Transactional
    public StockMovementResponse stockOut(StockMovementRequest request) {
        return recordMovement(request, MovementType.OUT);
    }

    @Transactional(readOnly = true)
    public Page<StockMovementResponse> list(Pageable pageable) {
        return stockMovementRepository.findAll(pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public List<StockMovementResponse> recent() {
        return stockMovementRepository.findTop10ByOrderByCreatedAtDesc().stream().map(this::toResponse).toList();
    }

    private StockMovementResponse recordMovement(StockMovementRequest request, MovementType type) {
        Product product = productRepository.findByIdForUpdate(request.productId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        User actor = currentUserService.requireUser();

        if (type == MovementType.OUT && product.getQuantity() < request.quantity()) {
            throw new InsufficientStockException(
                    "Insufficient stock for " + product.getSku() + ". Available: " + product.getQuantity()
            );
        }

        int nextQuantity = type == MovementType.IN
                ? product.getQuantity() + request.quantity()
                : product.getQuantity() - request.quantity();
        product.setQuantity(nextQuantity);
        productRepository.save(product);

        StockMovement movement = new StockMovement();
        movement.setProduct(product);
        movement.setType(type);
        movement.setQuantity(request.quantity());
        movement.setReason(request.reason());
        movement.setPerformedBy(actor);
        stockMovementRepository.save(movement);
        return toResponse(movement);
    }

    public StockMovementResponse toResponse(StockMovement movement) {
        Product product = movement.getProduct();
        User actor = movement.getPerformedBy();
        return new StockMovementResponse(
                movement.getId(),
                product.getId(),
                product.getName(),
                product.getSku(),
                movement.getType(),
                movement.getQuantity(),
                movement.getReason(),
                actor == null ? null : actor.getId(),
                actor == null ? null : actor.getEmail(),
                movement.getCreatedAt()
        );
    }
}
