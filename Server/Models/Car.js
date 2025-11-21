import mongoose from "mongoose";
import User from "./User.js";

const carSchema = new mongoose.Schema({
  brand: String,
  model: String,
  year: Number,
  price: Number,
  mileage: Number,
  fuelType: String,
  transmission: String,
  condition: String,
  description: String,
  images: [String],
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'sold', 'pending'], default: 'active' },
});

const Car = mongoose.model("Car", carSchema);

export default Car;
