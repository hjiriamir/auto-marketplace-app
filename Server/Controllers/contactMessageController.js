import ContactMessage from "../Models/ContactMessage.js";

// Créer un nouveau message de contact
export const createMessage = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  try {
    const newMessage = await ContactMessage.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création du message", error });
  }
};

// Récupérer tous les messages (admin)
export const getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des messages", error });
  }
};

// Récupérer un message par ID (admin)
export const getMessageById = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) return res.status(404).json({ message: "Message non trouvé" });

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du message", error });
  }
};

// Supprimer un message (admin)
export const deleteMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) return res.status(404).json({ message: "Message non trouvé" });

    await message.remove();
    res.status(200).json({ message: "Message supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du message", error });
  }
};
