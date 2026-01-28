import { Router } from "express";
import {
  getPerfil,
  updatePerfil,
  cambiarPassword,
  uploadAvatar
} from "../controllers/perfil.controller.js";

const router = Router();

router.get("/", getPerfil);
router.put("/:id", updatePerfil);
router.post("/:id/password", cambiarPassword);
router.post("/:id/avatar", uploadAvatar);

export default router;
