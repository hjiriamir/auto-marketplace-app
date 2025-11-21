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
    console.log('🔄 FavoritesProvider - Loading from localStorage:', storedFavorites);
    setFavorites(storedFavorites);
  }, []);

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    console.log('💾 FavoritesProvider - Saving to localStorage:', favorites);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (carId: string) => {
    console.log('❤️ Adding favorite:', carId);
    setFavorites(prev => [...prev, carId]);
  };

  const removeFavorite = (carId: string) => {
    console.log('💔 Removing favorite:', carId);
    setFavorites(prev => prev.filter(id => id !== carId));
  };

  const toggleFavorite = (carId: string) => {
    console.log('🔄 Toggling favorite for:', carId, 'Current state:', favorites.includes(carId));
    if (favorites.includes(carId)) {
      removeFavorite(carId);
    } else {
      addFavorite(carId);
    }
  };

  const isFavorite = (carId: string) => {
    const result = favorites.includes(carId);
    console.log('🔍 Checking if favorite:', carId, '->', result);
    return result;
  };

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