-- =============================================================================
-- SETUP RÁPIDO PARA SUPABASE - TABLAS ESENCIALES
-- Ejecuta esto en Supabase SQL Editor si no tienes tablas creadas
-- =============================================================================

-- 1. TABLA USERS (Esencial para login)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. CREAR UN USUARIO DE PRUEBA
-- Password: admin123 (hash bcrypt)
INSERT INTO users (username, password_hash, role)
VALUES ('admin', '$2a$10$rZ5YvPxVvG.QYb3pJxj8FuVGHJ3TQvQ7Mn8LKQx8gZC7EQxR0xR0m', 'ADMIN')
ON CONFLICT (username) DO NOTHING;

-- Verificar
SELECT id, username, role, created_at FROM users;
