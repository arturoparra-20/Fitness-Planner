import { Router } from "express";
import {
  generatePlan,
  listPlans,
  getPlanById,
  deletePlan,
} from "../controllers/planController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.post("/generate", authMiddleware, generatePlan);
router.get("/", authMiddleware, listPlans);
router.get("/:id", authMiddleware, getPlanById);
router.delete("/:id", authMiddleware, deletePlan);

export default router;
