'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Car } from '@/lib/db';
import { Phone, Mail, MapPin, Gauge, Fuel, Cog, Calendar, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [carId, setCarId] = useState<string | null>(null);

  useEffect(() => {
    params.then(({ id }) => {
      setCarId(id);
      fetch(`/api/cars/${id}`)
        .then(res => res.json())
        .then(data => {
          setCar(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching car:', err);
          setLoading(false);
        });
    });
  }, [params]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!car) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <p className="text-center text-lg text-muted-foreground">Véhicule non trouvé</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/catalog" className="text-primary hover:underline mb-6 inline-block">
            ← Retour au catalogue
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Images */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg overflow-hidden border border-border">
                <div className="relative h-96 bg-muted">
                  <Image
                    src={car.images[selectedImage] || '/placeholder.svg'}
                    alt={`${car.brand} ${car.model}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {car.images.map((image, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                        selectedImage === idx ? 'border-primary' : 'border-border'
                      }`}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`thumbnail ${idx}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Specs */}
              <div className="bg-card rounded-lg p-6 border border-border mt-8">
                <h2 className="text-2xl font-bold mb-6 text-foreground">Caractéristiques</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span className="text-muted-foreground">Année</span>
                    </div>
                    <p className="text-xl font-bold text-foreground">{car.year}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Gauge className="w-5 h-5 text-primary" />
                      <span className="text-muted-foreground">Kilométrage</span>
                    </div>
                    <p className="text-xl font-bold text-foreground">{car.mileage.toLocaleString()} km</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Fuel className="w-5 h-5 text-primary" />
                      <span className="text-muted-foreground">Carburant</span>
                    </div>
                    <p className="text-xl font-bold text-foreground">{car.fuelType}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Cog className="w-5 h-5 text-primary" />
                      <span className="text-muted-foreground">Transmission</span>
                    </div>
                    <p className="text-xl font-bold text-foreground">{car.transmission}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">État</span>
                    <p className="text-xl font-bold text-foreground">{car.condition}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Statut</span>
                    <p className="text-xl font-bold text-foreground capitalize">{car.status}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-card rounded-lg p-6 border border-border mt-8">
                <h2 className="text-2xl font-bold mb-4 text-foreground">Description</h2>
                <p className="text-muted-foreground leading-relaxed">{car.description}</p>
              </div>
            </div>

            {/* Sidebar - Price & Contact */}
            <div>
              <div className="bg-card rounded-lg p-6 border border-border sticky top-24">
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-2">Prix</p>
                  <div className="text-4xl font-bold text-primary">
                    {car.price.toLocaleString()} DT
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-accent mt-1" />
                    <div className="text-sm text-muted-foreground">
                      <p className="font-semibold text-foreground mb-1">Annonce vérifiée</p>
                      <p>Tous nos véhicules sont vérifiés et authentifiés.</p>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-background rounded-lg p-4 mb-6 border border-border">
                  <h3 className="font-bold mb-4 text-foreground">Vendeur</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Nom</p>
                      <p className="font-semibold text-foreground">{car.seller.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Téléphone</p>
                      <a href={`tel:${car.seller.phone}`} className="flex items-center gap-2 text-primary hover:underline">
                        <Phone className="w-4 h-4" />
                        {car.seller.phone}
                      </a>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Email</p>
                      <a href={`mailto:${car.seller.email}`} className="flex items-center gap-2 text-primary hover:underline">
                        <Mail className="w-4 h-4" />
                        {car.seller.email}
                      </a>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:opacity-90 transition mb-3">
                  Contacter le vendeur
                </button>

                <Link href={`/registration?carId=${carId}`} className="w-full bg-accent text-accent-foreground py-3 rounded-lg font-bold hover:opacity-90 transition block text-center">
                  Immatriculer ce véhicule
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
