CREATE TABLE roles (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE users (
    id          BIGSERIAL PRIMARY KEY,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    full_name   VARCHAR(255) NOT NULL,
    enabled     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE user_roles (
    user_id     BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    role_id     BIGINT NOT NULL REFERENCES roles (id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE categories (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE suppliers (
    id            BIGSERIAL PRIMARY KEY,
    name          VARCHAR(255) NOT NULL,
    email         VARCHAR(255),
    phone         VARCHAR(50),
    contact_name  VARCHAR(255),
    created_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
    id             BIGSERIAL PRIMARY KEY,
    sku            VARCHAR(100) NOT NULL UNIQUE,
    name           VARCHAR(255) NOT NULL,
    description    TEXT,
    category_id    BIGINT REFERENCES categories (id),
    supplier_id    BIGINT REFERENCES suppliers (id),
    quantity       INTEGER NOT NULL DEFAULT 0,
    reorder_level  INTEGER NOT NULL DEFAULT 0,
    unit_price     NUMERIC(12, 2) NOT NULL DEFAULT 0,
    created_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE stock_movements (
    id             BIGSERIAL PRIMARY KEY,
    product_id     BIGINT NOT NULL REFERENCES products (id),
    type           VARCHAR(10) NOT NULL,
    quantity       INTEGER NOT NULL,
    reason         VARCHAR(255),
    performed_by   BIGINT REFERENCES users (id),
    created_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs (
    id           BIGSERIAL PRIMARY KEY,
    actor_id     BIGINT REFERENCES users (id),
    action       VARCHAR(100) NOT NULL,
    entity_type  VARCHAR(100) NOT NULL,
    entity_id    VARCHAR(100),
    details      TEXT,
    created_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_name ON products (name);
CREATE INDEX idx_products_category ON products (category_id);
CREATE INDEX idx_stock_movements_product ON stock_movements (product_id);
CREATE INDEX idx_stock_movements_created ON stock_movements (created_at DESC);
CREATE INDEX idx_audit_logs_created ON audit_logs (created_at DESC);
