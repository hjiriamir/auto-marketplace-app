// app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProtectedRoute } from '@/components/protected-route';
import { BarChart3, MessageSquare, FileText, Plus, LayoutDashboard, Car as CarIcon, RefreshCw } from 'lucide-react';
import { AdminAddCar } from '@/components/admin/add-car';
import { AdminCarList } from '@/components/admin/car-list';
import { AdminMessages } from '@/components/admin/messages';
import { AdminRegistrations } from '@/components/admin/registrations';
import { AdminDashboard } from '@/components/admin/dashboard';
import carService from '@/services/carService'; // Import du service JS

function AdminContent() {
  const [tab, setTab] = useState('dashboard');
  const [cars, setCars] = useState([]);
  const [messages, setMessages] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddCar, setShowAddCar] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Charger les données au montage du composant
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Récupérer les annonces via le service
      const carsData = await carService.getCars();
      setCars(carsData);

      // Récupérer les autres données (messages et immatriculations)
      const [messagesRes, registrationsRes] = await Promise.all([
        fetch('/api/messages'),
        fetch('/api/registrations'),
      ]);

      const [messagesData, registrationsData] = await Promise.all([
        messagesRes.json(),
        registrationsRes.json(),
      ]);

      setMessages(messagesData);
      setRegistrations(registrationsData);
    } catch (err) {
      console.error('Error loading data:', err);
      // Gérer l'erreur
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleCarUpdate = () => {
    // Recharger les données après une modification
    loadData();
  };

  // Statistiques pour l'affichage
  const activeCars = cars.filter(car => car.status === 'active').length;
  const pendingCars = cars.filter(car => car.status === 'pending').length;
  const soldCars = cars.filter(car => car.status === 'sold').length;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard Admin</h1>
              <p className="text-muted-foreground">Gérez les annonces, messages et immatriculations</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-4 mb-8 border-b border-border">
            <button
              onClick={() => setTab('dashboard')}
              className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
                tab === 'dashboard'
                  ? 'text-primary border-primary'
                  : 'text-muted-foreground border-transparent hover:text-foreground'
              }`}
            >
              <LayoutDashboard className="inline mr-2 w-5 h-5" />
              Tableau de bord
            </button>
            <button
              onClick={() => setTab('cars')}
              className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
                tab === 'cars'
                  ? 'text-primary border-primary'
                  : 'text-muted-foreground border-transparent hover:text-foreground'
              }`}
            >
              <CarIcon className="inline mr-2 w-5 h-5" />
              Annonces ({cars.length})
            </button>
            <button
              onClick={() => setTab('messages')}
              className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
                tab === 'messages'
                  ? 'text-primary border-primary'
                  : 'text-muted-foreground border-transparent hover:text-foreground'
              }`}
            >
              <MessageSquare className="inline mr-2 w-5 h-5" />
              Messages ({messages.length})
            </button>
            <button
              onClick={() => setTab('registrations')}
              className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
                tab === 'registrations'
                  ? 'text-primary border-primary'
                  : 'text-muted-foreground border-transparent hover:text-foreground'
              }`}
            >
              <FileText className="inline mr-2 w-5 h-5" />
              Immatriculations ({registrations.length})
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {tab === 'dashboard' && (
                <AdminDashboard 
                  cars={cars} 
                  messages={messages} 
                  registrations={registrations} 
                />
              )}

              {tab === 'cars' && (
                <div>
                  <div className="mb-6 flex justify-between items-center">
                    <button
                      onClick={() => setShowAddCar(!showAddCar)}
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Ajouter une annonce
                    </button>
                    
                    <div className="text-sm text-muted-foreground">
                      {activeCars} actives • {pendingCars} en attente • {soldCars} vendues
                    </div>
                  </div>

                  {showAddCar && (
                    <AdminAddCar 
                      onSuccess={() => {
                        setShowAddCar(false);
                        handleCarUpdate();
                      }}
                      onCancel={() => setShowAddCar(false)}
                    />
                  )}

                  <AdminCarList cars={cars} onUpdate={handleCarUpdate} />
                </div>
              )}

              {tab === 'messages' && (
                <AdminMessages messages={messages} onUpdate={handleCarUpdate} />
              )}

              {tab === 'registrations' && (
                <AdminRegistrations registrations={registrations} onUpdate={handleCarUpdate} />
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminContent />
    </ProtectedRoute>
  );
}