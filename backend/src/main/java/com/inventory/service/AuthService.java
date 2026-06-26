package com.inventory.service;

import com.inventory.dto.AuthDtos.AuthResponse;
import com.inventory.dto.AuthDtos.LoginRequest;
import com.inventory.dto.AuthDtos.RegisterRequest;
import com.inventory.dto.AuthDtos.UpdateEnabledRequest;
import com.inventory.dto.AuthDtos.UpdateRoleRequest;
import com.inventory.dto.AuthDtos.UserResponse;
import com.inventory.entity.Role;
import com.inventory.entity.RoleName;
import com.inventory.entity.User;
import com.inventory.exception.DuplicateResourceException;
import com.inventory.exception.ResourceNotFoundException;
import com.inventory.repository.RoleRepository;
import com.inventory.repository.UserRepository;
import com.inventory.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final AuditService auditService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Email already registered");
        }
        Role staffRole = roleRepository.findByName(RoleName.STAFF)
                .orElseThrow(() -> new ResourceNotFoundException("STAFF role is not configured"));

        User user = new User();
        user.setEmail(request.email().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setFullName(request.fullName());
        user.setEnabled(true);
        user.setRoles(Set.of(staffRole));
        userRepository.save(user);

        auditService.log("USER_REGISTERED", "User", String.valueOf(user.getId()), user.getEmail());
        return toAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email().toLowerCase(), request.password())
        );
        User user = userRepository.findByEmail(request.email().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return toAuthResponse(user);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> listUsers() {
        return userRepository.findAll().stream().map(this::toUserResponse).toList();
    }

    @Transactional
    public UserResponse updateRole(Long userId, UpdateRoleRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Role role = roleRepository.findByName(request.role())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        user.setRoles(Set.of(role));
        userRepository.save(user);
        auditService.log("USER_ROLE_CHANGED", "User", String.valueOf(user.getId()),
                user.getEmail() + " -> " + request.role());
        return toUserResponse(user);
    }

    @Transactional
    public UserResponse updateEnabled(Long userId, UpdateEnabledRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setEnabled(request.enabled());
        userRepository.save(user);
        auditService.log(request.enabled() ? "USER_ENABLED" : "USER_DISABLED", "User",
                String.valueOf(user.getId()), user.getEmail());
        return toUserResponse(user);
    }

    public UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.isEnabled(),
                user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()),
                user.getCreatedAt()
        );
    }

    private AuthResponse toAuthResponse(User user) {
        UserDetails details = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(user.getId(), details);
        return new AuthResponse(
                token,
                "Bearer",
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRoles().stream().map(Role::getName).collect(Collectors.toSet())
        );
    }
}
