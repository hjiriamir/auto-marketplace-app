import api from "./api.js";

const registrationService = {

  // 📝 Créer une demande (accessible aux visiteurs → pas besoin de token)
  createRequest: async (data) => {
    const response = await api.post("/services/createRequest", data);
    return response.data;
  },

  // 📄 Récupérer toutes les demandes (ADMIN → protégé)
  getRequests: async () => {
    const response = await api.get("/services/getRequests");
    return response.data;
  },

  // 🔍 Récupérer une demande par ID (ADMIN)
  getRequestById: async (id) => {
    const response = await api.get(`/services/getRequestById/${id}`);
    return response.data;
  },

  // 🔄 Mettre à jour le statut (ADMIN)
  updateRequestStatus: async (id, status) => {
    const response = await api.put(`/services/updateRequestStatus/${id}/status`, { status });
    return response.data;
  },

  // ❌ Supprimer une demande (ADMIN)
  deleteRequest: async (id) => {
    const response = await api.delete(`/services/deleteRequest/${id}`);
    return response.data;
  }

};

export default registrationService;
