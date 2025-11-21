'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Car } from '@/lib/db';
import { Fuel, Gauge, Cog, Heart, Star, MapPin, Calendar, Zap, Car } from 'lucide-react';
import { useFavorites } from '@/lib/favorites-context';
import { useState } from 'react';

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(car.id);
  };

  const favorite = isFavorite(car.id);

  // Calculer l'âge du véhicule
  const carAge = new Date().getFullYear() - car.year;
  const isNewCar = carAge <= 1;
  const isLowMileage = car.mileage < 50000;

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'excellent': return 'from-green-500 to-emerald-400';
      case 'bon': return 'from-blue-500 to-cyan-400';
      case 'acceptable': return 'from-orange-500 to-amber-400';
      default: return 'from-blue-600 to-blue-500';
    }
  };

  const getFuelIcon = (fuelType: string) => {
    switch (fuelType.toLowerCase()) {
      case 'électrique': return <Zap className="w-4 h-4" />;
      case 'diesel': return <Fuel className="w-4 h-4" />;
      case 'hybride': return <div className="relative w-4 h-4">
        <Fuel className="w-3 h-3 absolute top-0.5 left-0.5" />
        <Zap className="w-2 h-2 absolute bottom-0 right-0" />
      </div>;
      default: return <Fuel className="w-4 h-4" />;
    }
  };

  return (
    <Link href={`/car/${car.id}`}>
      <div className="group cursor-pointer h-full transform hover:scale-[1.02] transition-all duration-500 ease-out">
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 hover:border-blue-400/50 transition-all duration-500 h-full flex flex-col hover:shadow-2xl hover:shadow-blue-500/20 shadow-xl relative">
          
          {/* Effet de brillance au survol */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
          
          {/* Badge Nouveau */}
          {isNewCar && (
            <div className="absolute top-3 left-3 z-20">
              <span className="inline-block bg-gradient-to-r from-green-500 to-emerald-400 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                🚗 Nouveau
              </span>
            </div>
          )}

          {/* Badge Kilométrage faible */}
          {isLowMileage && (
            <div className="absolute top-3 left-3 z-20 mt-10">
              <span className="inline-block bg-gradient-to-r from-purple-500 to-pink-400 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                ⚡ Faible km
              </span>
            </div>
          )}

          {/* Section Image */}
          <div className="relative h-60 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            
            {imageError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center text-gray-400">
                  <Car className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Image non disponible</p>
                </div>
              </div>
            ) : (
              <Image
                src={car.images[0] || '/placeholder-car.jpg'}
                alt={`${car.brand} ${car.model} ${car.year}`}
                fill
                className={`object-cover transition-all duration-700 ${
                  imageLoaded 
                    ? 'group-hover:scale-110 opacity-100' 
                    : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Bouton favori amélioré */}
            <button
              onClick={handleFavoriteClick}
              className="absolute top-3 right-3 p-2.5 bg-white/95 backdrop-blur-sm rounded-full hover:bg-red-500 transition-all duration-300 shadow-xl z-20 transform hover:scale-110 group/fav"
            >
              <Heart
                className={`w-5 h-5 transition-all duration-300 ${
                  favorite 
                    ? 'fill-red-500 text-red-500 group-hover/fav:fill-red-600 group-hover/fav:text-red-600 animate-pulse' 
                    : 'text-gray-600 group-hover/fav:text-white group-hover/fav:animate-bounce'
                }`}
              />
            </button>

            {/* État du véhicule */}
            <div className="absolute bottom-3 left-3 z-10">
              <span className={`inline-block bg-gradient-to-r ${getConditionColor(car.condition)} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm`}>
                {car.condition}
              </span>
            </div>
          </div>

          {/* Contenu de la carte */}
          <div className="p-6 flex flex-col flex-1 relative z-10">
            {/* En-tête avec marque et modèle */}
            <div className="mb-3">
              <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
                {car.brand} {car.model}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{car.year}</span>
                <span className="text-gray-300">•</span>
                <MapPin className="w-4 h-4" />
                <span>Tunis</span>
              </div>
            </div>

            {/* Spécifications */}
            <div className="grid grid-cols-3 gap-3 mb-4 py-4 border-y border-gray-100/80">
              <div className="flex flex-col items-center justify-center text-center group/spec">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-2 group-hover/spec:bg-blue-100 transition-colors duration-300">
                  <Gauge className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xs font-semibold text-gray-900">{(car.mileage / 1000).toFixed(0)}K km</span>
              </div>
              
              <div className="flex flex-col items-center justify-center text-center group/spec">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-2 group-hover/spec:bg-green-100 transition-colors duration-300">
                  {getFuelIcon(car.fuelType)}
                </div>
                <span className="text-xs font-semibold text-gray-900">{car.fuelType}</span>
              </div>
              
              <div className="flex flex-col items-center justify-center text-center group/spec">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mb-2 group-hover/spec:bg-purple-100 transition-colors duration-300">
                  <Cog className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-xs font-semibold text-gray-900">{car.transmission}</span>
              </div>
            </div>

            {/* Prix et CTA */}
            <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100/50">
              <div>
                <p className="text-xs text-gray-500 mb-1">Prix starting from</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                    {car.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">DT</span>
                </div>
              </div>
              
              <button className="relative bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 transform group-hover:scale-105 shadow-lg hover:shadow-blue-500/30 overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  Voir offre
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>

            {/* Note/Évaluation (optionnelle) */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100/50">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3 h-3 ${
                      star <= 4 ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
                    }`}
                  />
                ))}
                <span className="text-xs text-gray-500 ml-1">(24 avis)</span>
              </div>
              <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-full">
                ✓ Disponible
              </span>
            </div>
          </div>

          {/* Effet de bordure animée */}
          <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/20 group-hover:via-blue-500/10 group-hover:to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>
      </div>
    </Link>
  );
}