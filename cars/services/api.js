// api.js
import axios from "axios";
import { GLOBALS } from "../config.js";

// Créer une instance Axios
const api = axios.create({
  baseURL: GLOBALS.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le token automatiquement
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(GLOBALS.TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Token expiré ou utilisateur non autorisé");
      localStorage.removeItem(GLOBALS.TOKEN_KEY);
      localStorage.removeItem(GLOBALS.USER_NAME_KEY);
      localStorage.removeItem(GLOBALS.USER_ROLE_KEY);
      // ici tu peux rediriger vers login si tu veux
    }
    return Promise.reject(error);
  }
);

export default api;
