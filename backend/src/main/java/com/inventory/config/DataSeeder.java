package com.inventory.config;

import com.inventory.entity.Category;
import com.inventory.entity.MovementType;
import com.inventory.entity.Product;
import com.inventory.entity.Role;
import com.inventory.entity.RoleName;
import com.inventory.entity.StockMovement;
import com.inventory.entity.Supplier;
import com.inventory.entity.User;
import com.inventory.repository.CategoryRepository;
import com.inventory.repository.ProductRepository;
import com.inventory.repository.RoleRepository;
import com.inventory.repository.StockMovementRepository;
import com.inventory.repository.SupplierRepository;
import com.inventory.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Set;

@Component
@Profile("!test")
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;
    private final StockMovementRepository stockMovementRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        seedRoles();
        if (userRepository.count() > 0) {
            return;
        }
        User admin = seedUser("admin@inventory.local", "Admin123!", "System Admin", RoleName.ADMIN);
        seedUser("manager@inventory.local", "Manager123!", "Store Manager", RoleName.MANAGER);
        User staff = seedUser("staff@inventory.local", "Staff123!", "Warehouse Staff", RoleName.STAFF);

        Category electronics = category("Electronics");
        Category office = category("Office Supplies");
        Category grocery = category("Grocery");

        Supplier acme = supplier("Acme Wholesale", "orders@acme.test", "555-0100", "Alex Chen");
        Supplier northwind = supplier("Northwind Parts", "hello@northwind.test", "555-0142", "Priya Shah");

        seedProduct("SKU-1001", "USB-C Hub", "7-in-1 USB-C hub", electronics, acme, 8, 10, "49.99", admin);
        seedProduct("SKU-1002", "Wireless Mouse", "Ergonomic wireless mouse", electronics, acme, 40, 15, "24.50", staff);
        seedProduct("SKU-2001", "Copy Paper", "Letter size 500 sheets", office, northwind, 12, 20, "6.99", staff);
        seedProduct("SKU-2002", "Ballpoint Pens", "Box of 12 black pens", office, northwind, 80, 25, "3.49", admin);
        seedProduct("SKU-3001", "Coffee Beans 1kg", "Medium roast", grocery, acme, 4, 8, "18.00", staff);
    }

    private void seedRoles() {
        for (RoleName name : RoleName.values()) {
            roleRepository.findByName(name).orElseGet(() -> {
                Role role = new Role();
                role.setName(name);
                return roleRepository.save(role);
            });
        }
    }

    private User seedUser(String email, String rawPassword, String fullName, RoleName roleName) {
        Role role = roleRepository.findByName(roleName).orElseThrow();
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setFullName(fullName);
        user.setEnabled(true);
        user.setRoles(Set.of(role));
        return userRepository.save(user);
    }

    private Category category(String name) {
        Category category = new Category();
        category.setName(name);
        return categoryRepository.save(category);
    }

    private Supplier supplier(String name, String email, String phone, String contactName) {
        Supplier supplier = new Supplier();
        supplier.setName(name);
        supplier.setEmail(email);
        supplier.setPhone(phone);
        supplier.setContactName(contactName);
        return supplierRepository.save(supplier);
    }

    private void seedProduct(
            String sku,
            String name,
            String description,
            Category category,
            Supplier supplier,
            int quantity,
            int reorderLevel,
            String price,
            User actor
    ) {
        Product product = new Product();
        product.setSku(sku);
        product.setName(name);
        product.setDescription(description);
        product.setCategory(category);
        product.setSupplier(supplier);
        product.setQuantity(quantity);
        product.setReorderLevel(reorderLevel);
        product.setUnitPrice(new BigDecimal(price));
        productRepository.save(product);

        StockMovement movement = new StockMovement();
        movement.setProduct(product);
        movement.setType(MovementType.IN);
        movement.setQuantity(quantity);
        movement.setReason("Initial stock");
        movement.setPerformedBy(actor);
        stockMovementRepository.save(movement);
    }
}
