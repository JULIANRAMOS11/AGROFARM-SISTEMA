import { Router } from "express";
import { validateAuth } from "../middlewares/auth.middleware.js";
import {
  getSanidad,
  getSanidadById,
  getSanidadByPig,
  createSanidad,
  updateSanidad,
  deleteSanidad,
  getProximasAplicaciones
} from "../controllers/sanidad.controller.js";

const router = Router();

// Todas las rutas de sanidad requieren autenticación
router.use(validateAuth);

router.get("/", getSanidad);
router.get("/proximas", getProximasAplicaciones);
router.get("/:id", getSanidadById);
router.get("/pig/:pig_id", getSanidadByPig);
router.post("/", createSanidad);
router.put("/:id", updateSanidad);
router.delete("/:id", deleteSanidad);

export default router;
