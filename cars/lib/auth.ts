// Simple authentication simulation
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'seller' | 'user';
  createdAt: string;
}

let users: User[] = [
  {
    id: '1',
    email: 'admin@autoplus.com',
    password: 'admin123', // Demo only - never do this in production!
    name: 'Admin',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'seller@example.com',
    password: 'seller123',
    name: 'Seller',
    role: 'seller',
    createdAt: new Date().toISOString(),
  },
];

export const authDB = {
  getUserByEmail: (email: string) => users.find(u => u.email === email),
  registerUser: (email: string, password: string, name: string) => {
    if (users.find(u => u.email === email)) {
      throw new Error('Email already exists');
    }
    const newUser: User = {
      id: Date.now().toString(),
      email,
      password,
      name,
      role: 'user',
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    return newUser;
  },
  validateUser: (email: string, password: string) => {
    const user = users.find(u => u.email === email && u.password === password);
    return user || null;
  },
};
