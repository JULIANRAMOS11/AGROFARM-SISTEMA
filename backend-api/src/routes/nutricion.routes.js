import { Router } from "express";
import {
  getAlimentos,
  getAlimentoById,
  createAlimento,
  updateAlimento,
  deleteAlimento,
  getConsumos,
  getConsumoByPig,
  createConsumo,
  updateConsumo,
  deleteConsumo,
  getEstadisticasConsumo
} from "../controllers/nutricion.controller.js";

const router = Router();

// Rutas de alimentos (catálogo)
router.get("/alimentos", getAlimentos);
router.get("/alimentos/:id", getAlimentoById);
router.post("/alimentos", createAlimento);
router.put("/alimentos/:id", updateAlimento);
router.delete("/alimentos/:id", deleteAlimento);

// Rutas de consumo
router.get("/consumos", getConsumos);
router.get("/consumos/estadisticas", getEstadisticasConsumo);
router.get("/consumos/pig/:pig_id", getConsumoByPig);
router.post("/consumos", createConsumo);
router.put("/consumos/:id", updateConsumo);
router.delete("/consumos/:id", deleteConsumo);

export default router;
