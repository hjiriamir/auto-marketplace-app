import express from "express";
import {
  loginUser,
  forgotPassword,
  resetPassword,
  updateProfile
} from "../Controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Login (obligatoire)
router.post("/login", loginUser);

// Reset password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Mise à jour du profil (JWT requis)
router.put("/profile", protect, updateProfile);

export default router;
