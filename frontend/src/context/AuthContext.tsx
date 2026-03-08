import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest, API_ENDPOINTS } from '../config/api';
import toast from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'delivery';
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isLoggingOut: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateUser: (userData: any) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isDelivery: boolean;
  isCustomer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await apiRequest(API_ENDPOINTS.AUTH.ME);
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    const response = await apiRequest(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const { token: newToken, user: userData } = response.data;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    
    // Show success toast with role-specific message
    const roleMessage = userData.role === 'delivery' ? 'Delivery Portal' : 
                       userData.role === 'admin' ? 'Admin Panel' : 'your account';
    toast.success(`Welcome back to ${roleMessage}, ${userData.name}!`, {
      duration: 3000,
      position: 'top-right',
    });
  };

  const register = async (userData: any) => {
    const response = await apiRequest(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    const { token: newToken, user: newUser } = response.data;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(newUser);
    
    // Show success toast
    toast.success(`Account created successfully! Welcome, ${newUser.name}!`, {
      duration: 3000,
      position: 'top-right',
    });
  };

  const logout = () => {
    const userName = user?.name;
    setIsLoggingOut(true);
    
    // Small delay to show the loading overlay
    setTimeout(() => {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setIsLoggingOut(false);
      
      // Show success toast
      toast.success(`Goodbye, ${userName}! You've been logged out.`, {
        duration: 3000,
        position: 'top-right',
      });
    }, 800);
  };

  const updateUser = async (userData: any) => {
    const response = await apiRequest(API_ENDPOINTS.AUTH.UPDATE_PROFILE, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });

    setUser(response.data);
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    isLoggingOut,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isDelivery: user?.role === 'delivery',
    isCustomer: user?.role === 'user',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
