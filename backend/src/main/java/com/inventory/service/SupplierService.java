package com.inventory.service;

import com.inventory.dto.SupplierDtos.SupplierRequest;
import com.inventory.dto.SupplierDtos.SupplierResponse;
import com.inventory.entity.Supplier;
import com.inventory.exception.ResourceNotFoundException;
import com.inventory.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierService {

    private final SupplierRepository supplierRepository;
    private final AuditService auditService;

    @Transactional(readOnly = true)
    public List<SupplierResponse> list() {
        return supplierRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional
    public SupplierResponse create(SupplierRequest request) {
        Supplier supplier = new Supplier();
        apply(supplier, request);
        supplierRepository.save(supplier);
        auditService.log("SUPPLIER_CREATED", "Supplier", String.valueOf(supplier.getId()), supplier.getName());
        return toResponse(supplier);
    }

    @Transactional
    public SupplierResponse update(Long id, SupplierRequest request) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));
        apply(supplier, request);
        supplierRepository.save(supplier);
        auditService.log("SUPPLIER_UPDATED", "Supplier", String.valueOf(supplier.getId()), supplier.getName());
        return toResponse(supplier);
    }

    @Transactional
    public void delete(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));
        supplierRepository.delete(supplier);
        auditService.log("SUPPLIER_DELETED", "Supplier", String.valueOf(id), supplier.getName());
    }

    private void apply(Supplier supplier, SupplierRequest request) {
        supplier.setName(request.name().trim());
        supplier.setEmail(request.email());
        supplier.setPhone(request.phone());
        supplier.setContactName(request.contactName());
    }

    private SupplierResponse toResponse(Supplier supplier) {
        return new SupplierResponse(
                supplier.getId(),
                supplier.getName(),
                supplier.getEmail(),
                supplier.getPhone(),
                supplier.getContactName(),
                supplier.getCreatedAt()
        );
    }
}
