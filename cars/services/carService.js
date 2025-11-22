// services/carService.js
import api from "./api.js";

const carService = {
  getCars: async () => {
    const response = await api.get("/cars/getCars");
    return response.data;
  },

  createCarWithImages: async (formData) => {
    console.log('📤 Envoi FormData avec images...');
    
    try {
      const response = await api.post("/carse/createCar", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('✅ createCarWithImages réussi:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ createCarWithImages erreur:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },


  updateCarWithImages: async (id, formData) => {
    console.log("📤 Envoi FormData pour update...");

    try {
      const response = await api.put(`/carse/updateCar/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ updateCarWithImages réussi:", response.data);
      return response.data;

    } catch (error) {
      console.error("❌ updateCarWithImages erreur DÉTAILLÉE:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url,
        method: error.config?.method
      });
      throw error;
    }
  },   // <=== virgule manquante ajoutée ici

  getCarById: async (id) => {
    const response = await api.get(`/cars/getCarById/${id}`);
    return response.data;
  },

  


  getCarById: async (id) => {
    const response = await api.get(`/cars/getCarById/${id}`);
    return response.data;
  },

  createCar: async (carData) => {
    console.log('🚗 createCar appelé avec:', carData);
    
    try {
      const response = await api.post("/cars/createCar", carData);
      console.log('✅ createCar réussi:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ createCar erreur:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  updateCar: async (id, carData) => {
    console.log('✏️ updateCar appelé avec:', { id, carData });
    
    if (!id) {
      console.error('❌ ID manquant pour updateCar');
      throw new Error('ID de la voiture requis');
    }
    
    try {
      const response = await api.put(`/cars/updateCar/${id}`, carData);
      console.log('✅ updateCar réussi:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ updateCar erreur:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  deleteCar: async (id) => {
    const response = await api.delete(`/cars/deleteCar/${id}`);
    return response.data;
  }
};

export default carService;