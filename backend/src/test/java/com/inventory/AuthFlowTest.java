package com.inventory;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AuthFlowTest extends BaseIntegrationTest {

    @BeforeEach
    void setUp() {
        seedRoles();
    }

    @Test
    void registerCreatesStaffUserAndReturnsJwt() throws Exception {
        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "new.staff@inventory.local",
                                  "password": "Password123",
                                  "fullName": "New Staff"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.roles[0]").value("STAFF"));
    }

    @Test
    void loginRejectsUnknownUser() throws Exception {
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "nobody@inventory.local",
                                  "password": "Password123"
                                }
                                """))
                .andExpect(status().isUnauthorized());
    }
}
