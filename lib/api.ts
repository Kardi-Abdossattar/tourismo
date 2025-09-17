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
export const getTargets = () => apiRequest('/targets');
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