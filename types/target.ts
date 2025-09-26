// Shared Target type definition for the entire application
export interface Target {
  _id: string;
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  heroImage: string;
  thumbnailImage?: string;
  location: string;
  rating: number;
  country: string;
  whatsIncluded?: string[];
  updatedAt?: string;
}

// Extended Target type for detail pages that need additional fields
export interface ExtendedTarget extends Target {
  amenities: string[];
  duration: string;
  updatedAt: string; // Make this required for ExtendedTarget
}

// For components that need a more minimal Target type
export interface MinimalTarget {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  location: string;
  rating: number;
}
