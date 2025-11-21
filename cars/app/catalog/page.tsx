'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CarCard } from '@/components/car-card';
import { Car } from '@/lib/db';
import { useSearchParams } from 'next/navigation';
import { Filter, X, Search, DollarSign, Calendar, Fuel, Cog, Car as CarIcon, SlidersHorizontal, Check } from 'lucide-react';

// Liste des marques populaires pour les suggestions
const POPULAR_BRANDS = [
  'Renault', 'Peugeot', 'Toyota', 'Volkswagen', 'Mercedes', 
  'BMW', 'Audi', 'Hyundai', 'Kia', 'Ford', 'Citroën', 'Dacia'
];

function CatalogContent() {
  const [cars, setCars] = useState<Car[]>([]);
  const [allCars, setAllCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    brand: '',
    minPrice: '',
    maxPrice: '',
    minYear: '',
    maxYear: '',
    fuelType: '',
    transmission: '',
  });
  const searchParams = useSearchParams();
  const search = searchParams.get('search');

  // Récupérer toutes les marques disponibles
  const availableBrands = useMemo(() => {
    const brands = [...new Set(allCars.map(car => car.brand))];
    return brands.sort();
  }, [allCars]);

  useEffect(() => {
    // Charger toutes les voitures une fois
    fetch('/api/cars')
      .then(res => res.json())
      .then(data => {
        setAllCars(data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const query = new URLSearchParams();
    if (search) query.append('search', search);
    if (filters.brand) query.append('brand', filters.brand);
    if (filters.minPrice) query.append('minPrice', filters.minPrice);
    if (filters.maxPrice) query.append('maxPrice', filters.maxPrice);
    if (filters.minYear) query.append('minYear', filters.minYear);
    if (filters.maxYear) query.append('maxYear', filters.maxYear);
    if (filters.fuelType) query.append('fuelType', filters.fuelType);
    if (filters.transmission) query.append('transmission', filters.transmission);

    setLoading(true);
    
    fetch(`/api/cars?${query}`)
      .then(res => res.json())
      .then(data => {
        setCars(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching cars:', err);
        setLoading(false);
      });
  }, [filters, search]);

  const filterInputClass = "w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm";
  const filterLabelClass = "block text-sm font-semibold mb-3 text-gray-900 flex items-center gap-2";

  const resetFilters = () => {
    setFilters({
      brand: '',
      minPrice: '',
      maxPrice: '',
      minYear: '',
      maxYear: '',
      fuelType: '',
      transmission: '',
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  // Suggestions de marques basées sur la saisie
  const brandSuggestions = useMemo(() => {
    if (!filters.brand) return POPULAR_BRANDS;
    return availableBrands.filter(brand => 
      brand.toLowerCase().includes(filters.brand.toLowerCase())
    ).slice(0, 6);
  }, [filters.brand, availableBrands]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Trouvez Votre Véhicule Idéal
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Parcourez notre sélection exclusive de véhicules et trouvez la perle rare
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar Filtres Amélioré */}
            <div className={`${filtersOpen ? 'fixed inset-0 z-50 bg-black/50' : 'hidden'} lg:block lg:relative lg:z-0`}>
              <div className={`bg-white rounded-2xl p-6 border border-gray-200 shadow-2xl h-fit lg:sticky lg:top-24 transform transition-all duration-300 ${
                filtersOpen ? 'absolute top-4 left-4 right-4 bottom-4 overflow-y-auto' : ''
              }`}>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center">
                      <SlidersHorizontal className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Filtres</h2>
                      <p className="text-sm text-gray-500">Affinez votre recherche</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasActiveFilters && (
                      <button
                        onClick={resetFilters}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors duration-300"
                      >
                        Tout effacer
                      </button>
                    )}
                    <button 
                      onClick={() => setFiltersOpen(false)} 
                      className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Recherche par marque améliorée */}
                  <div>
                    <label className={filterLabelClass}>
                      <Search className="w-4 h-4 text-blue-600" />
                      Marque
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Ex: Renault, Peugeot..."
                        value={filters.brand}
                        onChange={(e) => setFilters({...filters, brand: e.target.value})}
                        className={`${filterInputClass} pl-10`}
                        list="brand-suggestions"
                      />
                    </div>
                    
                    {/* Suggestions de marques */}
                    {filters.brand && brandSuggestions.length > 0 && (
                      <div className="mt-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-600 mb-2">Suggestions :</p>
                        <div className="flex flex-wrap gap-1">
                          {brandSuggestions.map((brand) => (
                            <button
                              key={brand}
                              type="button"
                              onClick={() => setFilters({...filters, brand})}
                              className="text-xs bg-white hover:bg-blue-50 text-gray-700 px-2 py-1 rounded border border-gray-300 transition-colors duration-200"
                            >
                              {brand}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Prix */}
                  <div>
                    <label className={filterLabelClass}>
                      <DollarSign className="w-4 h-4 text-green-600" />
                      Fourchette de prix (DT)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="number"
                          placeholder="Prix min"
                          value={filters.minPrice}
                          onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                          className={filterInputClass}
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          placeholder="Prix max"
                          value={filters.maxPrice}
                          onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                          className={filterInputClass}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Année */}
                  <div>
                    <label className={filterLabelClass}>
                      <Calendar className="w-4 h-4 text-purple-600" />
                      Année
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="number"
                          placeholder="Année min"
                          min="1990"
                          max={new Date().getFullYear()}
                          value={filters.minYear}
                          onChange={(e) => setFilters({...filters, minYear: e.target.value})}
                          className={filterInputClass}
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          placeholder="Année max"
                          min="1990"
                          max={new Date().getFullYear()}
                          value={filters.maxYear}
                          onChange={(e) => setFilters({...filters, maxYear: e.target.value})}
                          className={filterInputClass}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Carburant */}
                  <div>
                    <label className={filterLabelClass}>
                      <Fuel className="w-4 h-4 text-orange-600" />
                      Type de carburant
                    </label>
                    <select
                      value={filters.fuelType}
                      onChange={(e) => setFilters({...filters, fuelType: e.target.value})}
                      className={filterInputClass}
                    >
                      <option value="">Tous les types</option>
                      <option value="Essence">⛽ Essence</option>
                      <option value="Diesel">⛽ Diesel</option>
                      <option value="Hybride">🔋 Hybride</option>
                      <option value="Électrique">⚡ Électrique</option>
                    </select>
                  </div>

                  {/* Transmission */}
                  <div>
                    <label className={filterLabelClass}>
                      <Cog className="w-4 h-4 text-indigo-600" />
                      Transmission
                    </label>
                    <select
                      value={filters.transmission}
                      onChange={(e) => setFilters({...filters, transmission: e.target.value})}
                      className={filterInputClass}
                    >
                      <option value="">Tous les types</option>
                      <option value="Manuelle">⚙️ Manuelle</option>
                      <option value="Automatique">🤖 Automatique</option>
                    </select>
                  </div>

                  {/* Bouton Appliquer (mobile) */}
                  <div className="lg:hidden pt-4 border-t border-gray-100">
                    <button
                      onClick={() => setFiltersOpen(false)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Appliquer les filtres
                    </button>
                  </div>
                </div>

                {/* Indicateur de filtres actifs */}
                {hasActiveFilters && (
                  <div className="mt-6 p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-sm text-blue-800 font-medium text-center">
                      🔍 Filtres actifs • {Object.values(filters).filter(v => v !== '').length}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Contenu Principal */}
            <div className="lg:col-span-3">
              {/* En-tête mobile */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:hidden">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setFiltersOpen(true)}
                    className="flex items-center gap-2 bg-white text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300 border border-gray-200 shadow-lg font-semibold"
                  >
                    <Filter className="w-4 h-4" />
                    Filtres
                    {hasActiveFilters && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </button>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">{cars.length}</span> véhicules
                  </div>
                </div>
                
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition-colors duration-300 border border-red-200"
                  >
                    Réinitialiser
                  </button>
                )}
              </div>

              {/* En-tête desktop */}
              <div className="hidden lg:flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Nos Véhicules
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-3 py-1.5 rounded-full border border-gray-200">
                    <CarIcon className="w-4 h-4" />
                    <span className="font-semibold text-gray-900">{cars.length}</span> résultats
                  </div>
                </div>
                
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-colors duration-300 border border-red-200"
                  >
                    <X className="w-4 h-4" />
                    Réinitialiser les filtres
                  </button>
                )}
              </div>

              {/* Grille de résultats */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl h-96 animate-pulse border border-gray-200 shadow-lg">
                      <div className="h-60 bg-gray-200 rounded-t-2xl"></div>
                      <div className="p-6 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/3 mt-4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : cars.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {cars.map((car, idx) => (
                      <div key={car.id} style={{ animationDelay: `${idx * 0.05}s` }} className="animate-in-up">
                        <CarCard car={car} />
                      </div>
                    ))}
                  </div>
                  
                  {/* Résumé des résultats */}
                  <div className="mt-8 text-center">
                    <div className="inline-flex items-center gap-4 bg-white px-6 py-3 rounded-xl border border-gray-200 shadow-lg">
                      <div className="text-sm text-gray-600">
                        Affichage de <span className="font-semibold text-gray-900">{cars.length}</span> véhicules
                      </div>
                      {hasActiveFilters && (
                        <>
                          <div className="w-px h-4 bg-gray-300"></div>
                          <button
                            onClick={resetFilters}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-300"
                          >
                            Voir tous les véhicules
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300 shadow-lg">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <CarIcon className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Aucun véhicule trouvé
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Aucun véhicule ne correspond à vos critères de recherche.
                  </p>
                  {hasActiveFilters ? (
                    <button
                      onClick={resetFilters}
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/30"
                    >
                      <X className="w-4 h-4" />
                      Réinitialiser les filtres
                    </button>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Essayez d'élargir vos critères de recherche
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-gray-300 border-t-blue-600 animate-spin" />
            </div>
            <p className="text-gray-600">Chargement du catalogue...</p>
          </div>
        </div>
        <Footer />
      </>
    }>
      <CatalogContent />
    </Suspense>
  );
}