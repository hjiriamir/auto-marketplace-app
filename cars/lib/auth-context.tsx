'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  image: string;
  token: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  login: (email: string, token: string, userData: UserData) => boolean;
  logout: () => void;
  isLoading: boolean; // Ajout crucial
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true); // État de chargement

  // Vérifier si l'utilisateur est connecté au montage
  useEffect(() => {
    const checkAuth = () => {
      try {
        const stored = localStorage.getItem('admin_auth');
        if (stored) {
          const authData = JSON.parse(stored);
          if (authData.user && authData.token) {
            setUser(authData.user);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        localStorage.removeItem('admin_auth');
      } finally {
        setIsLoading(false); // Important : indiquer que le chargement est terminé
      }
    };

    checkAuth();
  }, []);

  const login = (email: string, token: string, userData: UserData): boolean => {
    if (userData && userData.token) {
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', JSON.stringify({ 
        user: userData,
        token: token 
      }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout,
      isLoading // N'oubliez pas d'exposer isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}