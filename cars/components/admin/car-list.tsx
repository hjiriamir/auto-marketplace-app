'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Edit2, Trash2, Eye, XCircle, Clock, CheckCircle, Image as ImageIcon } from 'lucide-react';

import carService from '@/services/carService';
import { Car } from '@/types/Car';

interface AdminCarListProps {
  cars: Car[];
  onUpdate: () => void;
}

export function AdminCarList({ cars, onUpdate }: AdminCarListProps) {
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  /* ============================================================
     DELETE CAR
  ============================================================ */
  const handleDelete = async (id: string) => {
    try {
      await carService.deleteCar(id);
      onUpdate();
    } catch (error) {
      console.error("Erreur suppression voiture :", error);
    }
    setShowDeleteModal(false);
    setSelectedCar(null);
  };

  /* ============================================================
     UPDATE STATUS
  ============================================================ */
  const handleStatusChange = async (id: string, status: 'active' | 'sold' | 'pending') => {
    try {
      await carService.updateCar(id, { status });
      onUpdate();
    } catch (error) {
      console.error("Erreur update statut voiture :", error);
    }
  };

  /* ============================================================
     SAVE EDITING
  ============================================================ */
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCar) return;

    try {
      await carService.updateCar(editingCar.id, editingCar);
      onUpdate();
    } catch (error) {
      console.error("Erreur update voiture :", error);
    }

    setEditingCar(null);
  };

  /* ============================================================
     UI HELPERS
  ============================================================ */
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

  /* ============================================================
     RENDER
  ============================================================ */
  return (
    <div className="space-y-6">

      {/* ============================================================
          DELETE MODAL
      ============================================================ */}
      {showDeleteModal && selectedCar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Confirmer la suppression
            </h3>
            <p className="text-gray-600 mb-4">
              Supprimer {selectedCar.brand} {selectedCar.model} ?
              Cette action est irréversible.
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

      {/* ============================================================
          VIEW MODAL
      ============================================================ */}
      {showViewModal && selectedCar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold">
                {selectedCar.brand} {selectedCar.model}
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                {selectedCar.images?.length > 0 ? (
                  <div className="relative h-64 rounded-lg overflow-hidden">
                    <Image
                      src={selectedCar.images[0]}
                      alt="car-image"
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
                <div className="grid grid-cols-2 gap-4 text-gray-900">
                  <div><span className="font-medium">Prix:</span> {selectedCar.price} DT</div>
                  <div><span className="font-medium">Année:</span> {selectedCar.year}</div>
                  <div><span className="font-medium">KM:</span> {selectedCar.mileage} km</div>
                  <div><span className="font-medium">Carburant:</span> {selectedCar.fuelType}</div>
                </div>

                <div>
                  <p className="font-medium text-gray-700">Description</p>
                  <p>{selectedCar.description}</p>
                </div>

                <div>
                  <p className="font-medium text-gray-700">Vendeur</p>
                  <p>{selectedCar.seller.name}</p>
                  <p className="text-gray-600">{selectedCar.seller.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          EDIT MODAL
      ============================================================ */}
      {editingCar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold">
                Modifier {editingCar.brand} {editingCar.model}
              </h3>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Brand */}
                <div>
                  <label className="block text-sm font-medium mb-1">Marque</label>
                  <input
                    type="text"
                    value={editingCar.brand}
                    onChange={(e) => setEditingCar({ ...editingCar, brand: e.target.value })}
                    className="input"
                  />
                </div>

                {/* Model */}
                <div>
                  <label className="block text-sm font-medium mb-1">Modèle</label>
                  <input
                    type="text"
                    value={editingCar.model}
                    onChange={(e) => setEditingCar({ ...editingCar, model: e.target.value })}
                    className="input"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium mb-1">Prix (DT)</label>
                  <input
                    type="number"
                    value={editingCar.price}
                    onChange={(e) => setEditingCar({ ...editingCar, price: Number(e.target.value) })}
                    className="input"
                  />
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-medium mb-1">Année</label>
                  <input
                    type="number"
                    value={editingCar.year}
                    onChange={(e) => setEditingCar({ ...editingCar, year: Number(e.target.value) })}
                    className="input"
                  />
                </div>

                {/* Mileage */}
                <div>
                  <label className="block text-sm font-medium mb-1">Kilométrage</label>
                  <input
                    type="number"
                    value={editingCar.mileage}
                    onChange={(e) => setEditingCar({ ...editingCar, mileage: Number(e.target.value) })}
                    className="input"
                  />
                </div>

                {/* Fuel */}
                <div>
                  <label className="block text-sm font-medium mb-1">Carburant</label>
                  <select
                    value={editingCar.fuelType}
                    onChange={(e) => setEditingCar({ ...editingCar, fuelType: e.target.value })}
                    className="input"
                  >
                    <option value="Essence">Essence</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybride">Hybride</option>
                    <option value="Électrique">Électrique</option>
                  </select>
                </div>

              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={editingCar.description}
                  onChange={(e) => setEditingCar({ ...editingCar, description: e.target.value })}
                  rows={4}
                  className="input"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingCar(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          CAR LIST
      ============================================================ */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">
            Gestion des Véhicules ({cars.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="th">Véhicule</th>
                <th className="th">Prix</th>
                <th className="th">Année/KM</th>
                <th className="th">Statut</th>
                <th className="th">Vendeur</th>
                <th className="th">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {cars.map((car) => (
                <tr key={car.id} className="hover:bg-gray-50">

                  {/* VEHICLE COLUMN */}
                  <td className="td">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-12">
                        {car.images?.length > 0 ? (
                          <Image
                            src={car.images[0]}
                            alt="car image"
                            fill
                            className="object-cover rounded-lg"
                          />
                        ) : (
                          <div className="bg-gray-100 w-16 h-12 rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{car.brand} {car.model}</p>
                        <p className="text-sm text-gray-600">{car.fuelType}</p>
                      </div>
                    </div>
                  </td>

                  {/* PRICE */}
                  <td className="td font-semibold">{car.price.toLocaleString()} DT</td>

                  {/* YEAR / KM */}
                  <td className="td">
                    <p>{car.year}</p>
                    <p className="text-sm text-gray-600">{car.mileage.toLocaleString()} km</p>
                  </td>

                  {/* STATUS */}
                  <td className="td">
                    <select
                      value={car.status}
                      onChange={(e) => handleStatusChange(car.id, e.target.value as any)}
                      className={`px-3 py-1 rounded-lg text-sm border ${getStatusColor(car.status)}`}
                    >
                      <option value="active">Actif</option>
                      <option value="pending">En attente</option>
                      <option value="sold">Vendu</option>
                    </select>
                  </td>

                  {/* SELLER */}
                  <td className="td">
                    <p>{car.seller.name}</p>
                    <p className="text-sm text-gray-600">{car.seller.phone}</p>
                  </td>

                  {/* ACTIONS */}
                  <td className="td">
                    <div className="flex items-center gap-2">

                      {/* VIEW */}
                      <button
                        onClick={() => { setSelectedCar(car); setShowViewModal(true); }}
                        className="btn-icon hover:text-blue-600 hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* EDIT */}
                      <button
                        onClick={() => setEditingCar(car)}
                        className="btn-icon hover:text-green-600 hover:bg-green-50"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() => { setSelectedCar(car); setShowDeleteModal(true); }}
                        className="btn-icon hover:text-red-600 hover:bg-red-50"
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
