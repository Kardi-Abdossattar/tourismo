// Static API service for demo version
// This replaces backend API calls with local JSON data processing

// Import JSON data - we'll load it dynamically to avoid build issues
const loadTargetsData = async () => {
  try {
    const response = await fetch('/data/tourismo.targets.json');
    return await response.json();
  } catch (error) {
    console.error('Failed to load targets data:', error);
    return [];
  }
};

// Define types for our data
interface MongoTarget {
  _id?: { $oid: string } | string;
  title: string;
  description: string;
  price: number;
  image: string;
  heroImage?: string;
  thumbnailImage?: string;
  smallImage?: string;
  location: string;
  rating: number;
  country: string;
  whatsIncluded?: string[];
  updatedAt?: { $date: string } | string;
}

interface Target {
  _id: string;
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  heroImage: string;
  thumbnailImage: string;
  location: string;
  rating: number;
  country: string;
  whatsIncluded: string[];
  updatedAt: string;
}

// Transform MongoDB-style data to clean format
const transformTarget = (target: MongoTarget): Target => {
  const id = target._id && typeof target._id === 'object' ? target._id.$oid : (target._id as string) || Math.random().toString(36).substr(2, 9);
  return {
    _id: id,
    id: id,
    title: target.title,
    description: target.description,
    price: target.price,
    image: target.image,
    heroImage: target.heroImage || target.image,
    thumbnailImage: target.thumbnailImage || target.smallImage || target.image,
    location: target.location,
    rating: target.rating,
    country: target.country,
    whatsIncluded: target.whatsIncluded || [],
    updatedAt: target.updatedAt && typeof target.updatedAt === 'object' ? target.updatedAt.$date : (target.updatedAt as string) || new Date().toISOString(),
  };
};

// Get all targets with filtering and sorting
export const getTargets = async (filters?: {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  maxRating?: number;
  countries?: string[];
  featured?: boolean | null;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const targetsData: MongoTarget[] = await loadTargetsData();
  let targets = targetsData.map(transformTarget);
  
  // Apply filters
  if (filters) {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      targets = targets.filter(target => 
        target.title.toLowerCase().includes(searchLower) ||
        target.description.toLowerCase().includes(searchLower) ||
        target.location.toLowerCase().includes(searchLower) ||
        target.country.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.minPrice !== undefined) {
      targets = targets.filter(target => target.price >= filters.minPrice!);
    }
    
    if (filters.maxPrice !== undefined) {
      targets = targets.filter(target => target.price <= filters.maxPrice!);
    }
    
    if (filters.minRating !== undefined) {
      targets = targets.filter(target => target.rating >= filters.minRating!);
    }
    
    if (filters.maxRating !== undefined) {
      targets = targets.filter(target => target.rating <= filters.maxRating!);
    }
    
    if (filters.countries && filters.countries.length > 0) {
      targets = targets.filter(target => filters.countries!.includes(target.country));
    }
    
    // Sort targets
    if (filters.sortBy) {
      targets.sort((a, b) => {
        let aValue = a[filters.sortBy as keyof typeof a];
        let bValue = b[filters.sortBy as keyof typeof b];
        
        // Handle string comparison
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (filters.sortOrder === 'desc') {
          return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        } else {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        }
      });
    }
    
    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 9;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedTargets = targets.slice(startIndex, endIndex);
    
    return {
      targets: paginatedTargets,
      total: targets.length,
      page,
      totalPages: Math.ceil(targets.length / limit),
      hasNextPage: endIndex < targets.length,
      hasPrevPage: page > 1,
    };
  }
  
  return {
    targets,
    total: targets.length,
    page: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };
};

// Get single target by ID
export const getTarget = async (id: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const targetsData: MongoTarget[] = await loadTargetsData();
  const target = targetsData.find((t: MongoTarget) => {
    const targetId = t._id && typeof t._id === 'object' ? t._id.$oid : t._id;
    return targetId === id;
  });
  
  if (!target) {
    throw new Error('Target not found');
  }
  
  return transformTarget(target);
};

// Get unique countries for filter dropdown
export const getCountries = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const targetsData: MongoTarget[] = await loadTargetsData();
  const countries = Array.from(new Set(targetsData.map((target: MongoTarget) => target.country))).sort();
  return countries;
};

// Demo functions for admin (these will show popups)
export const createTarget = async (data: any) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  throw new Error('DEMO_MODE: This is a static demo. Creating new destinations is not available in demo mode.');
};

export const updateTarget = async (id: string, data: any) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  throw new Error('DEMO_MODE: This is a static demo. Editing destinations is not available in demo mode.');
};

export const deleteTarget = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  throw new Error('DEMO_MODE: This is a static demo. Deleting destinations is not available in demo mode.');
};

// Demo booking function
export const createBooking = async (data: any) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  throw new Error('DEMO_MODE: This is a static demo. Booking functionality is not available in demo mode. This would normally process your reservation and payment.');
};

// Demo auth function
export const login = async (credentials: { username: string; password: string }) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Demo credentials
  if (credentials.username === 'admin' && credentials.password === 'Admin123!') {
    return {
      token: 'demo-token-' + Date.now(),
      user: { username: 'admin', role: 'admin' }
    };
  }
  
  throw new Error('Invalid credentials. Demo credentials: admin / Admin123!');
};

// Demo page functions
export const getPage = async (slug: 'about' | 'contact') => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const pages = {
    about: {
      title: 'About Tourismo',
      content: 'Welcome to Tourismo - your gateway to the world\'s most incredible destinations. This is a static demo showcasing our beautiful travel platform.'
    },
    contact: {
      title: 'Contact Us',
      content: 'This is a static demo version. In the full version, you would be able to contact us through various channels including email, phone, and live chat.'
    }
  };
  
  return pages[slug];
};

export const updatePage = async (slug: 'about' | 'contact', data: { title: string; content: string }) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  throw new Error('DEMO_MODE: This is a static demo. Page editing is not available in demo mode.');
};

// Demo payment functions
export const createPayment = async (payload: { bookingId: number; amountEth: string }) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  throw new Error('DEMO_MODE: This is a static demo. Blockchain payments are not available in demo mode. This would normally process ETH payments via smart contract.');
};

export const getPaymentStatus = async (bookingId: number) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    bookingId,
    status: 'demo',
    message: 'This is a static demo - payment status checking is not available.'
  };
};

// Helper function to show demo popup
export const showDemoPopup = (feature: string) => {
  const message = `🚀 Demo Mode\n\nThis is a static demonstration of Tourismo.\n\n"${feature}" is not available in demo mode.\n\nIn the full version, this feature would be fully functional with backend integration, database storage, and real-time processing.`;
  
  if (typeof window !== 'undefined') {
    alert(message);
  }
  
  return Promise.reject(new Error(`DEMO_MODE: ${feature} not available in demo mode.`));
};
