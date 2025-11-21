import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  role: { type: String, enum: ['seller', 'buyer', 'admin'], default: 'admin' },
  password: { type: String, required: true }, 
  image: { type: String, default: "" }, 
  resetPasswordToken: { type: String },   
  resetPasswordExpires: { type: Date },   
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

export default User;
