'use client';

import { RegistrationRequest } from '@/lib/db';
import { CheckCircle, X, Eye, FileText, Calendar, User, Car, MapPin, Phone, Mail, Clock, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

interface AdminRegistrationsProps {
  registrations: RegistrationRequest[];
  onUpdate: () => void;
}

export function AdminRegistrations({ registrations, onUpdate }: AdminRegistrationsProps) {
  const [selectedRegistration, setSelectedRegistration] = useState<RegistrationRequest | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState<'complete' | 'reject' | null>(null);

  const handleStatusChange = async (id: string, status: 'completed' | 'rejected') => {
    await fetch('/api/registrations', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    onUpdate();
    setShowConfirmModal(false);
    setSelectedRegistration(null);
    setActionType(null);
  };

  const openConfirmModal = (reg: RegistrationRequest, action: 'complete' | 'reject') => {
    setSelectedRegistration(reg);
    setActionType(action);
    setShowConfirmModal(true);
  };

  const openDetailModal = (reg: RegistrationRequest) => {
    setSelectedRegistration(reg);
    setShowDetailModal(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <X className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const pendingRegistrations = registrations.filter(reg => reg.status === 'pending');
  const completedRegistrations = registrations.filter(reg => reg.status === 'completed');
  const rejectedRegistrations = registrations.filter(reg => reg.status === 'rejected');

  return (
    <div className="space-y-6">
      {/* Modale de confirmation */}
      {showConfirmModal && selectedRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              {actionType === 'complete' ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <X className="w-8 h-8 text-red-600" />
              )}
              <h3 className="text-lg font-semibold text-gray-900">
                {actionType === 'complete' ? 'Accepter la demande' : 'Rejeter la demande'}
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              {actionType === 'complete' 
                ? `Êtes-vous sûr de vouloir accepter la demande d'immatriculation pour ${selectedRegistration.carBrand} ${selectedRegistration.carModel} ?`
                : `Êtes-vous sûr de vouloir rejeter la demande d'immatriculation pour ${selectedRegistration.carBrand} ${selectedRegistration.carModel} ?`
              }
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Annuler
              </button>
              <button
                onClick={() => handleStatusChange(
                  selectedRegistration.id, 
                  actionType === 'complete' ? 'completed' : 'rejected'
                )}
                className={`px-4 py-2 text-white rounded-lg font-medium ${
                  actionType === 'complete' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {actionType === 'complete' ? 'Accepter' : 'Rejeter'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale de détails */}
      {showDetailModal && selectedRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  Détails de l'immatriculation
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Informations du véhicule */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  Informations du véhicule
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Marque et modèle</p>
                    <p className="font-semibold text-gray-900">{selectedRegistration.carBrand} {selectedRegistration.carModel}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Numéro de série</p>
                    <p className="font-semibold text-gray-900">{selectedRegistration.carSerialNumber || 'Non spécifié'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Type de véhicule</p>
                    <p className="font-semibold text-gray-900">{selectedRegistration.carType || 'Particulier'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Couleur</p>
                    <p className="font-semibold text-gray-900">{selectedRegistration.carColor || 'Non spécifié'}</p>
                  </div>
                </div>
              </div>

              {/* Informations du vendeur */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informations du vendeur
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nom complet</p>
                    <p className="font-semibold text-gray-900">{selectedRegistration.sellerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Téléphone</p>
                    <p className="font-semibold text-gray-900">{selectedRegistration.sellerPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-900">{selectedRegistration.sellerEmail || 'Non spécifié'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Adresse</p>
                    <p className="font-semibold text-gray-900">{selectedRegistration.sellerAddress || 'Non spécifié'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">CIN</p>
                    <p className="font-semibold text-gray-900">{selectedRegistration.sellerCIN}</p>
                  </div>
                </div>
              </div>

              {/* Informations de l'acheteur */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informations de l'acheteur
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nom complet</p>
                    <p className="font-semibold text-gray-900">{selectedRegistration.buyerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Téléphone</p>
                    <p className="font-semibold text-gray-900">{selectedRegistration.buyerPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-900">{selectedRegistration.buyerEmail || 'Non spécifié'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Adresse</p>
                    <p className="font-semibold text-gray-900">{selectedRegistration.buyerAddress || 'Non spécifié'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">CIN</p>
                    <p className="font-semibold text-gray-900">{selectedRegistration.buyerCIN}</p>
                  </div>
                </div>
              </div>

              {/* Documents et statut */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Documents et statut
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Date de demande</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(selectedRegistration.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Statut</p>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedRegistration.status)}`}>
                      {getStatusIcon(selectedRegistration.status)}
                      {selectedRegistration.status === 'pending' ? 'En attente' : 
                       selectedRegistration.status === 'completed' ? 'Complété' : 'Rejeté'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {selectedRegistration.status === 'pending' && (
                <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                  <button
                    onClick={() => openConfirmModal(selectedRegistration, 'reject')}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                  >
                    <X className="w-4 h-4" />
                    Rejeter
                  </button>
                  <button
                    onClick={() => openConfirmModal(selectedRegistration, 'complete')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Accepter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">En attente</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingRegistrations.length}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Complétées</p>
              <p className="text-2xl font-bold text-green-600">{completedRegistrations.length}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Rejetées</p>
              <p className="text-2xl font-bold text-red-600">{rejectedRegistrations.length}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <X className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Liste des demandes */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Demandes d'immatriculation ({registrations.length})
          </h3>
        </div>

        {registrations.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucune demande d'immatriculation</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Véhicule</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Vendeur</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Acheteur</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Statut</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {registrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{reg.carBrand} {reg.carModel}</p>
                      <p className="text-sm text-gray-600">{reg.carSerialNumber}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{reg.sellerName}</p>
                      <p className="text-sm text-gray-600">{reg.sellerPhone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{reg.buyerName}</p>
                      <p className="text-sm text-gray-600">{reg.buyerPhone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900 text-sm">
                        {new Date(reg.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(reg.status)}`}>
                        {getStatusIcon(reg.status)}
                        {reg.status === 'pending' ? 'En attente' : 
                         reg.status === 'completed' ? 'Complété' : 'Rejeté'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openDetailModal(reg)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {reg.status === 'pending' && (
                          <>
                            <button
                              onClick={() => openConfirmModal(reg, 'complete')}
                              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                              title="Accepter"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openConfirmModal(reg, 'reject')}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Rejeter"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}