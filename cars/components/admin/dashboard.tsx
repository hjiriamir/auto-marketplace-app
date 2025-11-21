'use client';

import { Car, ContactMessage, RegistrationRequest } from '@/lib/db';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Eye, Car as CarIcon, Users, ShoppingCart, MessageSquare, FileText, TrendingUp } from 'lucide-react';

interface AdminDashboardProps {
  cars: Car[];
  messages: ContactMessage[];
  registrations: RegistrationRequest[];
}

export function AdminDashboard({ cars, messages, registrations }: AdminDashboardProps) {
  // Statistiques calculées
  const stats = {
    totalViews: 15428,
    totalProducts: cars.length,
    totalUsers: 842,
    totalSales: cars.filter(c => c.status === 'sold').length,
    activeCars: cars.filter(c => c.status === 'active').length,
    soldCars: cars.filter(c => c.status === 'sold').length,
    newMessages: messages.length,
    pendingRegistrations: registrations.filter(r => r.status === 'pending').length,
  };

  // Données par semaine (4 dernières semaines)
  const weeklyData = [
    { 
      week: 'Sem 1', 
      views: 420, 
      sales: 8,
      startDate: '01 Jan'
    },
    { 
      week: 'Sem 2', 
      views: 380, 
      sales: 6,
      startDate: '08 Jan'
    },
    { 
      week: 'Sem 3', 
      views: 510, 
      sales: 12,
      startDate: '15 Jan'
    },
    { 
      week: 'Sem 4', 
      views: 480, 
      sales: 10,
      startDate: '22 Jan'
    },
  ];

  // Top products (véhicules les plus populaires)
  const topProducts = cars.slice(0, 4).map((car, index) => ({
    id: car.id,
    no: index + 1,
    name: car.model.length > 25 ? car.model.substring(0, 25) + '...' : car.model,
    status: car.status === 'active' ? 'Active' : 'Vendue',
    sold: car.status === 'sold' ? 1 : 0,
    view: Math.floor(Math.random() * 200) + 50,
  }));

  // Si pas assez de voitures, on complète avec des données d'exemple
  const exampleProducts = [
    { id: 1, no: 1, name: 'Peugeot 208 Active Pack', status: 'Active', sold: 0, view: 156 },
    { id: 2, no: 2, name: 'Renault Clio Intens', status: 'Active', sold: 0, view: 142 },
    { id: 3, no: 3, name: 'Dacia Sandero Stepway', status: 'Active', sold: 0, view: 128 },
    { id: 4, no: 4, name: 'Citroën C3 Shine', status: 'Active', sold: 0, view: 115 },
  ];

  const displayProducts = topProducts.length >= 4 ? topProducts : exampleProducts;

  // Calcul des totaux
  const totalViews = weeklyData.reduce((sum, week) => sum + week.views, 0);
  const totalSales = weeklyData.reduce((sum, week) => sum + week.sales, 0);

  return (
    <div className="space-y-8">
      {/* Grid des statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Views */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Vues</p>
              <p className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">4 dernières semaines</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Véhicules</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              <p className="text-xs text-gray-500 mt-1">+ Ajouter un véhicule</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CarIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Utilisateurs</p>
              <p className="text-2xl font-bold text-gray-900">842</p>
              <p className="text-xs text-gray-500 mt-1">Nouveaux utilisateurs chaque semaine</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Total Sales */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Ventes</p>
              <p className="text-2xl font-bold text-gray-900">{totalSales}</p>
              <p className="text-xs text-gray-500 mt-1">4 dernières semaines</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tableau des véhicules populaires */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Véhicules Populaires</h3>
          </div>
          <div className="p-6">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-600 border-b border-gray-200">
                  <th className="pb-3 font-medium">No</th>
                  <th className="pb-3 font-medium">Nom du Véhicule</th>
                  <th className="pb-3 font-medium">Statut</th>
                  <th className="pb-3 font-medium">Vendus</th>
                  <th className="pb-3 font-medium">Vues</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayProducts.map((product) => (
                  <tr key={product.id} className="text-sm">
                    <td className="py-3 text-gray-600">{product.no}</td>
                    <td className="py-3 font-medium text-gray-900">{product.name}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.status === 'Active' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-600">{product.sold}</td>
                    <td className="py-3 text-gray-600">{product.view}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Graphique des vues et ventes par semaine */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Vues & Ventes par Semaine</h3>
          </div>
          <div className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="week" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    formatter={(value, name) => {
                      if (name === 'views') return [value, 'Vues'];
                      if (name === 'sales') return [value, 'Ventes'];
                      return [value, name];
                    }}
                    labelFormatter={(label) => {
                      const weekData = weeklyData.find(w => w.week === label);
                      return `Semaine: ${weekData?.startDate}`;
                    }}
                  />
                  <Bar 
                    dataKey="views" 
                    fill="#3B82F6" 
                    radius={[4, 4, 0, 0]}
                    name="Vues"
                  />
                  <Bar 
                    dataKey="sales" 
                    fill="#10B981" 
                    radius={[4, 4, 0, 0]}
                    name="Ventes"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center mt-4 space-x-8">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Vues par semaine</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Ventes par semaine</span>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Total 4 semaines: <span className="font-semibold">{totalViews.toLocaleString()} vues</span> • {' '}
                <span className="font-semibold">{totalSales} ventes</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Moyenne: <span className="font-semibold">{Math.round(totalViews / 4)} vues/semaine</span> • {' '}
                <span className="font-semibold">{(totalSales / 4).toFixed(1)} ventes/semaine</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques supplémentaires */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-red-50 rounded-lg mr-4">
              <MessageSquare className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Messages non lus</p>
              <p className="text-2xl font-bold text-gray-900">{stats.newMessages}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-50 rounded-lg mr-4">
              <FileText className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Immatriculations en attente</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingRegistrations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-indigo-50 rounded-lg mr-4">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Taux de conversion</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalViews > 0 ? ((totalSales / totalViews) * 100).toFixed(1) : '0'}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Détails par semaine */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Détails par Semaine</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {weeklyData.map((week, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-900">{week.week}</p>
                <p className="text-sm text-gray-600 mb-2">Début: {week.startDate}</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Vues:</span>
                    <span className="font-semibold text-blue-600">{week.views}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Ventes:</span>
                    <span className="font-semibold text-green-600">{week.sales}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-gray-200 pt-2">
                    <span className="text-sm text-gray-600">Taux:</span>
                    <span className="font-semibold text-indigo-600">
                      {week.views > 0 ? ((week.sales / week.views) * 100).toFixed(1) : '0'}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}