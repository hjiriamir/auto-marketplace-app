import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./User.js";
import connectDB from "../Config/db.js";

//dotenv.config();
connectDB();

const createAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("Admin déjà créé !");
      process.exit();
    }

    const passwordHash = await bcrypt.hash("MotDePasseAdmin123!", 10);

    const admin = await User.create({
      name: "HJIRI Ghazi",
      email: "amirhjiri5@gmail.com",
      password: passwordHash,
      role: "admin",
      phone: "+21612345678",
      image: "", 
    });

    console.log("✅ Admin ghazi créé :", admin);
    process.exit();
  } catch (error) {
    console.error("Erreur création admin :", error);
    process.exit(1);
  }
};

createAdmin();
