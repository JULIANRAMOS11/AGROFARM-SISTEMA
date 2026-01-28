import { Router } from "express";
import {
  getProduccion,
  getProduccionById,
  getProduccionByPig,
  createProduccion,
  updateProduccion,
  deleteProduccion,
  getEstadisticasProduccion
} from "../controllers/produccion.controller.js";

const router = Router();

router.get("/", getProduccion);
router.get("/estadisticas", getEstadisticasProduccion);
router.get("/:id", getProduccionById);
router.get("/pig/:pig_id", getProduccionByPig);
router.post("/", createProduccion);
router.put("/:id", updateProduccion);
router.delete("/:id", deleteProduccion);

export default router;
