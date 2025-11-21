import express from "express";
import {
  createRequest,
  getRequests,
  getRequestById,
  updateRequestStatus,
  deleteRequest,
} from "../Controllers/registrationRequestController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Créer une demande (visiteur)
router.post("/createRequest", createRequest);

// Routes admin (protégées)
router.get("/getRequests", protect, getRequests);
router.get("/getRequestById/:id", protect, getRequestById);
router.put("/updateRequestStatus/:id/status", protect, updateRequestStatus);
router.delete("/deleteRequest/:id", protect, deleteRequest);

export default router;
