'use client';

import { Car } from '@/lib/db';
import { Edit2, Trash2, Eye, MoreVertical, CheckCircle, XCircle, Clock, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

interface AdminCarListProps {
  cars: Car[];
  onUpdate: () => void;
}

export function AdminCarList({ cars, onUpdate }: AdminCarListProps) {
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const handleDelete = async (id: string) => {
    await fetch(`/api/cars/${id}`, { method: 'DELETE' });
    onUpdate();
    setShowDeleteModal(false);
    setSelectedCar(null);
  };

  const handleStatusChange = async (id: string, status: 'active' | 'sold' | 'pending') => {
    await fetch(`/api/cars/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    onUpdate();
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCar) return;

    await fetch(`/api/cars/${editingCar.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingCar),
    });
    
    setEditingCar(null);
    onUpdate();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'sold':
        return <XCircle className="w-4 h-4 text-gray-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'sold':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Modal de suppression */}
      {showDeleteModal && selectedCar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmer la suppression</h3>
            <p className="text-gray-600 mb-4">
              Êtes-vous sûr de vouloir supprimer {selectedCar.brand} {selectedCar.model} ? Cette action est irréversible.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(selectedCar.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de visualisation */}
      {showViewModal && selectedCar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedCar.brand} {selectedCar.model}
                </h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  {selectedCar.images && selectedCar.images.length > 0 ? (
                    <div className="relative h-64 rounded-lg overflow-hidden">
                      <Image
                        src={selectedCar.images[0]}
                        alt={`${selectedCar.brand} ${selectedCar.model}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Prix</p>
                      <p className="text-lg font-semibold text-gray-900">{selectedCar.price.toLocaleString()} DT</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Année</p>
                      <p className="text-lg font-semibold text-gray-900">{selectedCar.year}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Kilométrage</p>
                      <p className="text-lg font-semibold text-gray-900">{selectedCar.mileage.toLocaleString()} km</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Carburant</p>
                      <p className="text-lg font-semibold text-gray-900">{selectedCar.fuelType}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="text-gray-900 mt-1">{selectedCar.description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Vendeur</p>
                    <p className="text-gray-900 mt-1">{selectedCar.seller.name}</p>
                    <p className="text-sm text-gray-600">{selectedCar.seller.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition */}
      {editingCar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Modifier {editingCar.brand} {editingCar.model}
              </h3>
            </div>
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
                  <input
                    type="text"
                    value={editingCar.brand}
                    onChange={(e) => setEditingCar({ ...editingCar, brand: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
                  <input
                    type="text"
                    value={editingCar.model}
                    onChange={(e) => setEditingCar({ ...editingCar, model: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix (DT)</label>
                  <input
                    type="number"
                    value={editingCar.price}
                    onChange={(e) => setEditingCar({ ...editingCar, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
                  <input
                    type="number"
                    value={editingCar.year}
                    onChange={(e) => setEditingCar({ ...editingCar, year: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kilométrage</label>
                  <input
                    type="number"
                    value={editingCar.mileage}
                    onChange={(e) => setEditingCar({ ...editingCar, mileage: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Carburant</label>
                  <select
                    value={editingCar.fuelType}
                    onChange={(e) => setEditingCar({ ...editingCar, fuelType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Essence">Essence</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybride">Hybride</option>
                    <option value="Électrique">Électrique</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editingCar.description}
                  onChange={(e) => setEditingCar({ ...editingCar, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setEditingCar(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Liste des véhicules */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Gestion des Véhicules ({cars.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Véhicule</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Prix</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Année/KM</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Statut</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Vendeur</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cars.map((car) => (
                <tr key={car.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-12 flex-shrink-0">
                        {car.images && car.images.length > 0 ? (
                          <Image
                            src={car.images[0]}
                            alt={`${car.brand} ${car.model}`}
                            fill
                            className="object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{car.brand} {car.model}</p>
                        <p className="text-sm text-gray-600 capitalize">{car.fuelType.toLowerCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{car.price.toLocaleString()} DT</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900">{car.year}</p>
                    <p className="text-sm text-gray-600">{car.mileage.toLocaleString()} km</p>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={car.status}
                      onChange={(e) => handleStatusChange(car.id, e.target.value as any)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium border ${getStatusColor(car.status)}`}
                    >
                      <option value="active">Actif</option>
                      <option value="pending">En attente</option>
                      <option value="sold">Vendu</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900">{car.seller.name}</p>
                    <p className="text-sm text-gray-600">{car.seller.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedCar(car);
                          setShowViewModal(true);
                        }}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingCar(car)}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                        title="Modifier"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCar(car);
                          setShowDeleteModal(true);
                        }}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {cars.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun véhicule trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}