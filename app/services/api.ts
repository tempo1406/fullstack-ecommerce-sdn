import axios from 'axios';
import { getSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  },
  timeout: 15000,
  withCredentials: false,
});

api.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.user?.id) {
      config.headers['Authorization'] = `Bearer ${session.user.id}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/signin';
      }
    }
    return Promise.reject(error);
  }
);

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  stock?: number;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
  user?: {
    id: string;
    name?: string;
    email: string;
  };
}

export interface ProductFilter {
  categories: string[];
  inStock?: boolean;
  minStock?: number;
  sortBy: 'name' | 'price' | 'stock' | 'newest';
  sortOrder: 'asc' | 'desc';
}

export const ProductService = {
  async getAll(): Promise<Product[]> {
    try {
      const response = await api.get<Product[]>('/products');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async getById(id: string): Promise<Product> {
    try {
      const response = await api.get<Product>(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async create(product: Product): Promise<Product> {
    try {
      const response = await api.post<Product>('/products', product);
      if (!response.data || !response.data.id) {
      }
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  async update(id: string, product: Product): Promise<Product> {
    try {
      const response = await api.put<Product>(`/products/${id}`, product);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/products/${id}`);
    } catch (error) {
      throw error;
    }
  },
  
  async search(query: string): Promise<Product[]> {
    try {
      const response = await api.get<Product[]>(`/products?q=${query}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
