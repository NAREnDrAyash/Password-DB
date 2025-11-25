import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: number;
  username: string;
}

export interface VaultEntry {
  id: number;
  service_name: string;
  username: string;
  password: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface VaultEntryCreate {
  service_name: string;
  username: string;
  password: string;
  notes?: string;
}

export interface VaultEntryUpdate {
  password?: string;
  notes?: string;
}

class ApiService {
  // Authentication endpoints
  async register(userData: RegisterRequest): Promise<{ message: string }> {
    const response = await apiClient.post('/register', userData);
    return response.data;
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post('/login', credentials);
    const { token, user } = response.data;
    
    // Store token and user data
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/logout');
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }

  async checkUsername(username: string): Promise<{ available: boolean }> {
    const response = await apiClient.get(`/check-username/${username}`);
    return response.data;
  }

  // Vault entry endpoints
  async createVaultEntry(entry: VaultEntryCreate): Promise<{ message: string }> {
    const response = await apiClient.post('/vault/entries', entry);
    return response.data;
  }

  async getVaultEntries(): Promise<VaultEntry[]> {
    const response = await apiClient.get('/vault/entries');
    return response.data;
  }

  async getVaultEntryByService(serviceName: string): Promise<VaultEntry> {
    const response = await apiClient.get(`/vault/entries/${serviceName}`);
    return response.data;
  }

  async updateVaultEntry(entryId: number, entry: VaultEntryUpdate): Promise<{ message: string }> {
    const response = await apiClient.put(`/vault/entries/${entryId}`, entry);
    return response.data;
  }

  async deleteVaultEntry(entryId: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`/vault/entries/${entryId}`);
    return response.data;
  }

  async deleteAccount(password: string): Promise<{ message: string }> {
    const user = this.getCurrentUser();
    if (!user) throw new Error('No user logged in');
    
    const response = await apiClient.delete('/user/delete', {
      data: {
        username: user.username,
        password: password
      }
    });
    
    // Clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    return response.data;
  }

  // Utility methods
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

export const apiService = new ApiService();
export default apiService;
