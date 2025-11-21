'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CarCard } from '@/components/car-card';
import { Car } from '@/lib/db';
import { Heart, ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function FavoritesPage() {
  const [favoriteCars, setFavoriteCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    // Charger les IDs des favoris depuis le localStorage
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavoriteIds(favorites);
    
    // Charger les données des voitures
    fetch('/api/cars')
      .then(res => res.json())
      .then((allCars: Car[]) => {
        const favoritesData = allCars.filter(car => favorites.includes(car.id));
        setFavoriteCars(favoritesData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching cars:', err);
        setLoading(false);
      });
  }, []);

  const handleFavoriteToggle = (carId: string, isFavorite: boolean) => {
    if (!isFavorite) {
      // Supprimer de la liste si dé-favorisé
      setFavoriteCars(prev => prev.filter(car => car.id !== carId));
      setFavoriteIds(prev => prev.filter(id => id !== carId));
    }
  };

  const clearAllFavorites = () => {
    localStorage.setItem('favorites', '[]');
    setFavoriteCars([]);
    setFavoriteIds([]);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à l'accueil
            </Link>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Mes Favoris
                </h1>
                <p className="text-gray-600">
                  {favoriteCars.length} véhicule{favoriteCars.length > 1 ? 's' : ''} sauvegardé{favoriteCars.length > 1 ? 's' : ''}
                </p>
              </div>
              
              {favoriteCars.length > 0 && (
                <button
                  onClick={clearAllFavorites}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300"
                >
                  <Trash2 className="w-4 h-4" />
                  Tout supprimer
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl h-72 animate-pulse border border-gray-200" />
              ))}
            </div>
          ) : favoriteCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteCars.map((car, idx) => (
                <div key={car.id} style={{ animationDelay: `${idx * 0.1}s` }} className="animate-in-up">
                  <CarCard car={car} onFavoriteToggle={handleFavoriteToggle} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Heart className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Aucun favori pour le moment
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Ajoutez des véhicules à vos favoris en cliquant sur l'icône cœur pour les retrouver facilement ici.
              </p>
              <Link 
                href="/catalog" 
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/30"
              >
                Parcourir le catalogue
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}