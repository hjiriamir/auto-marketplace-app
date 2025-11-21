import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Utilisez un chemin absolu
const uploadDir = path.join(__dirname, '..', 'uploads', 'cars');
console.log("Chemin ABSOLU du dossier d'upload:", uploadDir);

if (!fs.existsSync(uploadDir)) {
  console.log("Création du dossier:", uploadDir);
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Destination:", uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix + ext;
    console.log("Nom du fichier généré:", filename);
    cb(null, filename);
  }
});


const fileFilter = (req, file, cb) => {
  console.log("Type de fichier reçu:", file.mimetype);
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    console.log("Fichier rejeté - pas une image:", file.mimetype);
    cb(new Error("Seules les images sont autorisées"), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;