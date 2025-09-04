// User routes
import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/userController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

// Perfil del usuario logueado
router.get("/me", authMiddleware, getProfile);

// Actualizar perfil
router.put("/me", authMiddleware, updateProfile);

export default router;
