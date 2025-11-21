import mongoose from "mongoose";

const registrationRequestSchema = new mongoose.Schema({
  serviceType: { 
    type: String, 
    enum: [
      "Vendez votre voiture", 
      "Immatriculation complète", 
      "Véhicule importé"
    ], 
    required: true 
  },
  carInfo: {
    brand: { type: String },
    model: { type: String },
    year: { type: Number },
    mileage: { type: Number },
    fuelType: { type: String },
    transmission: { type: String },
    condition: { type: String },
    description: { type: String },
    images: [{ type: String }], 
    chassisNumber: { type: String },
    plateNumber: { type: String },
  },
  visitor: {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
  },
  status: { type: String, enum: ['pending', 'completed', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

const RegistrationRequest = mongoose.model("RegistrationRequest", registrationRequestSchema);

export default RegistrationRequest;
