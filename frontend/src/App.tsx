import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthModalProvider, useAuthModal } from './context/AuthModalContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import FooterSection from './components/FooterSection';
import AuthModal from './components/AuthModal';
import LoadingOverlay from './components/LoadingOverlay';

// Auth Pages
import RegisterPage from './pages/RegisterPage';

// User Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import WeeklyOffersPage from './pages/WeeklyOffersPage';
import QualityProductsPage from './pages/QualityProductsPage';
import AlmostFinishedPage from './pages/AlmostFinishedPage';
import MoneySavingPage from './pages/MoneySavingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminProductFormPage from './pages/admin/AdminProductFormPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminCategoryFormPage from './pages/admin/AdminCategoryFormPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminOrderDetailPage from './pages/admin/AdminOrderDetailPage';
import AdminCustomersPage from './pages/admin/AdminCustomersPage';
import AdminDeliveryPersonsPage from './pages/admin/AdminDeliveryPersonsPage';

// Delivery Pages
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';
import DeliveryOrdersPage from './pages/delivery/DeliveryOrdersPage';
import DeliveryOrderDetailPage from './pages/delivery/DeliveryOrderDetailPage';

function AppContent() {
  const { isDelivery, isAdmin, isLoggingOut } = useAuth();
  const { isOpen, mode, closeModal } = useAuthModal();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Logout Loading Overlay */}
      {isLoggingOut && <LoadingOverlay message="Logging out..." />}
      
      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#333',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      {/* Show Navbar for all users (simplified for delivery) */}
      <Navbar />
      
      {/* Global Auth Modal */}
      <AuthModal isOpen={isOpen} onClose={closeModal} initialMode={mode} />
      
      <Routes>
        {/* Public Routes - Role-based redirects */}
        <Route 
          path="/" 
          element={
            isAdmin ? <Navigate to="/admin" replace /> :
            isDelivery ? <Navigate to="/delivery" replace /> : 
            <HomePage />
          } 
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products" element={isDelivery ? <Navigate to="/delivery" replace /> : <ProductsPage />} />
        <Route path="/products/:id" element={isDelivery ? <Navigate to="/delivery" replace /> : <ProductDetailPage />} />
        <Route path="/weekly-offers" element={isDelivery ? <Navigate to="/delivery" replace /> : <WeeklyOffersPage />} />
        <Route path="/quality-products" element={isDelivery ? <Navigate to="/delivery" replace /> : <QualityProductsPage />} />
        <Route path="/almost-finished" element={isDelivery ? <Navigate to="/delivery" replace /> : <AlmostFinishedPage />} />
        <Route path="/save-money" element={isDelivery ? <Navigate to="/delivery" replace /> : <MoneySavingPage />} />
        <Route path="/about" element={isDelivery ? <Navigate to="/delivery" replace /> : <AboutPage />} />
        <Route path="/contact" element={isDelivery ? <Navigate to="/delivery" replace /> : <ContactPage />} />
        <Route path="/blog" element={isDelivery ? <Navigate to="/delivery" replace /> : <BlogPage />} />

        {/* Customer Routes - Not accessible to delivery users */}
        <Route
          path="/cart"
          element={
            isDelivery ? (
              <Navigate to="/delivery" replace />
            ) : (
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            )
          }
        />
        <Route
          path="/checkout"
          element={
            isDelivery ? (
              <Navigate to="/delivery" replace />
            ) : (
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            )
          }
        />
        <Route
          path="/wishlist"
          element={
            isDelivery ? (
              <Navigate to="/delivery" replace />
            ) : (
              <ProtectedRoute>
                <WishlistPage />
              </ProtectedRoute>
            )
          }
        />
        <Route
          path="/orders"
          element={
            isDelivery ? (
              <Navigate to="/delivery" replace />
            ) : (
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            )
          }
        />
        <Route
          path="/orders/:id"
          element={
            isDelivery ? (
              <Navigate to="/delivery" replace />
            ) : (
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            )
          }
        />
        <Route
          path="/order-success"
          element={
            isDelivery ? (
              <Navigate to="/delivery" replace />
            ) : (
              <ProtectedRoute>
                <OrderSuccessPage />
              </ProtectedRoute>
            )
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products/:id"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminProductFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminCategoriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories/:id"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminCategoryFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders/:id"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminOrderDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminCustomersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/delivery-persons"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDeliveryPersonsPage />
            </ProtectedRoute>
          }
        />

        {/* Delivery Routes */}
        <Route
          path="/delivery"
          element={
            <ProtectedRoute requiredRole="delivery">
              <DeliveryDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/delivery/orders"
          element={
            <ProtectedRoute requiredRole="delivery">
              <DeliveryOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/delivery/orders/:id"
          element={
            <ProtectedRoute requiredRole="delivery">
              <DeliveryOrderDetailPage />
            </ProtectedRoute>
          }
        />

        {/* 404 - Redirect delivery users to their dashboard */}
        <Route path="*" element={<Navigate to={isDelivery ? "/delivery" : "/"} replace />} />
      </Routes>
      
      {/* Only show Footer for non-delivery and non-admin users */}
      {!isDelivery && !isAdmin && <FooterSection />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AuthModalProvider>
          <CartProvider>
            <WishlistProvider>
              <AppContent />
            </WishlistProvider>
          </CartProvider>
        </AuthModalProvider>
      </AuthProvider>
    </Router>
  );
}