export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  subcategory: string;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  liked?: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  links: {
    first: string;
    previous: string;
    next: string;
    last: string;
  };
}

export interface AuthResponse {
  accessToken: string;
}

export interface User {
  id: number;
  username: string;
}

export interface LoginFormData {
  username: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  password: string;
}

export interface CreateProductFormData {
  name: string;
  price: number;
  category: string;
  subcategory: string;
} 