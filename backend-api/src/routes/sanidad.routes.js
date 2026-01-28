import { Router } from "express";
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

router.get("/", getSanidad);
router.get("/proximas", getProximasAplicaciones);
router.get("/:id", getSanidadById);
router.get("/pig/:pig_id", getSanidadByPig);
router.post("/", createSanidad);
router.put("/:id", updateSanidad);
router.delete("/:id", deleteSanidad);

export default router;
