import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./Config/db.js";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import carRoutes from "./Routes/carRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import messageRoutes from "./Routes/contactMessageRoutes.js";
import serviceRoutes from "./Routes/registrationRequestRoutes.js";
import uploadRoutes from "./Routes/uploadRoutes.js";

dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());

// Routes API
app.use("/api/cars", carRoutes);
app.use("/api/user", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/upload", uploadRoutes);

// Servir le dossier uploads en statique pour les URL publiques
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Vérification de la connexion
mongoose.connection.once("open", () => {
  console.log("MongoDB connecté :", mongoose.connection.host);
});

app.get("/", (req, res) => {
  res.send("API du site de vente de voitures opérationnelle");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
