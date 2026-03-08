/**
 * API Configuration
 * Base URL and endpoint configurations
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
    UPDATE_PROFILE: '/auth/update-profile',
    UPDATE_PASSWORD: '/auth/update-password',
  },
  
  // Products
  PRODUCTS: {
    LIST: '/products',
    GET_ALL: '/products',
    GET_ONE: (id: string) => `/products/${id}`,
    GET_PRODUCT: (id: string) => `/products/${id}`,
    FEATURED: '/products/featured',
    NEW_ARRIVALS: '/products/new-arrivals',
    RELATED: (id: string) => `/products/related/${id}`,
  },
  
  // Categories
  CATEGORIES: {
    LIST: '/categories',
    GET_ALL: '/categories',
    GET_ONE: (id: string) => `/categories/${id}`,
  },
  
  // Cart
  CART: {
    GET: '/cart',
    ADD: '/cart/add',
    UPDATE: (itemId: string) => `/cart/update/${itemId}`,
    REMOVE: (itemId: string) => `/cart/remove/${itemId}`,
    CLEAR: '/cart/clear',
  },
  
  // Wishlist
  WISHLIST: {
    GET: '/wishlist',
    ADD: '/wishlist/add',
    REMOVE: (productId: string) => `/wishlist/remove/${productId}`,
    CLEAR: '/wishlist/clear',
  },
  
  // Orders
  ORDERS: {
    CREATE: '/orders',
    GET_USER_ORDERS: '/orders',
    MY_ORDERS: '/orders',
    GET_ONE: (id: string) => `/orders/${id}`,
    GET_ORDER: (id: string) => `/orders/${id}`,
    CANCEL: (id: string) => `/orders/${id}/cancel`,
    CANCEL_ORDER: (id: string) => `/orders/${id}/cancel`,
  },
  
  // Admin
  ADMIN: {
    // Products
    PRODUCTS: '/admin/products',
    GET_ALL_PRODUCTS: '/admin/products',
    CREATE_PRODUCT: '/admin/products',
    PRODUCT: (id: string) => `/admin/products/${id}`,
    UPDATE_PRODUCT: (id: string) => `/admin/products/${id}`,
    DELETE_PRODUCT: (id: string) => `/admin/products/${id}`,
    PRODUCT_IMAGES: (id: string) => `/admin/products/${id}/images`,
    PRODUCT_IMAGE: (id: string, imageId: string) => `/admin/products/${id}/images/${imageId}`,
    TOGGLE_PRODUCT: (id: string) => `/admin/products/${id}/toggle-status`,
    
    // Categories
    CATEGORIES: '/admin/categories',
    CATEGORY: (id: string) => `/admin/categories/${id}`,
    CATEGORY_IMAGE: (id: string) => `/admin/categories/${id}/image`,
    TOGGLE_CATEGORY: (id: string) => `/admin/categories/${id}/toggle-status`,
    
    // Orders
    ORDERS: '/admin/orders',
    GET_ALL_ORDERS: '/admin/orders',
    ORDER: (id: string) => `/admin/orders/${id}`,
    GET_ORDER: (id: string) => `/admin/orders/${id}`,
    ORDER_STATUS: (id: string) => `/admin/orders/${id}/status`,
    UPDATE_ORDER_STATUS: (id: string) => `/admin/orders/${id}/status`,
    ASSIGN_DELIVERY: (id: string) => `/admin/orders/${id}/assign-delivery`,
    
    // Users
    GET_DELIVERY_PERSONS: '/admin/users/delivery-persons',
    GET_CUSTOMERS: '/admin/customers',
    
    // Delivery Persons Management
    DELIVERY_PERSONS: '/admin/delivery-persons',
    CREATE_DELIVERY_PERSON: '/admin/delivery-persons',
    TOGGLE_DELIVERY_STATUS: (id: string) => `/admin/delivery-persons/${id}/toggle-status`,
    
    // Statistics
    STATISTICS: '/admin/statistics',
    DASHBOARD_STATS: '/admin/dashboard-stats',
  },
  
  // Delivery
  DELIVERY: {
    ORDERS: '/delivery/orders',
    MY_DELIVERIES: '/delivery/my-deliveries',
    ORDER: (id: string) => `/delivery/orders/${id}`,
    GET_DELIVERY: (id: string) => `/delivery/my-deliveries/${id}`,
    ORDER_STATUS: (id: string) => `/delivery/orders/${id}/status`,
    UPDATE_STATUS: (id: string) => `/delivery/my-deliveries/${id}/status`,
    STATISTICS: '/delivery/statistics',
  },
};

/**
 * API Helper Function
 */
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
};
