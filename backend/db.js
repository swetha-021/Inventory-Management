//If environment variables exist → use them Otherwise → use localhost

const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "inventory_app",
  password: process.env.DB_PASSWORD || "Swethaprakash*123",
  port: 5432,
});

module.exports = pool;
