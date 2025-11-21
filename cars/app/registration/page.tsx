'use client';

import { useState, useEffect, Suspense } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useSearchParams } from 'next/navigation';
import { FileText, Upload, CheckCircle, Clock, XCircle, Car, Wrench, Globe, Euro, Star } from 'lucide-react';

type ServiceType = 'sell' | 'registration' | 'import';

interface Service {
  id: ServiceType;
  title: string;
  description: string;
  price: string;
  features: string[];
  icon: React.ReactNode;
  color: string;
  badge?: string;
}

function RegistrationContent() {
  const [selectedService, setSelectedService] = useState<ServiceType>('registration');
  const [formData, setFormData] = useState({
    // Common fields
    serviceType: 'registration',
    sellerName: '',
    sellerEmail: '',
    sellerPhone: '',
    
    // Car information
    carBrand: '',
    carModel: '',
    carYear: new Date().getFullYear(),
    chassisNumber: '',
    plateNumber: '',
    mileage: '',
    fuelType: 'Essence',
    
    // Buyer information (for sell service)
    buyerName: '',
    buyerEmail: '',
    buyerPhone: '',
    proposedPrice: '',
    
    // Technical control
    lastTechnicalControl: '',
    technicalControlCenter: '',
    
    // Import information
    countryOfOrigin: '',
    importDate: '',
    customsDocument: '',
    
    // Common documents
    documents: [] as string[],
    additionalNotes: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const searchParams = useSearchParams();
  const carId = searchParams.get('carId');

  const services: Service[] = [
    {
      id: 'sell',
      title: 'VENDEZ VOTRE VOITURE',
      description: 'Service complet de vente avec évaluation et mise en avant',
      price: 'Commission 5%',
      features: [
        'Évaluation gratuite du véhicule',
        'Photos professionnelles',
        'Annonce optimisée',
        'Mise en relation avec acheteurs',
        'Support administratif'
      ],
      icon: <Car className="w-6 h-6" />,
      color: 'green',
      badge: 'Populaire'
    },
    {
      id: 'registration',
      title: 'Immatriculation Complète',
      description: 'Contrôle technique + immatriculation complète',
      price: '250 € TTC',
      features: [
        'Contrôle technique complet',
        'Timbre fiscale inclus',
        'Certificat d\'immatriculation',
        'Plaques d\'immatriculation',
        'Démarches administratives'
      ],
      icon: <Wrench className="w-6 h-6" />,
      color: 'blue'
    },
    {
      id: 'import',
      title: 'Véhicule Importé',
      description: 'Immatriculation véhicule importé complète',
      price: '350 € TTC',
      features: [
        'Contrôle technique complet',
        'Certificat de conformité + Agréation',
        'Timbre fiscale inclus',
        'Plaques posées',
        'Démarches douanières'
      ],
      icon: <Globe className="w-6 h-6" />,
      color: 'purple',
      badge: 'Expert'
    }
  ];

  const getServiceColor = (service: Service) => {
    const colors = {
      green: {
        bg: 'bg-green-50',
        border: 'border-green-500',
        text: 'text-green-600',
        light: 'bg-green-100',
        dark: 'bg-green-500'
      },
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-500',
        text: 'text-blue-600',
        light: 'bg-blue-100',
        dark: 'bg-blue-500'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-500',
        text: 'text-purple-600',
        light: 'bg-purple-100',
        dark: 'bg-purple-500'
      }
    };
    return colors[service.color as keyof typeof colors] || colors.blue;
  };

  const handleServiceSelect = (serviceId: ServiceType) => {
    setSelectedService(serviceId);
    setFormData(prev => ({ ...prev, serviceType: serviceId }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'carYear' || name === 'proposedPrice' || name === 'mileage' 
        ? parseInt(value) || value 
        : value 
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...files]);
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...files.map(f => f.name)]
      }));
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const getRequiredDocuments = () => {
    const baseDocs = [
      "Carte grise actuelle",
      "Pièce d'identité du propriétaire",
      "Justificatif de domicile"
    ];

    switch (selectedService) {
      case 'sell':
        return [...baseDocs, "Photos du véhicule", "Certificat de non-gage"];
      case 'registration':
        return [...baseDocs, "Contrôle technique", "Attestation d'assurance"];
      case 'import':
        return [...baseDocs, "Certificat de conformité", "Document douanier", "Facture d'achat"];
      default:
        return baseDocs;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        // Reset form
        setFormData({
          serviceType: 'registration',
          sellerName: '',
          sellerEmail: '',
          sellerPhone: '',
          carBrand: '',
          carModel: '',
          carYear: new Date().getFullYear(),
          chassisNumber: '',
          plateNumber: '',
          mileage: '',
          fuelType: 'Essence',
          buyerName: '',
          buyerEmail: '',
          buyerPhone: '',
          proposedPrice: '',
          lastTechnicalControl: '',
          technicalControlCenter: '',
          countryOfOrigin: '',
          importDate: '',
          customsDocument: '',
          documents: [],
          additionalNotes: '',
        });
        setUploadedFiles([]);
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError('Erreur lors de l\'enregistrement');
      }
    } catch (err) {
      setError('Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FileText className="w-10 h-10 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">Services AutoPlus</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choisissez le service qui correspond à vos besoins et laissez-nous gérer les démarches administratives pour vous.
            </p>
          </div>

          {/* Services Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {services.map((service) => {
              const color = getServiceColor(service);
              const isSelected = selectedService === service.id;
              
              return (
                <div
                  key={service.id}
                  className={`
                    relative rounded-2xl p-6 border-2 cursor-pointer transition-all duration-300 transform
                    ${isSelected 
                      ? `${color.border} ${color.bg} shadow-2xl scale-105 ring-4 ring-opacity-20 ${color.border.replace('border-', 'ring-')}` 
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
                    }
                    hover:scale-105
                  `}
                  onClick={() => handleServiceSelect(service.id)}
                >
                  {/* Badge */}
                  {service.badge && (
                    <div className={`absolute -top-2 left-4 ${color.dark} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                      {service.badge}
                    </div>
                  )}
                  
                  {/* Selected Indicator */}
                  {isSelected && (
                    <div className="absolute -top-2 -right-2">
                      <div className={`${color.dark} rounded-full p-1 shadow-lg`}>
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`w-12 h-12 ${color.light} rounded-xl flex items-center justify-center mb-4 ${isSelected ? 'scale-110' : ''} transition-transform duration-300`}>
                    <div className={color.text}>
                      {service.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className={`text-lg font-bold mb-2 ${isSelected ? 'text-gray-900' : 'text-gray-900'}`}>
                    {service.title}
                  </h3>
                  <p className={`text-sm mb-4 ${isSelected ? 'text-gray-700' : 'text-gray-600'}`}>
                    {service.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-2xl font-bold ${isSelected ? color.text : 'text-gray-900'}`}>
                      {service.price}
                    </span>
                    {!isSelected && (
                      <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? color.dark : 'bg-gray-400'}`} />
                        <span className={isSelected ? 'text-gray-700' : 'text-gray-600'}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Selected Gradient Overlay */}
                  {isSelected && (
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-white to-${color.bg.replace('bg-', '')} opacity-20 pointer-events-none`}></div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Selected Service Indicator */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg border border-gray-200">
              <div className={`w-3 h-3 rounded-full ${getServiceColor(services.find(s => s.id === selectedService)!).dark} animate-pulse`}></div>
              <span className="text-sm font-semibold text-gray-700">
                Service sélectionné : <span className={getServiceColor(services.find(s => s.id === selectedService)!).text}>
                  {services.find(s => s.id === selectedService)?.title}
                </span>
              </span>
            </div>
          </div>

          {/* Service Form */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-8 h-8 ${getServiceColor(services.find(s => s.id === selectedService)!).light} rounded-lg flex items-center justify-center`}>
                <div className={getServiceColor(services.find(s => s.id === selectedService)!).text}>
                  {services.find(s => s.id === selectedService)?.icon}
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {services.find(s => s.id === selectedService)?.title}
                </h2>
                <p className="text-gray-600">{services.find(s => s.id === selectedService)?.description}</p>
              </div>
            </div>

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl mb-6 flex gap-3">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Demande enregistrée avec succès !</p>
                  <p className="text-sm">Notre équipe vous contactera dans les 24 heures pour finaliser votre dossier.</p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 flex gap-3">
                <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Informations du vendeur */}
              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Informations personnelles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900">Nom complet *</label>
                    <input
                      type="text"
                      name="sellerName"
                      value={formData.sellerName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Votre nom complet"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900">Téléphone *</label>
                    <input
                      type="tel"
                      name="sellerPhone"
                      value={formData.sellerPhone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+216 XX XXX XXX"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2 text-gray-900">Email *</label>
                    <input
                      type="email"
                      name="sellerEmail"
                      value={formData.sellerEmail}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>
              </div>

              {/* Informations du véhicule */}
              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Informations du véhicule</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900">Marque *</label>
                    <input
                      type="text"
                      name="carBrand"
                      value={formData.carBrand}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Renault"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900">Modèle *</label>
                    <input
                      type="text"
                      name="carModel"
                      value={formData.carModel}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Clio"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900">Année *</label>
                    <input
                      type="number"
                      name="carYear"
                      value={formData.carYear}
                      onChange={handleChange}
                      required
                      min="1990"
                      max={new Date().getFullYear()}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900">Kilométrage *</label>
                    <input
                      type="number"
                      name="mileage"
                      value={formData.mileage}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: 75000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900">Numéro de châssis (VIN) *</label>
                    <input
                      type="text"
                      name="chassisNumber"
                      value={formData.chassisNumber}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="VIN"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900">Carburant *</label>
                    <select
                      name="fuelType"
                      value={formData.fuelType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Essence">Essence</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Hybride">Hybride</option>
                      <option value="Électrique">Électrique</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Service-specific fields */}
              {selectedService === 'sell' && (
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">Informations de vente</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-900">Prix proposé (DT) *</label>
                      <input
                        type="number"
                        name="proposedPrice"
                        value={formData.proposedPrice}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Prix de vente souhaité"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedService === 'registration' && (
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">Contrôle technique</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-900">Dernier contrôle technique</label>
                      <input
                        type="date"
                        name="lastTechnicalControl"
                        value={formData.lastTechnicalControl}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-900">Centre de contrôle</label>
                      <input
                        type="text"
                        name="technicalControlCenter"
                        value={formData.technicalControlCenter}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nom du centre"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedService === 'import' && (
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">Informations d'importation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-900">Pays d'origine *</label>
                      <input
                        type="text"
                        name="countryOfOrigin"
                        value={formData.countryOfOrigin}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: France"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-900">Date d'importation *</label>
                      <input
                        type="date"
                        name="importDate"
                        value={formData.importDate}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold mb-2 text-gray-900">Numéro de document douanier</label>
                      <input
                        type="text"
                        name="customsDocument"
                        value={formData.customsDocument}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Numéro du document douanier"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Documents requis */}
              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Documents requis</h3>
                <div className="bg-blue-50 rounded-xl p-4 mb-4">
                  <p className="font-semibold text-blue-900 mb-2">Documents nécessaires :</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-800">
                    {getRequiredDocuments().map((doc, index) => (
                      <li key={index} className="text-sm">{doc}</li>
                    ))}
                  </ul>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center mb-4">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <label className="cursor-pointer">
                    <p className="text-sm font-semibold text-gray-900 mb-1">Cliquez pour uploader vos documents</p>
                    <p className="text-xs text-gray-500 mb-3">PDF, JPG, PNG (max 10MB par fichier)</p>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    />
                  </label>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-900">Fichiers uploadés ({uploadedFiles.length}):</p>
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Supprimer
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes supplémentaires */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">Notes supplémentaires</label>
                <textarea
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Informations complémentaires sur votre demande..."
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800 text-center">
                  En soumettant ce formulaire, vous acceptez nos conditions générales. 
                  Notre équipe vous contactera dans les 24 heures pour finaliser votre dossier.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full ${getServiceColor(services.find(s => s.id === selectedService)!).dark} hover:opacity-90 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enregistrement en cours...
                  </div>
                ) : (
                  `Demander un devis - ${services.find(s => s.id === selectedService)?.price}`
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function RegistrationPage() {
  return (
    <Suspense fallback={
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </>
    }>
      <RegistrationContent />
    </Suspense>
  );
}