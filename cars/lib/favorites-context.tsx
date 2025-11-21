'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FavoritesContextType {
  favorites: string[];
  favoriteCount: number;
  addFavorite: (carId: string) => void;
  removeFavorite: (carId: string) => void;
  toggleFavorite: (carId: string) => void;
  isFavorite: (carId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Charger les favoris depuis localStorage au montage
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(storedFavorites);
  }, []);

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (carId: string) => {
    setFavorites(prev => [...prev, carId]);
  };

  const removeFavorite = (carId: string) => {
    setFavorites(prev => prev.filter(id => id !== carId));
  };

  const toggleFavorite = (carId: string) => {
    if (favorites.includes(carId)) {
      removeFavorite(carId);
    } else {
      addFavorite(carId);
    }
  };

  const isFavorite = (carId: string) => favorites.includes(carId);

  const value = {
    favorites,
    favoriteCount: favorites.length,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}