package com.inventory;

import com.inventory.entity.Role;
import com.inventory.entity.RoleName;
import com.inventory.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public abstract class BaseIntegrationTest {

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected RoleRepository roleRepository;

    protected void seedRoles() {
        for (RoleName name : RoleName.values()) {
            roleRepository.findByName(name).orElseGet(() -> {
                Role role = new Role();
                role.setName(name);
                return roleRepository.save(role);
            });
        }
    }
}
