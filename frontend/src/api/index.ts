import axios from 'axios';
import { 
  Product, 
  PaginatedResponse, 
  AuthResponse, 
  LoginFormData, 
  RegisterFormData,
  CreateProductFormData
} from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// include token at interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// auth
export const login = async (data: LoginFormData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
};

export const register = async (data: RegisterFormData) => {
  const response = await api.post<{ message: string }>('/auth/register', data);
  return response.data;
};

export const getProducts = async (page = 1, limit = 8) => {
  const response = await api.get(`/products?page=${page}&limit=${limit}`);
  return response.data;
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  const response = await api.get<Product[]>(`/products/search?q=${query}`);
  return response.data;
};

export const createProduct = async (data: CreateProductFormData): Promise<Product> => {
  try {
    const response = await api.post<Product>('/products', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const toggleLike = async (productId: number)=> {
  const response = await api.post(`/products/${productId}/like`);
  return response.data;
}; 