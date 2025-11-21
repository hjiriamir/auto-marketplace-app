import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./Config/db.js";
import mongoose from "mongoose";

import carRoutes from "./Routes/carRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import messageRoutes from "./Routes/contactMessageRoutes.js";
import serviceRoutes from "./Routes/registrationRequestRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Routes API
app.use("/api/cars", carRoutes);
app.use("/api/user", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/services", serviceRoutes);

// Vérification de la connexion
mongoose.connection.once("open", () => {
  console.log("MongoDB connecté :", mongoose.connection.host);
});

app.get("/", (req, res) => {
  res.send("API du site de vente de voitures opérationnelle");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
