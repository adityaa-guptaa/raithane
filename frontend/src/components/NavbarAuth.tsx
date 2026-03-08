import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAuthModal } from '../context/AuthModalContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, Menu, X, LogOut, LayoutDashboard, ChevronDown, Package, ShoppingBag, Truck } from 'lucide-react';

export default function NavbarAuth() {
  const { user, logout, isAdmin, isDelivery } = useAuth();
  const { openLogin, openRegister } = useAuthModal();
  const { cart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAccountDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    setIsAccountDropdownOpen(false);
  };

  // Debug logging
  console.log('User:', user);
  console.log('isAdmin:', isAdmin);
  console.log('isDelivery:', isDelivery);
  console.log('isAccountDropdownOpen:', isAccountDropdownOpen);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">Raithane</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-blue-600 font-medium">
              Products
            </Link>

            {user ? (
              <>
                {/* Admin Links */}
                {isAdmin && (
                  <>
                    <Link
                      to="/admin"
                      className="flex items-center gap-1 text-gray-700 hover:text-blue-600 font-medium"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Admin
                    </Link>
                    <Link to="/admin/products" className="text-gray-700 hover:text-blue-600 font-medium">
                      Manage Products
                    </Link>
                    <Link to="/admin/orders" className="text-gray-700 hover:text-blue-600 font-medium">
                      Manage Orders
                    </Link>
                  </>
                )}

                {/* Delivery Links */}
                {isDelivery && (
                  <>
                    <Link
                      to="/delivery"
                      className="flex items-center gap-1 text-gray-700 hover:text-blue-600 font-medium"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link to="/delivery/orders" className="text-gray-700 hover:text-blue-600 font-medium">
                      My Deliveries
                    </Link>
                  </>
                )}

                {/* Customer Links */}
                {!isAdmin && !isDelivery && (
                  <>
                    <Link to="/orders" className="text-gray-700 hover:text-blue-600 font-medium">
                      My Orders
                    </Link>
                  </>
                )}

                {/* Cart - for all users */}
                {!isDelivery && (
                  <Link to="/cart" className="relative text-gray-700 hover:text-blue-600">
                    <ShoppingCart className="w-6 h-6" />
                    {cart && cart.totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cart.totalItems}
                      </span>
                    )}
                  </Link>
                )}

                {/* User Account Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium"
                  >
                    <User className="w-5 h-5" />
                    <span>{user.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isAccountDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isAccountDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-[100]">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
                          {user.role}
                        </span>
                      </div>

                      {/* Admin Dropdown Items */}
                      {isAdmin && (
                        <>
                          <div className="px-4 py-2">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin</p>
                          </div>
                          <Link
                            to="/admin"
                            onClick={() => setIsAccountDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Dashboard</span>
                          </Link>
                          <Link
                            to="/admin/products"
                            onClick={() => setIsAccountDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Package className="w-4 h-4" />
                            <span>Manage Products</span>
                          </Link>
                          <Link
                            to="/admin/categories"
                            onClick={() => setIsAccountDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Manage Categories</span>
                          </Link>
                          <Link
                            to="/admin/orders"
                            onClick={() => setIsAccountDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            <span>Manage Orders</span>
                          </Link>
                          <div className="border-t border-gray-100 my-2"></div>
                        </>
                      )}

                      {/* Delivery Dropdown Items */}
                      {isDelivery && (
                        <>
                          <div className="px-4 py-2">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Delivery</p>
                          </div>
                          <Link
                            to="/delivery"
                            onClick={() => setIsAccountDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Dashboard</span>
                          </Link>
                          <Link
                            to="/delivery/orders"
                            onClick={() => setIsAccountDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Truck className="w-4 h-4" />
                            <span>My Deliveries</span>
                          </Link>
                          <div className="border-t border-gray-100 my-2"></div>
                        </>
                      )}

                      {/* Customer Dropdown Items */}
                      {!isAdmin && !isDelivery && (
                        <>
                          <Link
                            to="/orders"
                            onClick={() => setIsAccountDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            <span>My Orders</span>
                          </Link>
                          <div className="border-t border-gray-100 my-2"></div>
                        </>
                      )}

                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button onClick={() => openLogin()} className="text-gray-700 hover:text-blue-600 font-medium">
                  Login
                </button>
                <button
                  onClick={() => openRegister()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3">
            <Link
              to="/"
              className="block text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/products"
              className="block text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Products
            </Link>

            {user ? (
              <>
                {isAdmin && (
                  <>
                    <Link
                      to="/admin"
                      className="block text-gray-700 hover:text-blue-600 font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                    <Link
                      to="/admin/products"
                      className="block text-gray-700 hover:text-blue-600 font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Manage Products
                    </Link>
                    <Link
                      to="/admin/orders"
                      className="block text-gray-700 hover:text-blue-600 font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Manage Orders
                    </Link>
                  </>
                )}

                {isDelivery && (
                  <>
                    <Link
                      to="/delivery"
                      className="block text-gray-700 hover:text-blue-600 font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Delivery Dashboard
                    </Link>
                    <Link
                      to="/delivery/orders"
                      className="block text-gray-700 hover:text-blue-600 font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      My Deliveries
                    </Link>
                  </>
                )}

                {!isAdmin && !isDelivery && (
                  <>
                    <Link
                      to="/orders"
                      className="block text-gray-700 hover:text-blue-600 font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/cart"
                      className="block text-gray-700 hover:text-blue-600 font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Cart {cart && cart.totalItems > 0 && `(${cart.totalItems})`}
                    </Link>
                  </>
                )}

                <div className="border-t pt-3">
                  <p className="text-gray-600 mb-2">Logged in as {user.name}</p>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-red-600 hover:text-red-700 font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => { openLogin(); setIsMobileMenuOpen(false); }}
                  className="block w-full text-left text-gray-700 hover:text-blue-600 font-medium"
                >
                  Login
                </button>
                <button
                  onClick={() => { openRegister(); setIsMobileMenuOpen(false); }}
                  className="block w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium text-center"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
