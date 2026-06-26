package com.inventory.controller;

import com.inventory.dto.AuthDtos.UpdateEnabledRequest;
import com.inventory.dto.AuthDtos.UpdateRoleRequest;
import com.inventory.dto.AuthDtos.UserResponse;
import com.inventory.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final AuthService authService;

    @GetMapping
    public List<UserResponse> list() {
        return authService.listUsers();
    }

    @PutMapping("/{id}/role")
    public UserResponse updateRole(@PathVariable Long id, @Valid @RequestBody UpdateRoleRequest request) {
        return authService.updateRole(id, request);
    }

    @PatchMapping("/{id}/enabled")
    public UserResponse updateEnabled(@PathVariable Long id, @Valid @RequestBody UpdateEnabledRequest request) {
        return authService.updateEnabled(id, request);
    }
}
