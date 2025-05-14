import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api';
import { LoginFormData, RegisterFormData, User } from '../types';

interface AuthContextType {
  user: any;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          
        } catch (error) {
          console.error(`Auth error: ${error}`);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.login(data);
      localStorage.setItem('token', response.accessToken);
      
      const user = {
        username: data.username
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      navigate('/');
    } catch (error) {
      setError(`Failed to login: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await api.register(data);
      navigate('/login');
    } catch {
      setError('Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        error,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('Should be used within AuthProvider');
  }
  return context;
}; 