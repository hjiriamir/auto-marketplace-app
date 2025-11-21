'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProtectedRoute } from '@/components/protected-route';
import { Car } from '@/lib/db';
import { Plus, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';

function SellerContent() {
  const [myCars, setMyCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'my-cars' | 'add-car'>('my-cars');
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    fuelType: 'Essence',
    transmission: 'Manuelle',
    condition: 'Bon',
    description: '',
    seller: {
      name: '',
      phone: '',
      email: '',
    },
  });

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      const res = await fetch('/api/cars');
      const data = await res.json();
      setMyCars(data);
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('seller.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        seller: { ...prev.seller, [field]: value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'year' || name === 'price' || name === 'mileage' 
          ? parseInt(value) 
          : value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          images: ['/placeholder.svg?key=j9p3k'],
          status: 'active',
        }),
      });
      loadCars();
      setTab('my-cars');
      setFormData({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        price: 0,
        mileage: 0,
        fuelType: 'Essence',
        transmission: 'Manuelle',
        condition: 'Bon',
        description: '',
        seller: { name: '', phone: '', email: '' },
      });
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr ?')) {
      await fetch(`/api/cars/${id}`, { method: 'DELETE' });
      loadCars();
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-foreground mb-8">Espace Vendeur</h1>

          <div className="flex gap-4 mb-8 border-b border-border">
            <button
              onClick={() => setTab('my-cars')}
              className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
                tab === 'my-cars'
                  ? 'text-primary border-primary'
                  : 'text-muted-foreground border-transparent'
              }`}
            >
              Mes annonces ({myCars.length})
            </button>
            <button
              onClick={() => setTab('add-car')}
              className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
                tab === 'add-car'
                  ? 'text-primary border-primary'
                  : 'text-muted-foreground border-transparent'
              }`}
            >
              Ajouter une annonce
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {tab === 'my-cars' && (
                <div className="grid gap-4">
                  {myCars.length === 0 ? (
                    <div className="bg-card rounded-lg p-8 border border-border text-center">
                      <p className="text-muted-foreground mb-4">Vous n'avez pas d'annonces</p>
                      <button
                        onClick={() => setTab('add-car')}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition"
                      >
                        Créer une annonce
                      </button>
                    </div>
                  ) : (
                    myCars.map((car) => (
                      <div key={car.id} className="bg-card rounded-lg p-6 border border-border flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-bold text-foreground">{car.brand} {car.model}</h3>
                          <p className="text-sm text-muted-foreground">{car.year} • {car.price.toLocaleString()} DT • {car.mileage.toLocaleString()} km</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Statut: <span className="font-semibold capitalize">{car.status}</span>
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/car/${car.id}`} className="text-primary hover:text-primary/80 transition">
                            <Eye className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(car.id)}
                            className="text-red-600 hover:text-red-700 transition"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {tab === 'add-car' && (
                <div className="bg-card rounded-lg p-8 border border-border">
                  <h2 className="text-2xl font-bold mb-6 text-foreground">Créer une nouvelle annonce</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        type="text"
                        name="brand"
                        placeholder="Marque"
                        value={formData.brand}
                        onChange={handleChange}
                        required
                        className="px-4 py-2 border border-border rounded-lg text-foreground bg-background"
                      />
                      <input
                        type="text"
                        name="model"
                        placeholder="Modèle"
                        value={formData.model}
                        onChange={handleChange}
                        required
                        className="px-4 py-2 border border-border rounded-lg text-foreground bg-background"
                      />
                      <input
                        type="number"
                        name="year"
                        placeholder="Année"
                        value={formData.year}
                        onChange={handleChange}
                        required
                        className="px-4 py-2 border border-border rounded-lg text-foreground bg-background"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        type="number"
                        name="price"
                        placeholder="Prix (DT)"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        className="px-4 py-2 border border-border rounded-lg text-foreground bg-background"
                      />
                      <input
                        type="number"
                        name="mileage"
                        placeholder="Kilométrage"
                        value={formData.mileage}
                        onChange={handleChange}
                        required
                        className="px-4 py-2 border border-border rounded-lg text-foreground bg-background"
                      />
                      <select
                        name="fuelType"
                        value={formData.fuelType}
                        onChange={handleChange}
                        className="px-4 py-2 border border-border rounded-lg text-foreground bg-background"
                      >
                        <option value="Essence">Essence</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Hybride">Hybride</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <select
                        name="transmission"
                        value={formData.transmission}
                        onChange={handleChange}
                        className="px-4 py-2 border border-border rounded-lg text-foreground bg-background"
                      >
                        <option value="Manuelle">Manuelle</option>
                        <option value="Automatique">Automatique</option>
                      </select>
                      <select
                        name="condition"
                        value={formData.condition}
                        onChange={handleChange}
                        className="px-4 py-2 border border-border rounded-lg text-foreground bg-background"
                      >
                        <option value="Excellent">Excellent</option>
                        <option value="Bon">Bon</option>
                        <option value="Acceptable">Acceptable</option>
                      </select>
                    </div>

                    <textarea
                      name="description"
                      placeholder="Description détaillée du véhicule"
                      value={formData.description}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-4 py-2 border border-border rounded-lg text-foreground bg-background"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        type="text"
                        name="seller.name"
                        placeholder="Votre nom"
                        value={formData.seller.name}
                        onChange={handleChange}
                        required
                        className="px-4 py-2 border border-border rounded-lg text-foreground bg-background"
                      />
                      <input
                        type="tel"
                        name="seller.phone"
                        placeholder="Votre téléphone"
                        value={formData.seller.phone}
                        onChange={handleChange}
                        required
                        className="px-4 py-2 border border-border rounded-lg text-foreground bg-background"
                      />
                      <input
                        type="email"
                        name="seller.email"
                        placeholder="Votre email"
                        value={formData.seller.email}
                        onChange={handleChange}
                        required
                        className="px-4 py-2 border border-border rounded-lg text-foreground bg-background"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:opacity-90 transition"
                    >
                      Publier l'annonce
                    </button>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function SellerPage() {
  return (
    <ProtectedRoute>
      <SellerContent />
    </ProtectedRoute>
  );
}
