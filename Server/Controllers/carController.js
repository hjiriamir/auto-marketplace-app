import Car from "../Models/Car.js";

// Obtenir toutes les voitures
export const getCars = async (req, res) => {
  try {
    const cars = await Car.find().populate("seller", "name email phone");
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des voitures", error });
  }
};

// Obtenir une voiture par ID
export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).populate("seller", "name email phone");
    if (!car) return res.status(404).json({ message: "Voiture non trouvée" });
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de la voiture", error });
  }
};

// Créer une nouvelle voiture
export const createCar = async (req, res) => {
  try {
    const car = new Car(req.body);
    const savedCar = await car.save();
    res.status(201).json(savedCar);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de la voiture", error });
  }
};

// Mettre à jour une voiture
export const updateCar = async (req, res) => {
  try {
    const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCar) return res.status(404).json({ message: "Voiture non trouvée" });
    res.status(200).json(updatedCar);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de la voiture", error });
  }
};

// Supprimer une voiture
export const deleteCar = async (req, res) => {
  try {
    const deletedCar = await Car.findByIdAndDelete(req.params.id);
    if (!deletedCar) return res.status(404).json({ message: "Voiture non trouvée" });
    res.status(200).json({ message: "Voiture supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de la voiture", error });
  }
};
