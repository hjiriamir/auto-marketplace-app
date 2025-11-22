// api.js
import axios from "axios";
import { GLOBALS } from "../config.js";

const api = axios.create({
  baseURL: GLOBALS.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    console.log('🔍 DÉBUT INTERCEPTEUR - Recherche du token');
    
    let token = null;
    
    // Chercher dans admin_auth
    try {
      const adminAuth = localStorage.getItem('admin_auth');
      console.log('📦 Données admin_auth brutes:', adminAuth);
      
      if (adminAuth) {
        const authData = JSON.parse(adminAuth);
        console.log('👤 Objet admin_auth parsé:', authData);
        
        // Essayer d'abord le token racine
        token = authData.token;
        console.log('🔐 Token racine dans admin_auth:', token);
        
        // Sinon chercher dans user.token
        if (!token && authData.user) {
          token = authData.user.token;
          console.log('🔐 Token dans user object:', token);
        }
      }
    } catch (error) {
      console.log('❌ Erreur parsing admin_auth:', error);
    }
    
    console.log('🗂️ Clés disponibles:', Object.keys(localStorage));
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Token ajouté aux headers');
    } else {
      console.log('❌ Aucun token trouvé');
    }
    
    console.log('🔚 FIN INTERCEPTEUR');
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
