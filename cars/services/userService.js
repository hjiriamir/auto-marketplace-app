import api from "./api.js";  
import { GLOBALS } from "../config.js";

const userService = {

  // 🔐 LOGIN
  login: async (credentials) => {
    const response = await api.post("/user/login", credentials);

    // Stocker le token + infos dans le localStorage
    if (response.data?.token) {
      localStorage.setItem(GLOBALS.TOKEN_KEY, response.data.token);
      localStorage.setItem(GLOBALS.USER_NAME_KEY, response.data.user?.name || "");
      localStorage.setItem(GLOBALS.USER_ROLE_KEY, response.data.user?.role || "");
    }

    return response.data; // { message, token, user }
  },

  // 🔐 LOGOUT
  logout: () => {
    localStorage.removeItem(GLOBALS.TOKEN_KEY);
    localStorage.removeItem(GLOBALS.USER_NAME_KEY);
    localStorage.removeItem(GLOBALS.USER_ROLE_KEY);
  },

  // 🔁 Mot de passe oublié
  forgotPassword: async (email) => {
    const response = await api.post("/user/forgot-password", { email });
    return response.data;
  },

  // 🔄 Reset password
  resetPassword: async (data) => {
    const response = await api.post("/user/reset-password", data);
    return response.data;
  },

  // 👤 Mise à jour du profil (protégé par JWT)
  updateProfile: async (profileData) => {
    const response = await api.put("/user/profile", profileData);
    return response.data;
  },

  // 📌 Récupérer l’utilisateur courant depuis localStorage
  getCurrentUser: () => {
    return {
      name: localStorage.getItem(GLOBALS.USER_NAME_KEY),
      role: localStorage.getItem(GLOBALS.USER_ROLE_KEY),
      token: localStorage.getItem(GLOBALS.TOKEN_KEY)
    };
  }
};

export default userService;
