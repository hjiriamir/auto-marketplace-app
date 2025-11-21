import express from "express";
import {
  createMessage,
  getMessages,
  getMessageById,
  deleteMessage,
} from "../Controllers/contactMessageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Créer un message (accessible aux visiteurs)
router.post("/createMessage", createMessage);

// Routes admin (protégées)
router.get("/getMessages", protect, getMessages);
router.get("/getMessageById/:id", protect, getMessageById);
router.delete("/deleteMessage/:id", protect, deleteMessage);

export default router;
