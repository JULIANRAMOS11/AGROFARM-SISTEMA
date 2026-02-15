import { Router } from "express";
import { validateAuth } from "../middlewares/auth.middleware.js";
import {
  getAllPigs,
  getPigById,
  createPig,
  updatePig,
  updatePigStatus,
  deletePig,
} from "../controllers/pigs.controller.js";

const router = Router();

// Todas las rutas de cerdos requieren autenticación
router.use(validateAuth);

router.get("/", getAllPigs);
router.get("/:id", getPigById);
router.post("/", createPig);
router.put("/:id", updatePig);
router.patch("/:id/status", updatePigStatus);
router.delete("/:id", deletePig);

export default router;
