'use client';

import { useState, useRef } from 'react';
import { X, Upload, Plus, Trash2 } from 'lucide-react';

interface AddCarProps {
  onSuccess: () => void;
}

export function AdminAddCar({ onSuccess }: AddCarProps) {
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
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: File[] = [];
    const newPreviews: string[] = [];

    // Limiter à 10 images maximum
    const remainingSlots = 10 - images.length;
    const filesToAdd = Array.from(files).slice(0, remainingSlots);

    filesToAdd.forEach(file => {
      if (file.type.startsWith('image/')) {
        newImages.push(file);
        const previewUrl = URL.createObjectURL(file);
        newPreviews.push(previewUrl);
      }
    });

    setImages(prev => [...prev, ...newImages]);
    setImagePreviews(prev => [...prev, ...newPreviews]);

    // Reset le input file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      URL.revokeObjectURL(prev[index]); // Libérer la mémoire
      return prev.filter((_, i) => i !== index);
    });
  };

  const uploadImagesToServer = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'car_uploads'); // Remplacez par votre upload preset Cloudinary

      try {
        const response = await fetch('https://api.cloudinary.com/v1_1/your-cloud-name/image/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          uploadedUrls.push(data.secure_url);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation de base
    if (images.length === 0) {
      setError('Veuillez ajouter au moins une image');
      setLoading(false);
      return;
    }

    try {
      let imageUrls: string[] = [];

      // Option 1: Upload vers Cloudinary (recommandé)
      if (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
        imageUrls = await uploadImagesToServer(images);
      } else {
        // Option 2: Simulation d'upload (pour le développement)
        // En production, vous devriez utiliser un service comme Cloudinary, AWS S3, etc.
        imageUrls = imagePreviews; // Utilise les previews comme URLs temporaires
        console.warn('Using image previews as URLs. In production, implement proper image upload.');
      }

      const response = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          images: imageUrls,
          status: 'active',
        }),
      });

      if (response.ok) {
        // Nettoyer les URLs temporaires
        imagePreviews.forEach(url => URL.revokeObjectURL(url));
        setImages([]);
        setImagePreviews([]);
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
          seller: {
            name: '',
            phone: '',
            email: '',
          },
        });
        onSuccess();
      } else {
        setError('Erreur lors de l\'ajout de l\'annonce');
      }
    } catch (err) {
      setError('Erreur lors de l\'ajout de l\'annonce');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Nouvelle annonce</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section Images */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Images du véhicule</h3>
          
          {/* Zone de drop et upload */}
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors duration-300 cursor-pointer mb-4"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              Cliquez pour ajouter des images ou glissez-déposez
            </p>
            <p className="text-sm text-gray-500">
              JPG, PNG, WEBP (max 10 images)
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

          {/* Prévisualisation des images */}
          {imagePreviews.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Images sélectionnées ({imagePreviews.length}/10)
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 px-2 rounded-b-lg">
                      Image {index + 1}
                    </div>
                  </div>
                ))}
                
                {/* Bouton pour ajouter plus d'images */}
                {imagePreviews.length < 10 && (
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg h-24 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors duration-300"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Plus className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Informations du véhicule */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Marque *</label>
            <input
              type="text"
              name="brand"
              placeholder="Ex: Renault"
              value={formData.brand}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Modèle *</label>
            <input
              type="text"
              name="model"
              placeholder="Ex: Clio"
              value={formData.model}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Année *</label>
            <input
              type="number"
              name="year"
              placeholder="Année"
              min="1990"
              max={new Date().getFullYear() + 1}
              value={formData.year}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prix (DT) *</label>
            <input
              type="number"
              name="price"
              placeholder="Prix en DT"
              min="0"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kilométrage *</label>
            <input
              type="number"
              name="mileage"
              placeholder="Kilométrage"
              min="0"
              value={formData.mileage}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Carburant *</label>
            <select
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Essence">Essence</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybride">Hybride</option>
              <option value="Électrique">Électrique</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Transmission *</label>
            <select
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Manuelle">Manuelle</option>
              <option value="Automatique">Automatique</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">État *</label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Excellent">Excellent</option>
              <option value="Bon">Bon</option>
              <option value="Acceptable">Acceptable</option>
              <option value="À réparer">À réparer</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            placeholder="Décrivez le véhicule, ses options, son historique..."
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Informations du vendeur */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Informations du vendeur</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
              <input
                type="text"
                name="seller.name"
                placeholder="Nom complet"
                value={formData.seller.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
              <input
                type="tel"
                name="seller.phone"
                placeholder="Numéro de téléphone"
                value={formData.seller.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                name="seller.email"
                placeholder="Adresse email"
                value={formData.seller.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading || images.length === 0}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Ajout en cours...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Ajouter l'annonce
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}