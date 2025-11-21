'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProtectedRoute } from '@/components/protected-route';
import { Car, ContactMessage, RegistrationRequest } from '@/lib/db';
import { BarChart3, MessageSquare, FileText, Plus, LayoutDashboard, Car as CarIcon } from 'lucide-react';
import { AdminAddCar } from '@/components/admin/add-car';
import { AdminCarList } from '@/components/admin/car-list';
import { AdminMessages } from '@/components/admin/messages';
import { AdminRegistrations } from '@/components/admin/registrations';
import { AdminDashboard } from '@/components/admin/dashboard';

function AdminContent() {
  const [tab, setTab] = useState<'dashboard' | 'cars' | 'messages' | 'registrations'>('dashboard');
  const [cars, setCars] = useState<Car[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddCar, setShowAddCar] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [carsRes, messagesRes, registrationsRes] = await Promise.all([
        fetch('/api/cars'),
        fetch('/api/messages'),
        fetch('/api/registrations'),
      ]);

      const [carsData, messagesData, registrationsData] = await Promise.all([
        carsRes.json(),
        messagesRes.json(),
        registrationsRes.json(),
      ]);

      setCars(carsData);
      setMessages(messagesData);
      setRegistrations(registrationsData);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard Admin</h1>
            <p className="text-muted-foreground">Gérez les annonces, messages et immatriculations</p>
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
                <AdminDashboard cars={cars} messages={messages} registrations={registrations} />
              )}

              {tab === 'cars' && (
                <div>
                  <div className="mb-6">
                    <button
                      onClick={() => setShowAddCar(!showAddCar)}
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Ajouter une annonce
                    </button>
                  </div>

                  {showAddCar && (
                    <AdminAddCar 
                      onSuccess={() => {
                        setShowAddCar(false);
                        loadData();
                      }}
                    />
                  )}

                  <AdminCarList cars={cars} onUpdate={loadData} />
                </div>
              )}

              {tab === 'messages' && (
                <AdminMessages messages={messages} />
              )}

              {tab === 'registrations' && (
                <AdminRegistrations registrations={registrations} onUpdate={loadData} />
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