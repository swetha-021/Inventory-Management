package com.inventory.service;

import com.inventory.dto.ProductDtos.ProductRequest;
import com.inventory.dto.ProductDtos.ProductResponse;
import com.inventory.entity.Category;
import com.inventory.entity.Product;
import com.inventory.entity.Supplier;
import com.inventory.exception.DuplicateResourceException;
import com.inventory.exception.ResourceNotFoundException;
import com.inventory.repository.CategoryRepository;
import com.inventory.repository.ProductRepository;
import com.inventory.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final AuditService auditService;

    @Transactional(readOnly = true)
    public Page<ProductResponse> search(String search, Long categoryId, Long supplierId, Pageable pageable) {
        return productRepository.search(search, categoryId, supplierId, pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public ProductResponse getById(Long id) {
        return toResponse(findProduct(id));
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        if (productRepository.existsBySkuIgnoreCase(request.sku())) {
            throw new DuplicateResourceException("SKU already exists");
        }
        Product product = new Product();
        apply(product, request);
        product.setQuantity(0);
        productRepository.save(product);
        auditService.log("PRODUCT_CREATED", "Product", String.valueOf(product.getId()), product.getSku());
        return toResponse(product);
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = findProduct(id);
        if (productRepository.existsBySkuIgnoreCaseAndIdNot(request.sku(), id)) {
            throw new DuplicateResourceException("SKU already exists");
        }
        apply(product, request);
        productRepository.save(product);
        auditService.log("PRODUCT_UPDATED", "Product", String.valueOf(product.getId()), product.getSku());
        return toResponse(product);
    }

    @Transactional
    public void delete(Long id) {
        Product product = findProduct(id);
        productRepository.delete(product);
        auditService.log("PRODUCT_DELETED", "Product", String.valueOf(id), product.getSku());
    }

    public ProductResponse toResponse(Product product) {
        Category category = product.getCategory();
        Supplier supplier = product.getSupplier();
        return new ProductResponse(
                product.getId(),
                product.getSku(),
                product.getName(),
                product.getDescription(),
                category == null ? null : category.getId(),
                category == null ? null : category.getName(),
                supplier == null ? null : supplier.getId(),
                supplier == null ? null : supplier.getName(),
                product.getQuantity(),
                product.getReorderLevel(),
                product.getUnitPrice(),
                product.isLowStock(),
                product.getCreatedAt(),
                product.getUpdatedAt()
        );
    }

    private void apply(Product product, ProductRequest request) {
        product.setSku(request.sku().trim());
        product.setName(request.name().trim());
        product.setDescription(request.description());
        product.setReorderLevel(request.reorderLevel());
        product.setUnitPrice(request.unitPrice());
        product.setCategory(request.categoryId() == null ? null : categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found")));
        product.setSupplier(request.supplierId() == null ? null : supplierRepository.findById(request.supplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found")));
    }

    private Product findProduct(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }
}
