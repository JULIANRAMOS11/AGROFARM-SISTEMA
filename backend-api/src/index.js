import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import pigsRoutes from "./routes/pigs.routes.js";
import reproduccionRoutes from "./routes/reproduccion.routes.js";
import sanidadRoutes from "./routes/sanidad.routes.js";
import produccionRoutes from "./routes/produccion.routes.js";
import nutricionRoutes from "./routes/nutricion.routes.js";
import perfilRoutes from "./routes/perfil.routes.js";
import { pool } from "./config/db.js";
import { requestLogger } from "./middlewares/auth.middleware.js";
import { notFound, errorHandler } from "./middlewares/errorHandler.middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Configuración de CORS para producción y desarrollo
const allowedOrigins = [
  "http://localhost:3000",
  "https://agrofarm-sistema.vercel.app"
];

app.use(cors({ 
  origin: allowedOrigins,
  credentials: true 
}));
app.use(express.json());
app.use(requestLogger); // Log de todas las peticiones

// Health check endpoints (ligeros para mantener el servidor activo)
const healthResponse = (_req, res) => {
  res.json({ ok: true, status: "alive", timestamp: new Date().toISOString() });
};

app.get("/health", healthResponse);
app.head("/health", healthResponse);

app.get("/api/health", healthResponse);
app.head("/api/health", healthResponse);

// Health check completo con DB (opcional)
app.get("/api/health/db", async (_req, res) => {
  try {
    const { rows } = await pool.query("SELECT NOW() AS now");
    res.json({ ok: true, database: "connected", now: rows[0].now });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Rutas de la API
app.use("/api/auth", authRoutes);
app.use("/api/pigs", pigsRoutes);
app.use("/api/reproduccion", reproduccionRoutes);
app.use("/api/sanidad", sanidadRoutes);
app.use("/api/produccion", produccionRoutes);
app.use("/api/nutricion", nutricionRoutes);
app.use("/api/perfil", perfilRoutes);

// Manejo de errores (debe ir al final)
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 API AGROFARM corriendo en http://localhost:${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
