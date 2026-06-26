package com.inventory;

import org.junit.jupiter.api.Test;
import org.springframework.security.test.context.support.WithMockUser;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class ProductAuthorizationTest extends BaseIntegrationTest {

    @Test
    void unauthenticatedCannotListProducts() throws Exception {
        mockMvc.perform(get("/products"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "STAFF")
    void staffCanListProducts() throws Exception {
        mockMvc.perform(get("/products"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "STAFF")
    void staffCannotCreateProduct() throws Exception {
        mockMvc.perform(post("/products")
                        .contentType("application/json")
                        .content("""
                                {
                                  "sku": "SKU-X",
                                  "name": "Blocked",
                                  "reorderLevel": 5,
                                  "unitPrice": 1.00
                                }
                                """))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "STAFF")
    void staffCannotUpdateProduct() throws Exception {
        mockMvc.perform(put("/products/1")
                        .contentType("application/json")
                        .content("""
                                {
                                  "sku": "SKU-X",
                                  "name": "Blocked",
                                  "reorderLevel": 5,
                                  "unitPrice": 1.00
                                }
                                """))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "STAFF")
    void staffCannotDeleteProduct() throws Exception {
        mockMvc.perform(delete("/products/1"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "MANAGER")
    void managerDeleteMissingProductIsNotForbidden() throws Exception {
        mockMvc.perform(delete("/products/9999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void adminDeleteMissingProductIsNotForbidden() throws Exception {
        mockMvc.perform(delete("/products/9999"))
                .andExpect(status().isNotFound());
    }
}
