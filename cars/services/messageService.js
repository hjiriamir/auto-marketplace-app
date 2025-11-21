import api from "./api.js";

const messageService = {

  // 📨 Créer un message (public, pas besoin de token)
  createMessage: async (data) => {
    const response = await api.post("/messages/createMessage", data);
    return response.data;
  },

  // 📩 Récupérer tous les messages (ADMIN uniquement → protégés)
  getMessages: async () => {
    const response = await api.get("/messages/getMessages");
    return response.data;
  },

  // 📄 Récupérer un seul message par ID (ADMIN uniquement)
  getMessageById: async (id) => {
    const response = await api.get(`/messages/getMessageById/${id}`);
    return response.data;
  },

  // ❌ Supprimer un message (ADMIN uniquement)
  deleteMessage: async (id) => {
    const response = await api.delete(`/messages/deleteMessage/${id}`);
    return response.data;
  }

};

export default messageService;
