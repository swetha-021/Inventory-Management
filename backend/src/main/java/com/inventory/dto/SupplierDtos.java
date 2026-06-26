package com.inventory.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.Instant;

public final class SupplierDtos {
    private SupplierDtos() {
    }

    public record SupplierRequest(
            @NotBlank @Size(max = 255) String name,
            @Email String email,
            @Size(max = 50) String phone,
            @Size(max = 255) String contactName
    ) {
    }

    public record SupplierResponse(
            Long id,
            String name,
            String email,
            String phone,
            String contactName,
            Instant createdAt
    ) {
    }
}
