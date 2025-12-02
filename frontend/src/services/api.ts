const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('wealthwise_token');
};

// Set auth token in localStorage
export const setAuthToken = (token: string): void => {
  localStorage.setItem('wealthwise_token', token);
};

// Remove auth token from localStorage
export const removeAuthToken = (): void => {
  localStorage.removeItem('wealthwise_token');
};

// Base fetch wrapper with auth
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'An error occurred' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Auth API
export const authAPI = {
  register: async (data: { name: string; email: string; password: string }) => {
    const response = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (response.token) {
      setAuthToken(response.token);
    }
    return response;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (response.token) {
      setAuthToken(response.token);
    }
    return response;
  },

  getCurrentUser: async () => {
    return apiFetch('/auth/me');
  },

  updateProfile: async (data: any) => {
    return apiFetch('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  logout: () => {
    removeAuthToken();
  },
};

// Portfolio API
export const portfolioAPI = {
  get: async () => {
    return apiFetch('/portfolio');
  },

  update: async (data: any) => {
    return apiFetch('/portfolio', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// Budget API
export const budgetAPI = {
  getAll: async () => {
    return apiFetch('/budget');
  },

  getCurrent: async () => {
    return apiFetch('/budget/current');
  },

  upsert: async (data: any) => {
    return apiFetch('/budget', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  delete: async (month: number, year: number) => {
    return apiFetch(`/budget/${month}/${year}`, {
      method: 'DELETE',
    });
  },
};

// Retirement API
export const retirementAPI = {
  getAll: async () => {
    return apiFetch('/retirement');
  },

  create: async (data: any) => {
    return apiFetch('/retirement', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return apiFetch(`/retirement/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiFetch(`/retirement/${id}`, {
      method: 'DELETE',
    });
  },
};
