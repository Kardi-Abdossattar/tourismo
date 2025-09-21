const API_BASE_URL = 'http://localhost:5000/api';

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('token');
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  
  return response.json();
};

// Target API calls
export const getTargets = (filters?: {
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
  if (!filters) {
    return apiRequest('/targets');
  }
  
  const params = new URLSearchParams();
  
  if (filters.search) params.append('search', filters.search);
  if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
  if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
  if (filters.minRating !== undefined) params.append('minRating', filters.minRating.toString());
  if (filters.maxRating !== undefined) params.append('maxRating', filters.maxRating.toString());
  if (filters.countries && filters.countries.length > 0) {
    filters.countries.forEach(country => params.append('countries', country));
  }
  if (filters.featured !== null && filters.featured !== undefined) {
    params.append('featured', filters.featured.toString());
  }
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  
  const queryString = params.toString();
  return apiRequest(`/targets${queryString ? `?${queryString}` : ''}`);
};
export const getTarget = (id: string) => apiRequest(`/targets/${id}`);
export const createTarget = (data: any) => apiRequest('/targets', {
  method: 'POST',
  body: JSON.stringify(data),
});
export const updateTarget = (id: string, data: any) => apiRequest(`/targets/${id}`, {
  method: 'PUT',
  body: JSON.stringify(data),
});
export const deleteTarget = (id: string) => apiRequest(`/targets/${id}`, {
  method: 'DELETE',
});

// Booking API calls
export const createBooking = (data: any) => apiRequest('/bookings', {
  method: 'POST',
  body: JSON.stringify(data),
});

// Auth API calls
export const login = (credentials: { username: string; password: string }) =>
  apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

// Pages API calls
export const getPage = (slug: 'about' | 'contact') => apiRequest(`/pages/${slug}`);
export const updatePage = (
  slug: 'about' | 'contact',
  data: { title: string; content: string }
) => apiRequest(`/pages/${slug}`, {
  method: 'PUT',
  body: JSON.stringify(data),
});

// Payment API calls
export const createPayment = (payload: { bookingId: number; amountEth: string }) =>
  apiRequest('/payment/create', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const getPaymentStatus = (bookingId: number) =>
  apiRequest(`/payment/status/${bookingId}`);