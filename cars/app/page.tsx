'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { SearchHero } from '@/components/search-hero';
import { CarCard } from '@/components/car-card';
import { Car } from '@/lib/db';
import { ArrowRight, CheckCircle, DollarSign, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cars')
      .then(res => res.json())
      .then(data => {
        setFeaturedCars(data.slice(0, 6));
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching cars:', err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Header />
      <main>
        <SearchHero />

        <section id="featured" className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16 animate-in-up">
              <span className="inline-block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-sm font-bold uppercase tracking-wider mb-3">
                Annonces en vedette
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Véhicules disponibles maintenant
              </h2>
              <p className="text-muted-foreground max-w-2xl">
                Découvrez nos meilleures offres du moment avec des prix justes et des conditions transparentes
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-card rounded-xl h-72 animate-pulse border border-border/50" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredCars.map((car, idx) => (
                  <div key={car.id} style={{ animationDelay: `${idx * 0.1}s` }} className="animate-in-up">
                    <CarCard car={car} />
                  </div>
                ))}
              </div>
            )}

            <div className="mt-16 text-center animate-in-up" style={{ animationDelay: '0.6s' }}>
              <Link href="/catalog" className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-primary/30">
                Voir tout le catalogue
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 bg-card border-y border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center animate-in-up">
              <span className="inline-block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-sm font-bold uppercase tracking-wider mb-3">
                Pourquoi AutoPlus
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                L'expérience automobile de confiance
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: CheckCircle,
                  title: 'Annonces vérifiées',
                  description: 'Toutes les annonces sont vérifiées et authentifiées par notre équipe d\'experts.',
                },
                {
                  icon: DollarSign,
                  title: 'Prix transparents',
                  description: 'Pas de frais cachés, prix clairs et justes pour chaque véhicule.',
                },
                {
                  icon: Zap,
                  title: 'Procédures simples',
                  description: 'Immatriculation facile et support complet pour toutes vos démarches.',
                },
              ].map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={idx}
                    style={{ animationDelay: `${idx * 0.1}s` }}
                    className="bg-background rounded-xl p-8 border border-border/50 hover:border-primary/50 transition-all duration-300 group animate-in-up hover:shadow-lg hover:shadow-primary/10"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-r from-primary/20 via-background to-accent/20 border-y border-border/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Prêt à trouver votre véhicule ?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Commencez votre recherche dès maintenant et trouvez la voiture qui vous convient parfaitement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/catalog" className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-accent text-primary-foreground px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
                Parcourir le catalogue
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 border border-primary text-primary hover:bg-primary/10 px-8 py-4 rounded-xl font-semibold transition-all duration-300">
                Nous contacter
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
