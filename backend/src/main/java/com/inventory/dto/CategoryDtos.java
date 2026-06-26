package com.inventory.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class CategoryDtos {
    private CategoryDtos() {
    }

    public record CategoryRequest(
            @NotBlank @Size(max = 100) String name
    ) {
    }

    public record CategoryResponse(Long id, String name) {
    }
}
