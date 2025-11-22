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
import uploadAdminRoutes from "./Routes/uploadAdminRoutes.js";

import carRoute from "./Routes/cars.js";

dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// ✅ Correction CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes API
app.use("/api/cars", carRoutes);
app.use("/api/user", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/upload-admin", uploadAdminRoutes);


app.use("/api/carse", carRoute);

// Static
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connection check
mongoose.connection.once("open", () => {
  console.log("MongoDB connecté :", mongoose.connection.host);
});

app.get("/", (req, res) => {
  res.send("API du site de vente de voitures opérationnelle");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
