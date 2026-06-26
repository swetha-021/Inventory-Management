package com.inventory.service;

import com.inventory.dto.CategoryDtos.CategoryRequest;
import com.inventory.dto.CategoryDtos.CategoryResponse;
import com.inventory.entity.Category;
import com.inventory.exception.DuplicateResourceException;
import com.inventory.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final AuditService auditService;

    @Transactional(readOnly = true)
    public List<CategoryResponse> list() {
        return categoryRepository.findAll().stream()
                .map(category -> new CategoryResponse(category.getId(), category.getName()))
                .toList();
    }

    @Transactional
    public CategoryResponse create(CategoryRequest request) {
        if (categoryRepository.existsByNameIgnoreCase(request.name())) {
            throw new DuplicateResourceException("Category already exists");
        }
        Category category = new Category();
        category.setName(request.name().trim());
        categoryRepository.save(category);
        auditService.log("CATEGORY_CREATED", "Category", String.valueOf(category.getId()), category.getName());
        return new CategoryResponse(category.getId(), category.getName());
    }
}
