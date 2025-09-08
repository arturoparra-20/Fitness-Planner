import { Router } from "express";
import {
  register,
  login,
  googleLogin,
  verifyOtpController,
} from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.post("/verify-otp", verifyOtpController);

export default router;
