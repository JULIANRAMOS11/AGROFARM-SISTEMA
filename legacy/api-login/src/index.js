// src/index.js
// API de ejemplo para registro e inicio de sesión
// Evidencia GA7-220501096-AA5-EV01
// Autor: Julian Ramos Guarin

import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;

// Configuración básica de rutas de archivos (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta del archivo donde se almacenan los usuarios
const USERS_FILE_PATH = path.join(__dirname, "users.json");

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Middleware para limpiar la URL (elimina saltos de línea o espacios raros)
app.use((req, res, next) => {
  if (req.url) {
    req.url = req.url.replace(/%0A/gi, "").trim();
  }
  next();
});

/**
 * ✅ CONEXIÓN A SUPABASE (PostgreSQL)
 * SOLUCIÓN al error: self-signed certificate in certificate chain
 * -> ssl con rejectUnauthorized:false (solo para desarrollo)
 */
const DATABASE_URL = process.env.DATABASE_URL;

let pool = null;

if (DATABASE_URL) {
  pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  console.log("⚠️ DATABASE_URL no está definida en el .env");
}

/**
 * Lee la lista de usuarios desde users.json
 */
function readUsers() {
  try {
    const data = fs.readFileSync(USERS_FILE_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error leyendo users.json:", error);
    return [];
  }
}

/**
 * Guarda la lista de usuarios en users.json
 */
function writeUsers(users) {
  fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2), "utf8");
}

/**
 * Ruta de prueba para verificar que el servicio está arriba.
 */
app.get("/", (req, res) => {
  res.json({
    mensaje: "API de autenticación AGROFARM funcionando correctamente",
  });
});

/**
 * ✅ TEST DE CONEXIÓN A BASE DE DATOS (SUPABASE)
 * URL: http://localhost:3001/db-test
 */
app.get("/db-test", async (req, res) => {
  try {
    if (!pool) {
      return res.status(500).json({
        ok: false,
        mensaje: "No existe conexión pool. Revisa DATABASE_URL en .env",
      });
    }

    const result = await pool.query("SELECT NOW() as fecha_servidor");
    return res.json({
      ok: true,
      mensaje: "Conexión a PostgreSQL (Supabase) OK ✅",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error conectando a la BD:", error.message);
    return res.status(500).json({
      ok: false,
      mensaje: "Error conectando a PostgreSQL ❌",
      error: error.message,
    });
  }
});

/**
 * Registro de usuario
 */
app.post("/api/register", (req, res) => {
  const { username, password } = req.body;

  // Validaciones básicas
  if (!username || !password) {
    return res.status(400).json({
      error: "El usuario y la contraseña son obligatorios",
    });
  }

  const users = readUsers();

  // Verificar si el usuario ya existe
  const existingUser = users.find((u) => u.username === username);
  if (existingUser) {
    return res.status(409).json({
      error: "El usuario ya existe. Intente con otro nombre de usuario.",
    });
  }

  // Encriptar la contraseña
  const passwordHash = bcrypt.hashSync(password, 10);

  // Crear nuevo usuario
  const newUser = {
    id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
    username,
    passwordHash,
    rol: "USER",
  };

  users.push(newUser);
  writeUsers(users);

  return res.status(201).json({
    mensaje: "Usuario registrado correctamente",
    usuario: {
      id: newUser.id,
      username: newUser.username,
      rol: newUser.rol,
    },
  });
});

/**
 * Inicio de sesión
 */
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  // Validaciones básicas
  if (!username || !password) {
    return res.status(400).json({
      error: "El usuario y la contraseña son obligatorios",
    });
  }

  const users = readUsers();

  // Buscar usuario por nombre
  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(401).json({
      error: "Error en la autenticación: usuario o contraseña incorrectos",
    });
  }

  // Comparar contraseña
  const isValidPassword = bcrypt.compareSync(password, user.passwordHash);
  if (!isValidPassword) {
    return res.status(401).json({
      error: "Error en la autenticación: usuario o contraseña incorrectos",
    });
  }

  // Autenticación correcta
  return res.json({
    mensaje: "Autenticación satisfactoria",
    usuario: {
      id: user.id,
      username: user.username,
      rol: user.rol,
    },
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});