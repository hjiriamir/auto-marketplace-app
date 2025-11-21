'use client';

import Link from 'next/link';
import { Car, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Shield, Award, Clock, Music2  } from 'lucide-react';
import Image from 'next/image';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 512 512"
      fill="currentColor"
      {...props}
    >
      <path d="M412.19,127.3a109.65,109.65,0,0,1-61.15-31.91A111.71,111.71,0,0,1,332.06,0H260.68V339.66a46.61,46.61,0,1,1-33-44.4V220.66a124.23,124.23,0,1,0,157.5,118V193.6a188.59,188.59,0,0,0,98.19,29.08V150.26A109.59,109.59,0,0,1,412.19,127.3Z"/>
    </svg>
  );
  


  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      {/* Section principale */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-12 mb-12">
          
          {/* Logo et description */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Image
                  src="/car2.png"
                  alt="AutoPlus Logo"
                  width={120}
                  height={120}
                  className="object-contain group-hover:opacity-90 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-blue-500/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </Link>
            
            <p className="text-gray-300 text-lg leading-relaxed max-w-md">
              Votre partenaire de confiance pour l'achat et la vente de véhicules d'occasion en Tunisie. 
              Qualité, transparence et service personnalisé.
            </p>
            
            {/* Statistiques */}
            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-gray-800">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">500+</div>
                <div className="text-xs text-gray-400">Véhicules</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">95%</div>
                <div className="text-xs text-gray-400">Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">24/7</div>
                <div className="text-xs text-gray-400">Support</div>
              </div>
            </div>
          </div>

          {/* Navigation rapide */}
          <div className="lg:col-span-1">
            <h4 className="font-bold text-white text-lg mb-6 relative inline-block">
              Navigation
              <div className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-blue-500"></div>
            </h4>
            <ul className="space-y-4 text-sm">
              {[
                { href: '/', label: 'Accueil' },
                { href: '/catalog', label: 'Catalogue véhicules' },
                { href: '/contact', label: 'Contactez-nous' },
                { href: '/seller', label: 'Vendre mon véhicule' },
              ].map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href} 
                    className="text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-2 group"
                  >
                    <div className="w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-1">
            <h4 className="font-bold text-white text-lg mb-6 relative inline-block">
              Services
              <div className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-green-500"></div>
            </h4>
            <ul className="space-y-4 text-sm">
              {[
                { href: '/registration', label: 'Immatriculation', icon: Shield },
                { href: '/financing', label: 'Financement', icon: Award },
                { href: '/inspection', label: 'Inspection', icon: Award },
                { href: '/delivery', label: 'Livraison', icon: Clock },
              ].map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href} 
                    className="text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-2 group"
                  >
                    <item.icon className="w-4 h-4 text-green-400" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-white text-lg mb-6 relative inline-block">
              Contact
              <div className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-purple-500"></div>
            </h4>
            
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-4 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-all duration-300">
                <Phone className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Téléphone</p>
                  <p className="text-gray-300">+216 71 123 456</p>
                  <p className="text-gray-400 text-xs">Lun - Ven: 8h - 18h</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-all duration-300">
                <Mail className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Email</p>
                  <p className="text-gray-300">info@autoplus.tn</p>
                  <p className="text-gray-400 text-xs">Réponse sous 24h</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-all duration-300">
                <MapPin className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Adresse</p>
                  <p className="text-gray-300">Centre Urbain Nord, Tunis</p>
                  <p className="text-gray-400 text-xs">Tunisie</p>
                </div>
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div className="flex gap-4 mt-6 pt-6 border-t border-gray-800">
  {[
    { icon: Facebook, href: '#', color: 'hover:text-blue-400', name: 'facebook' },
    { icon: Instagram, href: '#', color: 'hover:text-pink-400', name: 'instagram' },
    { icon: TikTokIcon, href: '#', color: 'hover:text-purple-400', name: 'tiktok' },
  ].map((social) => (
    <Link
      key={social.name} // ← Utilisez le nom explicite ici
      href={social.href}
      className={`p-2 bg-gray-800 rounded-lg text-gray-400 ${social.color} transition-all duration-300 hover:bg-gray-700 hover:scale-110`}
    >
      <social.icon className="w-5 h-5" />
    </Link>
  ))}
</div>
          </div>
        </div>

        {/* Section basse */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <div className="text-center lg:text-left">
              <p className="text-gray-400 text-sm">
                &copy; {currentYear} <span className="text-white font-semibold">DRIVEWORTH</span>. Tous droits réservés.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Votre confiance, notre engagement.
              </p>
            </div>

            {/* Liens légaux */}
            <div className="flex flex-wrap gap-6 text-sm justify-center">
              {[
                { href: '/privacy', label: 'Confidentialité' },
                { href: '/terms', label: 'Conditions' },
                { href: '/cookies', label: 'Cookies' },
                { href: '/legal', label: 'Mentions légales' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-xs"
                >
                  {item.label}
                </Link>
              ))}
            </div>

           
          </div>
        </div>
      </div>

      {/* Bandeau de garanties */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap justify-center gap-8 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-400" />
              <span>Véhicules vérifiés</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span>Garantie 3 mois</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>Support 24h/24</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}