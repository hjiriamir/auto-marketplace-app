import express from "express";
import upload from "../middleware/uploadAdminMiddleware.js";

const router = express.Router();

router.post("/images", upload.array("images", 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Aucun fichier reçu" });
    }

    const files = req.files.map(file => ({
      filename: file.filename,
      url: `http://localhost:5000/uploads/admin/${file.filename}`, // URL complète
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
