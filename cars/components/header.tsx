'use client';

import Link from 'next/link';
import { Menu, X, Car, LogOut, Heart } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useFavorites } from '@/lib/favorites-context';
import Image from 'next/image';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated, logout, username } = useAuth();
  const { favoriteCount } = useFavorites();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center h-16">

          {/* ---------- LOGO ---------- */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Image
                src="/car2.png"
                alt="Logo"
                width={100}
                height={100}
                className="object-contain group-hover:opacity-90 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-blue-500/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </Link>

          {/* ---------- NAVBAR DESKTOP ---------- */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: '/', label: 'Accueil' },
              { href: '/catalog', label: 'Catalogue' },
              { href: '/contact', label: 'Contact' },
              { href: '/registration', label: 'Immatriculation' }
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg transition-all duration-300 relative group"
              >
                {item.label}
                <div className="absolute inset-0 bg-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-500 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}

            {/* -------- BOUTON FAVORIS -------- */}
            <Link
              href="/favorites"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg transition-all duration-300 relative group"
            >
              <Heart className="w-5 h-5" />
              <span className="hidden sm:inline">Favoris</span>

              {favoriteCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                  {favoriteCount}
                </span>
              )}
            </Link>

            {!isAuthenticated && (
              <Link
                href="/seller"
                className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg transition-all duration-300 relative group"
              >
                Vendre
                <div className="absolute inset-0 bg-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-500 group-hover:w-full transition-all duration-300" />
              </Link>
            )}
          </nav>

          {/* ---------- BOUTONS DROITE ---------- */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600 px-3 py-2">
                  {username}
                </span>

                <Link
                  href="/admin"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium"
                >
                  Admin
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg transition-all duration-300"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium"
              >
                Admin
              </Link>
            )}
          </div>

          {/* ---------- MENU MOBILE ---------- */}
          <button
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* ---------- NAVBAR MOBILE ---------- */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-2 animate-in-up">
            {[
              { href: '/', label: 'Accueil' },
              { href: '/catalog', label: 'Catalogue' },
              { href: '/contact', label: 'Contact' },
              { href: '/registration', label: 'Immatriculation' }
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition-all duration-300"
              >
                {item.label}
              </Link>
            ))}

            {/* -- Favoris mobile -- */}
            <Link
              href="/favorites"
              className="flex items-center gap-3 text-gray-700 hover:text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition-all duration-300 relative"
            >
              <Heart className="w-5 h-5" />
              Favoris

              {favoriteCount > 0 && (
                <span className="absolute top-2 right-4 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favoriteCount}
                </span>
              )}
            </Link>

            {!isAuthenticated && (
              <Link
                href="/seller"
                className="text-gray-700 hover:text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition-all duration-300"
              >
                Vendre
              </Link>
            )}

            {isAuthenticated ? (
              <>
                <Link
                  href="/admin"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium"
                >
                  Admin
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg transition-all duration-300"
                >
                  <LogOut className="w-5 h-5" />
                  Déconnexion
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium"
              >
                Admin
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}