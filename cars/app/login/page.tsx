'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LogIn, AlertCircle } from 'lucide-react';

interface LoginResponse {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  image: string;
  token: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        }),
      });

      if (!response.ok) {
        throw new Error('Identifiants invalides');
      }

      const data: LoginResponse = await response.json();
      
      // Utiliser la fonction login du contexte avec les données de l'API
      if (login(data.email, data.token, data)) {
        router.push('/admin');
      } else {
        setError('Échec de la connexion');
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-lg p-8 border border-border">
            <div className="flex items-center justify-center gap-3 mb-8">
              <LogIn className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Connexion Admin</h1>
            </div>

            <p className="text-center text-muted-foreground mb-8">
              Accédez à l'espace administrateur
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="amirhjiri5@gmail.com"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 mt-6"
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>

            <div className="mt-6 p-4 bg-background border border-border rounded-lg">
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Identifiants de test :</span><br />
                Email: <code className="bg-muted px-2 py-1 rounded">amirhjiri5@gmail.com</code><br />
                Mot de passe: <code className="bg-muted px-2 py-1 rounded">MotDePasseAdmin123!</code>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}