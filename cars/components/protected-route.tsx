'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth(); // Récupérer isLoading
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Ne rediriger que lorsque le chargement est terminé ET que l'utilisateur n'est pas authentifié
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, router, pathname]); // Ajouter isLoading aux dépendances

  // Pendant le chargement, afficher un indicateur ou rien
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Si le chargement est terminé et l'utilisateur n'est pas authentifié, ne rien afficher
  if (!isAuthenticated) {
    return null;
  }

  // Si authentifié, afficher les enfants
  return <>{children}</>;
}