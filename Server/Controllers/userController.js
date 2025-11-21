import User from "../Models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// 🔑 Générer JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// --------------------------
// Connexion de l'admin
// --------------------------
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email ou mot de passe invalide" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Email ou mot de passe invalide" });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      image: user.image,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la connexion", error });
  }
};


export const logoutUser = async (req, res) => {
    try {
      // Si tu utilises des cookies pour stocker le token
      res.clearCookie("token", { httpOnly: true });
      res.status(200).json({ message: "Déconnecté avec succès" });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la déconnexion", error });
    }
  };


// --------------------------
// Demande de réinitialisation du mot de passe
// --------------------------
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1h
    await user.save();

    // Ici tu enverras l’email avec le token
    res.status(200).json({ message: "Token généré pour la réinitialisation", token });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la demande de reset", error });
  }
};

// --------------------------
// Réinitialisation du mot de passe
// --------------------------
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Token invalide ou expiré" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du reset du mot de passe", error });
  }
};

// --------------------------
// Mise à jour du profil
// --------------------------
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const { name, phone, image } = req.body;

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.image = image || user.image;

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du profil", error });
  }
};
