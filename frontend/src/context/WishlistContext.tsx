import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiRequest, API_ENDPOINTS } from '../config/api';
import { useAuth } from './AuthContext';
import { useAuthModal } from './AuthModalContext';

interface WishlistItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    images?: Array<{ secure_url: string }>;
    stock: number;
    isActive: boolean;
  };
  addedAt: string;
}

interface Wishlist {
  _id: string;
  user: string;
  items: WishlistItem[];
  totalItems: number;
}

interface WishlistContextType {
  wishlist: Wishlist | null;
  loading: boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { openLogin } = useAuthModal();

  // Fetch wishlist on mount and when auth changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlist(null);
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await apiRequest(API_ENDPOINTS.WISHLIST.GET);
      setWishlist(response.data);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId: string) => {
    if (!isAuthenticated) {
      openLogin();
      toast.error('Please login to add items to wishlist');
      throw new Error('Not authenticated');
    }
    try {
      const response = await apiRequest(API_ENDPOINTS.WISHLIST.ADD, {
        method: 'POST',
        body: JSON.stringify({ productId }),
      });
      setWishlist(response.data);
      toast.success('Added to wishlist!');
    } catch (error: any) {
      toast.error('Failed to add to wishlist');
      throw new Error(error.message || 'Failed to add to wishlist');
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const response = await apiRequest(API_ENDPOINTS.WISHLIST.REMOVE(productId), {
        method: 'DELETE',
      });
      setWishlist(response.data);
      toast.success('Removed from wishlist');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to remove from wishlist');
    }
  };

  const clearWishlist = async () => {
    try {
      const response = await apiRequest(API_ENDPOINTS.WISHLIST.CLEAR, {
        method: 'DELETE',
      });
      setWishlist(response.data);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to clear wishlist');
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlist?.items?.some((item) => item.product._id === productId) || false;
  };

  const value: WishlistContextType = {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
