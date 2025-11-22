'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Edit2, Trash2, Eye, XCircle, Clock, CheckCircle, Image as ImageIcon, Upload, Plus, Trash2 as TrashIcon } from 'lucide-react';
import carService from '@/services/carService';

interface AdminCarListProps {
  cars: any[];
  onUpdate: () => void;
}

export function AdminCarList({ cars, onUpdate }: AdminCarListProps) {
  const [editingCar, setEditingCar] = useState<any>(null);
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  
  // États pour la gestion des images dans l'édition
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Générer une clé unique pour chaque voiture
  const getCarKey = (car: any, index: number) => {
    if (car.id) return car.id;
    if (car._id) return car._id;
    return `car-${index}-${car.brand}-${car.model}`;
  };

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

  const handleStatusChange = async (id: string, status: 'active' | 'sold' | 'pending') => {
    try {
      await carService.updateCar(id, { status });
      onUpdate();
    } catch (error) {
      console.error("Erreur update statut voiture :", error);
    }
  };

  // Gestion de l'upload de nouvelles images
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImagesList: File[] = [];
    const newPreviews: string[] = [];

    const remainingSlots = 10 - (editingCar.images?.length || 0) - newImages.length;
    const filesToAdd = Array.from(files).slice(0, remainingSlots);

    filesToAdd.forEach(file => {
      if (file.type.startsWith('image/')) {
        newImagesList.push(file);
        const previewUrl = URL.createObjectURL(file);
        newPreviews.push(previewUrl);
      }
    });

    setNewImages(prev => [...prev, ...newImagesList]);
    setNewImagePreviews(prev => [...prev, ...newPreviews]);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Supprimer une nouvelle image (pas encore uploadée)
  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Supprimer une image existante
  const removeExistingImage = (imageUrl: string) => {
    setImagesToDelete(prev => [...prev, imageUrl]);
    setEditingCar(prev => ({
      ...prev,
      images: prev.images.filter((img: string) => img !== imageUrl)
    }));
  };

  // Restaurer une image supprimée
  const restoreImage = (imageUrl: string) => {
    setImagesToDelete(prev => prev.filter(img => img !== imageUrl));
    setEditingCar(prev => ({
      ...prev,
      images: [...prev.images, imageUrl]
    }));
  };

const handleSaveEdit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!editingCar) return;

  try {
    // Créer FormData pour l'update avec images
    const formData = new FormData();

    // Ajouter les champs texte
    Object.keys(editingCar).forEach(key => {
      if (key !== 'images' && key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'seller') {
        formData.append(key, editingCar[key].toString());
      }
    });

    // Ajouter le seller (important pour votre route)
    if (editingCar.seller) {
      formData.append('seller', JSON.stringify(editingCar.seller));
    }

    newImages.forEach((image, index) => {
      formData.append('images', image);
    });

    // Ajouter l'option pour remplacer les images si nécessaire
    if (imagesToDelete.length > 0 && newImages.length > 0) {
      formData.append('replaceImages', 'true');
    }

    console.log('📤 Update avec FormData:', {
      id: editingCar._id,
      newImagesCount: newImages.length,
      imagesToDelete: imagesToDelete.length,
      replaceImages: imagesToDelete.length > 0 && newImages.length > 0
    });

    // Debug: afficher le contenu de FormData
    for (let [key, value] of formData.entries()) {
      console.log(`🔍 FormData ${key}:`, value);
    }

    // Utiliser la nouvelle méthode avec FormData
    await carService.updateCarWithImages(editingCar._id, formData);
    
    // Nettoyer les URLs temporaires
    newImagePreviews.forEach(url => URL.revokeObjectURL(url));
    
    // Réinitialiser les états
    setNewImages([]);
    setNewImagePreviews([]);
    setImagesToDelete([]);
    setEditingCar(null);
    
    onUpdate();

  } catch (error) {
    console.error("Erreur update voiture :", error);
    // Afficher un message d'erreur à l'utilisateur
    alert("Erreur lors de la mise à jour: " + (error.response?.data?.message || error.message));
  }
};

  // Réinitialiser l'édition
  const cancelEdit = () => {
    // Nettoyer les URLs temporaires
    newImagePreviews.forEach(url => URL.revokeObjectURL(url));
    setNewImages([]);
    setNewImagePreviews([]);
    setImagesToDelete([]);
    setEditingCar(null);
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
                onClick={() => handleDelete(selectedCar._id)}
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
          EDIT MODAL WITH IMAGE MANAGEMENT
      ============================================================ */}
      {editingCar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold">
                Modifier {editingCar.brand} {editingCar.model}
              </h3>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-6">
              {/* SECTION IMAGES */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-semibold mb-4 text-gray-900">Images du véhicule</h4>
                
                {/* Images existantes */}
                {editingCar.images?.length > 0 && (
                  <div className="mb-6">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">Images actuelles</h5>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {editingCar.images.map((image: string, index: number) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Image ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(image)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
                          >
                            <TrashIcon className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Images supprimées (peuvent être restaurées) */}
                {imagesToDelete.length > 0 && (
                  <div className="mb-6">
                    <h5 className="text-sm font-medium text-red-700 mb-3">Images supprimées</h5>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {imagesToDelete.map((image: string, index: number) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Image supprimée ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-red-200 opacity-50"
                          />
                          <button
                            type="button"
                            onClick={() => restoreImage(image)}
                            className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ajout de nouvelles images */}
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Ajouter de nouvelles images</h5>
                  
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors duration-300 cursor-pointer mb-4"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">
                      Cliquez pour ajouter des images
                    </p>
                    <p className="text-xs text-gray-500">
                      JPG, PNG, WEBP (max {10 - (editingCar.images?.length || 0) - newImages.length} emplacements restants)
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>

                  {/* Prévisualisation des nouvelles images */}
                  {newImagePreviews.length > 0 && (
                    <div className="mt-4">
                      <h6 className="text-sm font-medium text-gray-700 mb-2">Nouvelles images à uploader</h6>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {newImagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Nouvelle image ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-blue-200"
                            />
                            <button
                              type="button"
                              onClick={() => removeNewImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
                            >
                              <TrashIcon className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* VEHICLE INFORMATION */}
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

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium border border-gray-300 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          CAR LIST TABLE
      ============================================================ */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">
            Gestion des Véhicules ({cars?.length || 0})
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
              {cars && cars.map((car, index) => (
                <tr 
                  key={getCarKey(car, index)}
                  className="hover:bg-gray-50"
                >
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
                  <td className="td font-semibold">
                    {car.price?.toLocaleString() || '0'} DT
                  </td>

                  {/* YEAR / KM */}
                  <td className="td">
                    <p>{car.year}</p>
                    <p className="text-sm text-gray-600">
                      {(car.mileage?.toLocaleString() || '0')} km
                    </p>
                  </td>

                  {/* STATUS */}
                  <td className="td">
                    <select
                      value={car.status || 'pending'}
                      onChange={(e) => handleStatusChange(car._id, e.target.value as any)}
                      className={`px-3 py-1 rounded-lg text-sm border ${getStatusColor(car.status)}`}
                    >
                      <option value="active">Actif</option>
                      <option value="pending">En attente</option>
                      <option value="sold">Vendu</option>
                    </select>
                  </td>

                  {/* SELLER */}
                  <td className="td">
                    <p>{car.seller?.name || 'Non spécifié'}</p>
                    <p className="text-sm text-gray-600">
                      {car.seller?.phone || 'Non spécifié'}
                    </p>
                  </td>

                  {/* ACTIONS */}
                  <td className="td">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setSelectedCar(car); setShowViewModal(true); }}
                        className="btn-icon hover:text-blue-600 hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setEditingCar(car)}
                        className="btn-icon hover:text-green-600 hover:bg-green-50"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

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

          {(!cars || cars.length === 0) && (
            <div className="text-center py-12">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun véhicule trouvé</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}