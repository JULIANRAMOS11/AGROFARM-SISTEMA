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

app.get("/health", async (_req, res) => {
  try {
    const { rows } = await pool.query("SELECT NOW() AS now");
    res.json({ ok: true, now: rows[0].now });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/pigs", pigsRoutes);
app.use("/api/reproduccion", reproduccionRoutes);
app.use("/api/sanidad", sanidadRoutes);
app.use("/api/produccion", produccionRoutes);
app.use("/api/nutricion", nutricionRoutes);
app.use("/api/perfil", perfilRoutes);

app.use((req, res) => res.status(404).json({ error: "Not found" }));

app.listen(PORT, () => {
  console.log(`API AGROFARM running on http://localhost:${PORT}`);
});
