'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, X, Car, CheckCircle } from 'lucide-react';
import Image from 'next/image';

export function SearchHero() {
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;

    setIsLoading(true);

    // Simuler un délai de recherche (vous pouvez l'adapter selon vos besoins)
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsLoading(false);

    // Ici vous pourriez vérifier si des résultats existent
    // Pour l'exemple, on simule une recherche sans résultats si le terme est "aucun"
    if (search.toLowerCase().includes('aucun')) {
      setShowNoResults(true);
    } else {
      router.push(`/catalog?search=${encodeURIComponent(search)}`);
    }
  };

  const closeNoResults = () => {
    setShowNoResults(false);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl border border-gray-200">
            {/* Animated Search Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
                <Search className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
            
            {/* Animated Text */}
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Recherche en cours
              </h3>
              <p className="text-gray-600 mb-4">
                Nous parcourons notre catalogue...
              </p>
              
              {/* Animated Dots */}
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6 bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {/* No Results Popup */}
      {showNoResults && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-200 animate-in-up">
            <div className="text-center">
              {/* Icon */}
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-10 h-10 text-red-600" />
              </div>
              
              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Aucun résultat trouvé
              </h3>
              
              {/* Message */}
              <p className="text-gray-600 mb-6">
                Nous n'avons trouvé aucun véhicule correspondant à "<span className="font-semibold">{search}</span>".
              </p>
              
              {/* Suggestions */}
              <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
                <p className="text-sm text-blue-800 font-semibold mb-2">Suggestions :</p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Vérifiez l'orthographe</li>
                  <li>• Essayez d'autres termes (ex: "BMW Série 3")</li>
                  <li>• Consultez notre catalogue complet</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={closeNoResults}
                  className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-xl font-semibold hover:bg-gray-600 transition-all duration-300"
                >
                  Modifier la recherche
                </button>
                <button
                  onClick={() => router.push('/catalog')}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Car className="w-5 h-5" />
                  Tout voir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animated Real Car Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Road */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-800 to-gray-900">
          {/* Road markings */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-yellow-400 animate-road-line" />
          <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 w-8 h-1 bg-yellow-400 animate-road-line" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-yellow-400 animate-road-line" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-3/4 transform -translate-x-1/2 w-8 h-1 bg-yellow-400 animate-road-line" style={{ animationDelay: '1.5s' }} />
        </div>

        {/* Animated Real Car */}
        <div className="absolute bottom-20 animate-car-drive">
          <div className="relative w-80 h-48 transform perspective-1000">
            <div className="relative w-full h-full transform-style-3d group hover:scale-105 transition-transform duration-500">
              <Image
                src="/car1.png"
                alt="Voiture de luxe"
                width={320}
                height={192}
                className="w-full h-full object-contain drop-shadow-2xl filter brightness-110 contrast-110"
                priority
              />
              {/* Reflection effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent opacity-30" />
              
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-xl group-hover:bg-blue-400/30 transition-all duration-500" />
            </div>
          </div>
        </div>

        {/* Moving background elements for speed effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 opacity-10">
          <div className="w-20 h-10 bg-gray-400 rounded-lg animate-pulse" />
        </div>
        <div className="absolute top-40 right-20 opacity-5">
          <div className="w-16 h-8 bg-gray-500 rounded-lg animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Light beams */}
        <div className="absolute bottom-24 left-0 w-32 h-1 bg-yellow-200/40 blur-sm transform -rotate-3 animate-pulse" />
        <div className="absolute bottom-24 right-0 w-32 h-1 bg-yellow-200/40 blur-sm transform rotate-3 animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
        <div className="mb-6 animate-in-up">
          <span className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent text-sm font-bold uppercase tracking-wider mb-4">
            Trouvez votre véhicule idéal
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight drop-shadow-sm">
            Découvrez les meilleures <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">offres automobiles</span>
          </h1>
        </div>

        <p className="text-xl text-gray-700 mb-12 max-w-2xl mx-auto animate-in-up drop-shadow-sm" style={{ animationDelay: '0.1s' }}>
          Parcourez notre sélection de véhicules d'occasion vérifiés avec prix transparents et procédures simples.
        </p>

        <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl mx-auto mb-12 animate-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par marque, modèle, BMW, Mercedes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/95 backdrop-blur-sm border border-gray-200/80 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 transition-all duration-300 shadow-2xl"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !search.trim()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 hover:shadow-2xl hover:shadow-blue-500/30 shadow-lg transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            <span className="hidden sm:inline">
              {isLoading ? 'Recherche...' : 'Chercher'}
            </span>
          </button>
        </form>

        <div className="flex justify-center animate-in-up" style={{ animationDelay: '0.3s' }}>
          <a 
            href="#featured" 
            className="flex items-center gap-2 text-blue-600 hover:text-indigo-700 transition-all duration-300 group bg-white/80 backdrop-blur-sm px-6 py-3 rounded-xl shadow-lg hover:shadow-xl border border-gray-200/60"
          >
            <span className="text-sm font-semibold">Parcourir les annonces</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </div>
      </div>

      {/* Stats overlay */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-in-up" style={{ animationDelay: '0.4s' }}>
        <div className="flex gap-8 text-center bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-2xl border border-gray-200/60">
          <div>
            <div className="text-2xl font-bold text-gray-900">500+</div>
            <div className="text-sm text-gray-600">Véhicules</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">98%</div>
            <div className="text-sm text-gray-600">Satisfaction</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">24h</div>
            <div className="text-sm text-gray-600">Livraison</div>
          </div>
        </div>
      </div>
    </section>
  );
}