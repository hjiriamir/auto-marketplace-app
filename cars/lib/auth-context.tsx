'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_ADMIN_USERNAME = 'admin';
const DEFAULT_ADMIN_PASSWORD = 'password123';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const stored = localStorage.getItem('admin_auth');
    if (stored) {
      const { user } = JSON.parse(stored);
      setUsername(user);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (inputUsername: string, inputPassword: string): boolean => {
    if (inputUsername === DEFAULT_ADMIN_USERNAME && inputPassword === DEFAULT_ADMIN_PASSWORD) {
      setUsername(inputUsername);
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', JSON.stringify({ user: inputUsername }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUsername(null);
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
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
