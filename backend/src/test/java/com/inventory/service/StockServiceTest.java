package com.inventory.service;

import com.inventory.dto.StockDtos.StockMovementRequest;
import com.inventory.entity.Product;
import com.inventory.entity.User;
import com.inventory.exception.InsufficientStockException;
import com.inventory.repository.ProductRepository;
import com.inventory.repository.StockMovementRepository;
import com.inventory.security.CurrentUserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StockServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private StockMovementRepository stockMovementRepository;

    @Mock
    private CurrentUserService currentUserService;

    @InjectMocks
    private StockService stockService;

    private Product product;
    private User actor;

    @BeforeEach
    void setUp() {
        product = new Product();
        product.setId(1L);
        product.setSku("SKU-1001");
        product.setName("USB-C Hub");
        product.setQuantity(5);

        actor = new User();
        actor.setId(9L);
        actor.setEmail("staff@inventory.local");
    }

    @Test
    void stockOutRejectsWhenQuantityExceedsOnHand() {
        when(productRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(product));
        when(currentUserService.requireUser()).thenReturn(actor);

        StockMovementRequest request = new StockMovementRequest(1L, 6, "Sale");

        InsufficientStockException ex = assertThrows(
                InsufficientStockException.class,
                () -> stockService.stockOut(request)
        );

        assertEquals("Insufficient stock for SKU-1001. Available: 5", ex.getMessage());
        verify(stockMovementRepository, never()).save(any());
        assertEquals(5, product.getQuantity());
    }

    @Test
    void stockInIncreasesQuantityAndRecordsMovement() {
        when(productRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(product));
        when(currentUserService.requireUser()).thenReturn(actor);
        when(productRepository.save(product)).thenReturn(product);
        when(stockMovementRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        stockService.stockIn(new StockMovementRequest(1L, 3, "Restock"));

        assertEquals(8, product.getQuantity());
        verify(stockMovementRepository).save(any());
    }
}
