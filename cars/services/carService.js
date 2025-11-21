import api from "./api.js"; // Axios avec token déjà configuré

const carService = {
  getCars: async () => {
    const response = await api.get("/cars/getCars");
    return response.data;
  },

  getCarById: async (id) => {
    const response = await api.get(`/cars/getCarById/${id}`);
    return response.data;
  },

  createCar: async (carData) => {
    const response = await api.post("/cars/createCar", carData);
    return response.data;
  },

  updateCar: async (id, carData) => {
    const response = await api.put(`/cars/updateCar/${id}`, carData);
    return response.data;
  },

  deleteCar: async (id) => {
    const response = await api.delete(`/cars/deleteCar/${id}`);
    return response.data;
  }
};

export default carService;
