import { Router } from "express";
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
