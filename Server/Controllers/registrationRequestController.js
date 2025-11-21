import RegistrationRequest from "../Models/RegistrationRequest.js";

// Créer une nouvelle demande de service (visiteur)
export const createRequest = async (req, res) => {
  const { serviceType, carInfo, visitor } = req.body;

  try {
    const newRequest = await RegistrationRequest.create({
      serviceType,
      carInfo,
      visitor,
    });

    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de la demande", error });
  }
};

// Récupérer toutes les demandes (admin)
export const getRequests = async (req, res) => {
  try {
    const requests = await RegistrationRequest.find().sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des demandes", error });
  }
};

// Récupérer une demande par ID (admin)
export const getRequestById = async (req, res) => {
  try {
    const request = await RegistrationRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Demande non trouvée" });

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de la demande", error });
  }
};

// Mettre à jour le statut d’une demande (admin)
export const updateRequestStatus = async (req, res) => {
  const { status } = req.body; // 'completed' ou 'rejected'

  try {
    const request = await RegistrationRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Demande non trouvée" });

    request.status = status || request.status;
    const updatedRequest = await request.save();

    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de la demande", error });
  }
};

// Supprimer une demande (admin)
export const deleteRequest = async (req, res) => {
  try {
    const request = await RegistrationRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Demande non trouvée" });

    await request.remove();
    res.status(200).json({ message: "Demande supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de la demande", error });
  }
};
