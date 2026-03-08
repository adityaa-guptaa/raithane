import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiRequest, API_ENDPOINTS } from '../config/api';
import { useAuth } from './AuthContext';
import { useAuthModal } from './AuthModalContext';

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    images: Array<{ secure_url: string }>;
    stock: number;
  };
  quantity: number;
  price: number;
}

interface Cart {
  _id: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { openLogin } = useAuthModal();

  const refreshCart = async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }

    try {
      setLoading(true);
      const response = await apiRequest(API_ENDPOINTS.CART.GET);
      setCart(response.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [isAuthenticated]);

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!isAuthenticated) {
      openLogin();
      toast.error('Please login to add items to cart');
      throw new Error('Not authenticated');
    }
    try {
      const response = await apiRequest(API_ENDPOINTS.CART.ADD, {
        method: 'POST',
        body: JSON.stringify({ productId, quantity }),
      });
      setCart(response.data);
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add to cart');
      throw error;
    }
  };

  const updateCartItem = async (itemId: string, quantity: number) => {
    try {
      const response = await apiRequest(API_ENDPOINTS.CART.UPDATE(itemId), {
        method: 'PUT',
        body: JSON.stringify({ quantity }),
      });
      setCart(response.data);
    } catch (error) {
      console.error('Failed to update cart item:', error);
      throw error;
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const response = await apiRequest(API_ENDPOINTS.CART.REMOVE(itemId), {
        method: 'DELETE',
      });
      setCart(response.data);
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      const response = await apiRequest(API_ENDPOINTS.CART.CLEAR, {
        method: 'DELETE',
      });
      setCart(response.data);
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  };

  const isInCart = (productId: string): boolean => {
    if (!cart || !cart.items) return false;
    return cart.items.some(item => item.product._id === productId);
  };

  const value: CartContextType = {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
