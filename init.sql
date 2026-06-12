CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS employees (
    employee_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT
);

-- Usuario administrador
INSERT INTO users (user_name, email, password)
VALUES (
    'Javier',
    'javier@gmail.com',
    '$2b$10$UBMUEluD4mAOlDZxIuGJMueiWIk1lmuSKY7w0K1gWo8sgaG.JklLW'
)
ON CONFLICT (email) DO NOTHING;

-- Empleados de ejemplo
INSERT INTO employees (
    first_name,
    last_name,
    phone,
    email,
    address
)
VALUES
(
    'David',
    'González',
    '4421234501',
    'david.gonzalez@tallernode.com',
    'Querétaro, Qro.'
),
(
    'Juan',
    'Pérez',
    '4421234502',
    'juan.perez@tallernode.com',
    'El Marqués, Qro.'
),
(
    'Carlos',
    'Ramírez',
    '4421234503',
    'carlos.ramirez@tallernode.com',
    'Corregidora, Qro.'
),
(
    'Ana',
    'Martínez',
    '4421234504',
    'ana.martinez@tallernode.com',
    'Juriquilla, Qro.'
),
(
    'Mariana',
    'López',
    '4421234505',
    'mariana.lopez@tallernode.com',
    'Centro Sur, Qro.'
),
(
    'Stuart',
    'Zender',
    '4421234506',
    'stuart.zender@tallernode.com',
    'Albania'
),
(
    'Jay',
    'Kay',
    '4421234507',
    'jay.kay@tallernode.com',
    'República Checa'
),
(
    'Verónica',
    'Hernández',
    '4421234508',
    'veronica.hernandez@tallernode.com',
    'Jurica, Qro.'
);

-- Evitar duplicados si vuelves a ejecutar el script
ALTER TABLE employees
ADD CONSTRAINT employees_email_unique UNIQUE (email);