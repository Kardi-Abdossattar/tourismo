export interface Target {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  heroImage?: string;
  smallImage?: string;
  location: string;
  rating: number;
  amenities?: string[];
  duration?: string;
  whatsIncluded?: string[];
  reviews?: number;
  category?: string;
  featured?: boolean;
  gallery?: string[];
  country?: string;
  createdAt?: string;
}

export interface Booking {
  _id: string;
  targetId: string;
  email: string;
  walletAddress: string;
  txHash: string;
  amount: number;
  date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface User {
  _id: string;
  username: string;
  role: 'admin' | 'user';
}