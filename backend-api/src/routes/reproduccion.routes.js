import { Router } from "express";
import { validateAuth } from "../middlewares/auth.middleware.js";
import {
  getReproduccion,
  getReproduccionById,
  createReproduccion,
  updateReproduccion,
  deleteReproduccion,
  getPartos,
  createParto,
  updateParto,
  deleteParto
} from "../controllers/reproduccion.controller.js";

const router = Router();

// Todas las rutas de reproducción requieren autenticación
router.use(validateAuth);

// Rutas de reproducción
router.get("/", getReproduccion);
router.get("/:id", getReproduccionById);
router.post("/", createReproduccion);
router.put("/:id", updateReproduccion);
router.delete("/:id", deleteReproduccion);

// Rutas de partos
router.get("/partos/all", getPartos);
router.post("/partos", createParto);
router.put("/partos/:id", updateParto);
router.delete("/partos/:id", deleteParto);

export default router;
