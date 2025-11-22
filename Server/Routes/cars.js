import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import Car from "../Models/Car.js"; 
import { createCar } from "../Controllers/carController.js";
import { protect } from "../middleware/authMiddleware.js";
import fs from "fs";
import path from "path";


const router = express.Router();

// Route pour créer une voiture AVEC upload d'images
router.post("/createCar", protect, upload.array("images", 10), async (req, res) => {
  try {
    console.log("📥 Requête création voiture reçue:", req.body);
    console.log("📸 Fichiers reçus:", req.files);

    const carData = {
      ...req.body,
      seller: JSON.parse(req.body.seller),
    };

    if (req.files && req.files.length > 0) {
      carData.images = req.files.map(file =>
        `http://localhost:5000/uploads/cars/${file.filename}`
      );
      console.log("🖼️ URLs images générées:", carData.images);
    }

    console.log("🚗 Données finales pour création:", carData);

    const car = new Car(carData);
    const savedCar = await car.save();
    
    console.log("✅ Voiture créée avec succès:", savedCar._id);
    res.status(201).json(savedCar);

  } catch (error) {
    console.error("❌ Erreur création voiture:", error);
    res.status(500).json({
      message: "Erreur lors de la création de la voiture",
      error: error.message
    });
  }
});


router.put(
  "/updateCar/:id",
  protect,
  upload.array("images", 10),
  async (req, res) => {
    try {
      const carId = req.params.id;

      console.log("📥 Données reçues pour update:", req.body);
      console.log("📸 Nouvelles images reçues:", req.files);

      const existingCar = await Car.findById(carId);
      if (!existingCar) {
        return res.status(404).json({ message: "Voiture non trouvée" });
      }

      let images = existingCar.images;

      if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file =>
          `http://localhost:5000/uploads/cars/${file.filename}`
        );

        if (req.body.replaceImages === "true") {
          // Supprimer physiquement les anciens fichiers images
          for (const imageUrl of existingCar.images) {
            // Extraire le nom du fichier à partir de l'URL
            const filename = imageUrl.split("/").pop();
            // Construire le chemin complet du fichier sur le serveur
            const filePath = path.join(process.cwd(), "uploads", "cars", filename);

            try {
              if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`Fichier supprimé: ${filename}`);
              } else {
                console.warn(`Fichier non trouvé pour suppression: ${filename}`);
              }
            } catch (err) {
              console.error(`Erreur lors de la suppression du fichier ${filename}:`, err);
            }
          }

          images = newImages; // Remplacer complètement les images en BDD
        } else {
          // Ajouter les nouvelles images aux anciennes (sans suppression)
          images = [...images, ...newImages];
        }

        console.log("🖼️ Images finales pour update:", images);
      }

      const updateData = {
        ...req.body,
        images,
      };

      if (req.body.seller) {
        updateData.seller = JSON.parse(req.body.seller);
      }

      const updatedCar = await Car.findByIdAndUpdate(
        carId,
        updateData,
        { new: true }
      );

      res.status(200).json(updatedCar);

    } catch (error) {
      console.error("❌ Erreur update voiture:", error);
      res.status(500).json({
        message: "Erreur lors de la mise à jour de la voiture",
        error: error.message,
      });
    }
  }
);



// Route upload images
router.post("/images", upload.array("images", 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Aucun fichier reçu" });
    }

    const files = req.files.map(file => ({
      filename: file.filename,
      url: `http://localhost:5000/uploads/cars/${file.filename}`,
      originalname: file.originalname,
      size: file.size
    }));

    res.status(200).json({
      message: "Images uploadées avec succès",
      files
    });

  } catch (error) {
    console.error("Erreur upload:", error);
    res.status(500).json({ message: "Erreur lors de l'upload des images", error: error.message });
  }
});

export default router;
