import express from "express";
import {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
} from "../Controllers/carController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes publiques
router.get("/getCars", getCars);              
router.get("/getCarById/:id", getCarById);    

// Routes protégées (admin)
router.post("/createCar", protect, createCar);         
router.put("/updateCar/:id", protect, updateCar);      
router.delete("/deleteCar/:id", protect, deleteCar);    

export default router;
