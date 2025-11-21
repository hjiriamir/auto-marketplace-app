import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./Config/db.js";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Connexion MongoDB
connectDB();

/* -----------------------------------------------------
   🔥 TEST TEMPORAIRE POUR CRÉER AUTOMATIQUEMENT LA BASE
-------------------------------------------------------- */
const testSchema = new mongoose.Schema({ name: String });
const Test = mongoose.model("Test", testSchema);

const createTestDocument = async () => {
  try {
    await Test.create({ name: "premier test" });
    console.log("➡️ 1er document créé automatiquement !");
  } catch (error) {
    console.log("Erreur création document :", error);
  }
};

// On crée le document après la connexion à la DB
setTimeout(createTestDocument, 1000);
/* -----------------------------------------------------
   🛑 FIN DU TEST TEMPORAIRE 
   (À SUPPRIMER UNE FOIS QUE carstore APPARAÎT DANS COMPASS)
-------------------------------------------------------- */

app.get("/", (req, res) => {
  res.send("API du site de vente de voitures opérationnelle");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
