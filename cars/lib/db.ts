// Database simulation with in-memory storage
export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  condition: string;
  description: string;
  images: string[];
  seller: {
    name: string;
    phone: string;
    email: string;
  };
  createdAt: string;
  status: 'active' | 'sold' | 'pending';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface RegistrationRequest {
  id: string;
  sellerName: string;
  carBrand: string;
  carModel: string;
  carYear: number;
  chassisNumber: string;
  plateNumber: string;
  buyerName: string;
  sellerEmail: string;
  buyerEmail: string;
  status: 'pending' | 'completed' | 'rejected';
  createdAt: string;
}

// In-memory database
let cars: Car[] = [
  {
    id: '1',
    brand: 'Renault',
    model: 'Clio',
    year: 2020,
    price: 14500,
    mileage: 45000,
    fuelType: 'Essence',
    transmission: 'Manuelle',
    condition: 'Excellent',
    description: 'Clio en très bon état, bien entretenue, révisions à jour.',
    images: ['/renault-clio-2020.jpg'],
    seller: { name: 'Ahmed Ben Ali', phone: '+216 98 123 456', email: 'ahmed@example.com' },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
  },
  {
    id: '2',
    brand: 'Peugeot',
    model: '308',
    year: 2019,
    price: 16800,
    mileage: 62000,
    fuelType: 'Diesel',
    transmission: 'Automatique',
    condition: 'Bon',
    description: 'Peugeot 308 climatisée, vitrage teinté, direction assistée.',
    images: ['/peugeot-308-2019.jpg'],
    seller: { name: 'Fatima Kammoun', phone: '+216 98 234 567', email: 'fatima@example.com' },
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
  },
  {
    id: '3',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2018,
    price: 13500,
    mileage: 78000,
    fuelType: 'Essence',
    transmission: 'Manuelle',
    condition: 'Bon',
    description: 'Toyota fiable et économique, idéale pour la ville et les longs trajets.',
    images: ['/toyota-corolla-2018.jpg'],
    seller: { name: 'Mohamed Salah', phone: '+216 98 345 678', email: 'mohamed@example.com' },
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
  },
];

let messages: ContactMessage[] = [];
let registrations: RegistrationRequest[] = [];

export const db = {
  // Cars
  getCars: () => cars,
  getCarById: (id: string) => cars.find(car => car.id === id),
  searchCars: (query: string) => cars.filter(car => 
    car.brand.toLowerCase().includes(query.toLowerCase()) ||
    car.model.toLowerCase().includes(query.toLowerCase())
  ),
  filterCars: (filters: any) => {
    return cars.filter(car => {
      if (filters.brand && car.brand !== filters.brand) return false;
      if (filters.minPrice && car.price < filters.minPrice) return false;
      if (filters.maxPrice && car.price > filters.maxPrice) return false;
      if (filters.minYear && car.year < filters.minYear) return false;
      if (filters.maxYear && car.year > filters.maxYear) return false;
      if (filters.fuelType && car.fuelType !== filters.fuelType) return false;
      if (filters.transmission && car.transmission !== filters.transmission) return false;
      return true;
    });
  },
  addCar: (car: Omit<Car, 'id' | 'createdAt'>) => {
    const newCar: Car = {
      ...car,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    cars.push(newCar);
    return newCar;
  },
  updateCar: (id: string, updates: Partial<Car>) => {
    const index = cars.findIndex(car => car.id === id);
    if (index !== -1) {
      cars[index] = { ...cars[index], ...updates };
      return cars[index];
    }
    return null;
  },
  deleteCar: (id: string) => {
    cars = cars.filter(car => car.id !== id);
  },

  // Messages
  getMessages: () => messages,
  addMessage: (msg: Omit<ContactMessage, 'id' | 'createdAt'>) => {
    const newMsg: ContactMessage = {
      ...msg,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    messages.push(newMsg);
    return newMsg;
  },

  // Registrations
  getRegistrations: () => registrations,
  addRegistration: (reg: Omit<RegistrationRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReg: RegistrationRequest = {
      ...reg,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    registrations.push(newReg);
    return newReg;
  },
  updateRegistration: (id: string, status: 'completed' | 'rejected') => {
    const reg = registrations.find(r => r.id === id);
    if (reg) {
      reg.status = status;
    }
    return reg;
  },
};
