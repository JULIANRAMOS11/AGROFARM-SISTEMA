import { Router } from "express";
import { validateAuth } from "../middlewares/auth.middleware.js";
import {
  getPerfil,
  updatePerfil,
  cambiarPassword,
  uploadAvatar
} from "../controllers/perfil.controller.js";

const router = Router();

// Todas las rutas de perfil requieren autenticación
router.use(validateAuth);

router.get("/", getPerfil);
router.put("/:id", updatePerfil);
router.post("/:id/password", cambiarPassword);
router.post("/:id/avatar", uploadAvatar);

export default router;
