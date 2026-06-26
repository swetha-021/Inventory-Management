package com.inventory.dto;

import com.inventory.entity.RoleName;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.Set;

public final class AuthDtos {
    private AuthDtos() {
    }

    public record RegisterRequest(
            @Email @NotBlank String email,
            @NotBlank @Size(min = 8, max = 72) String password,
            @NotBlank @Size(max = 255) String fullName
    ) {
    }

    public record LoginRequest(
            @Email @NotBlank String email,
            @NotBlank String password
    ) {
    }

    public record AuthResponse(
            String token,
            String tokenType,
            Long userId,
            String email,
            String fullName,
            Set<RoleName> roles
    ) {
    }

    public record UserResponse(
            Long id,
            String email,
            String fullName,
            boolean enabled,
            Set<RoleName> roles,
            Instant createdAt
    ) {
    }

    public record UpdateRoleRequest(
            @jakarta.validation.constraints.NotNull RoleName role
    ) {
    }

    public record UpdateEnabledRequest(
            @jakarta.validation.constraints.NotNull Boolean enabled
    ) {
    }
}
