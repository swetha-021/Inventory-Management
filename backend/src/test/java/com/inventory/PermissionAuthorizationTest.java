package com.inventory;

import org.junit.jupiter.api.Test;
import org.springframework.security.test.context.support.WithMockUser;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class PermissionAuthorizationTest extends BaseIntegrationTest {

    @Test
    @WithMockUser(roles = "STAFF")
    void staffCannotViewAuditLogs() throws Exception {
        mockMvc.perform(get("/audit-logs"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "MANAGER")
    void managerCannotViewAuditLogs() throws Exception {
        mockMvc.perform(get("/audit-logs"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void adminCanViewAuditLogs() throws Exception {
        mockMvc.perform(get("/audit-logs"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "STAFF")
    void staffCannotViewLowStockReport() throws Exception {
        mockMvc.perform(get("/reports/low-stock"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "MANAGER")
    void managerCanViewLowStockReport() throws Exception {
        mockMvc.perform(get("/reports/low-stock"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "STAFF")
    void staffCannotListUsers() throws Exception {
        mockMvc.perform(get("/users"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void adminCanListUsers() throws Exception {
        mockMvc.perform(get("/users"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "STAFF")
    void staffCannotManageSuppliers() throws Exception {
        mockMvc.perform(get("/suppliers"))
                .andExpect(status().isForbidden());
    }
}
