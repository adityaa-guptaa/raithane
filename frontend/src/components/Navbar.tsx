import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuthModal } from "../context/AuthModalContext";
import { apiRequest, API_ENDPOINTS } from "../config/api";
import {
  FiSearch,
  FiUser,
  FiHeart,
  FiShoppingCart,
  FiChevronDown,
  FiX,
  FiMenu,
  FiMinus,
  FiPlus,
  FiLogOut,
} from "react-icons/fi";
import logo from "../assets/logo.png";

/** ---------- Cart Types + Helpers ---------- */
type CartItem = {
  id: string;
  name: string;
  variant?: string;
  imageUrl: string;
  price: number;
  oldPrice?: number;
  qty: number;
};

type Category = {
  _id: string;
  name: string;
  description?: string;
};

type Fees = { delivery: number; handling: number };

const formatNPR = (n: number) => `Rs.${parseFloat(n.toFixed(2)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

/** ---------- Cart Overlay Component ---------- */
function CartOverlay({
  open,
  onClose,
  items,
  fees,
  onInc,
  onDec,
  proceedLabel = "Login to Proceed",
  onProceed,
}: {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  fees: Fees;
  onInc: (id: string) => void;
  onDec: (id: string) => void;
  proceedLabel?: string;
  onProceed?: () => void;
}) {
  const totals = useMemo(() => {
    const itemsTotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const mrpTotal = items.reduce((sum, i) => sum + (i.oldPrice ?? i.price) * i.qty, 0);
    const saved = clamp(mrpTotal - itemsTotal, 0, Number.MAX_SAFE_INTEGER);
    const grand = itemsTotal + fees.delivery + fees.handling;
    return { itemsTotal, mrpTotal, saved, grand };
  }, [items, fees.delivery, fees.handling]);

  // ESC close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Body scroll lock
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className={`${open ? "pointer-events-auto" : "pointer-events-none hidden"} fixed inset-0 z-[999]`}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      {/* Right drawer */}
      <div
        className={[
          "absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div className="text-lg font-semibold text-gray-900">My Cart</div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
            aria-label="Close cart"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Scroll area */}
        <div className="h-[calc(100%-72px-92px)] overflow-y-auto px-5 py-4">
          {/* Delivery box */}
          <div className="rounded-2xl bg-gray-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                {/* clock-like pill */}
                <div className="h-5 w-5 rounded-full border-2 border-gray-700 relative">
                  <div className="absolute left-1/2 top-1/2 h-1.5 w-0.5 -translate-x-1/2 -translate-y-full bg-gray-700" />
                  <div className="absolute left-1/2 top-1/2 h-0.5 w-2 -translate-y-1/2 bg-gray-700" />
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">Delivery in 100 minutes</div>
                <div className="text-xs text-gray-600">Shipment of {items.length} items</div>
              </div>
            </div>

            {/* Items */}
            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
                  <img src={item.imageUrl} alt={item.name} className="h-12 w-12 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-gray-900">{item.name}</div>
                    {item.variant ? <div className="text-xs text-gray-600">{item.variant}</div> : null}
                    <div className="mt-1 flex items-baseline gap-2">
                      <div className="text-sm font-semibold text-gray-900">{formatNPR(item.price)}</div>
                      {item.oldPrice ? (
                        <div className="text-xs text-gray-400 line-through">{formatNPR(item.oldPrice)}</div>
                      ) : null}
                    </div>
                  </div>

                  {/* Qty control */}
                  <div className="flex items-center overflow-hidden rounded-lg bg-[#992A16]">
                    <button
                      onClick={() => onDec(item.id)}
                      className="grid h-9 w-9 place-items-center text-white hover:bg-[#b83e29]"
                      aria-label="Decrease quantity"
                    >
                      <FiMinus />
                    </button>
                    <div className="min-w-8 px-2 text-center text-sm font-semibold text-white">{item.qty}</div>
                    <button
                      onClick={() => onInc(item.id)}
                      className="grid h-9 w-9 place-items-center text-white hover:bg-[#2a5f1c] cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <FiPlus />
                    </button>
                  </div>
                </div>
              ))}

              {items.length === 0 ? (
                <div className="rounded-xl bg-white p-4 text-sm text-gray-600 shadow-sm">
                  Your cart is empty.
                </div>
              ) : null}
            </div>
          </div>

          {/* Bill details */}
          <div className="mt-5 rounded-2xl border bg-white p-4">
            <div className="text-sm font-semibold text-gray-900">Bill details</div>

            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <span>Items total</span>
                  {totals.saved > 0 ? (
                    <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                      Saved {formatNPR(totals.saved)}
                    </span>
                  ) : null}
                </div>
                <div className="flex items-baseline gap-2">
                  {totals.mrpTotal !== totals.itemsTotal ? (
                    <span className="text-xs text-gray-400 line-through">{formatNPR(totals.mrpTotal)}</span>
                  ) : null}
                  <span className="font-semibold text-gray-900">{formatNPR(totals.itemsTotal)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-700">Delivery charge</span>
                {fees.delivery === 0 ? (
                  <span className="font-semibold text-blue-700">{formatNPR(0)}</span>
                ) : (
                  <span className="font-semibold text-gray-900">{formatNPR(fees.delivery)}</span>
                )}
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-700">Handling charge</span>
                <span className="font-semibold text-gray-900">{formatNPR(fees.handling)}</span>
              </div>

              <div className="my-2 h-px bg-gray-200" />

              <div className="flex items-center justify-between gap-4">
                <span className="font-semibold text-gray-900">Grand total</span>
                <span className="text-lg font-bold text-gray-900">{formatNPR(totals.grand)}</span>
              </div>
            </div>
          </div>

          {/* Cancellation policy */}
          <div className="mt-5 rounded-2xl border bg-white p-4">
            <div className="text-sm font-semibold text-gray-900">Cancellation Policy</div>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Orders cannot be cancelled once packed for delivery. In case of unexpected delays, a refund will be
              provided, if applicable.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-4">
          <button
            type="button"
            onClick={onProceed}
            className="flex w-full items-center justify-between rounded-xl bg-[#992A16] px-4 py-4 text-white shadow-sm hover:bg-[#b83e29] cursor-pointer"
          >
            <div className="text-left">
              <div className="text-lg font-bold">{formatNPR(totals.grand)}</div>
              <div className="text-xs font-medium opacity-90">TOTAL</div>
            </div>
            <div className="text-sm font-semibold">{proceedLabel} ›</div>
          </button>
        </div>
      </div>
    </div>
  );
}

/** ---------- Your Navbar (with Cart Overlay integrated) ---------- */
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated, isAdmin, isDelivery } = useAuth();
  const { cart, updateCartItem, removeFromCart, addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { openLogin } = useAuthModal();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // ✅ Cart open state
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
      setIsSearchFocused(false);
    }
  };



  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearchLoading(true);
      try {
        const response = await apiRequest(`${API_ENDPOINTS.PRODUCTS.LIST}?search=${encodeURIComponent(searchQuery.trim())}&limit=5`);
        setSearchResults(response.data || []);
      } catch (error) {
        console.error("Failed to fetch search results:", error);
        setSearchResults([]);
      } finally {
        setIsSearchLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSearchResults, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Helper function to check if link is active
  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Transform cart items to match CartOverlay format
  const cartItems: CartItem[] = useMemo(() => {
    if (!cart || !cart.items) return [];
    return cart.items.map(item => ({
      id: item._id,
      name: item.product.name,
      variant: '',
      imageUrl: item.product.images?.[0]?.secure_url || 'https://via.placeholder.com/150',
      price: item.price,
      qty: item.quantity,
    }));
  }, [cart]);

  const fees: Fees = { delivery: 0, handling: 0 };

  const cartCount = cart?.totalItems || 0;

  const incQty = async (id: string) => {
    const item = cart?.items.find(i => i._id === id);
    if (item) {
      try {
        await updateCartItem(id, item.quantity + 1);
      } catch (error) {
        console.error('Failed to update quantity:', error);
      }
    }
  };

  const decQty = async (id: string) => {
    const item = cart?.items.find(i => i._id === id);
    if (item) {
      try {
        if (item.quantity <= 1) {
          await removeFromCart(id);
        } else {
          await updateCartItem(id, item.quantity - 1);
        }
      } catch (error) {
        console.error('Failed to update quantity:', error);
      }
    }
  };

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          apiRequest(API_ENDPOINTS.CATEGORIES.LIST),
          apiRequest(API_ENDPOINTS.PRODUCTS.LIST + '?limit=10')
        ]);
        setCategories(categoriesRes.data || []);
        setProducts(productsRes.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch categories and products:", error);
      }
    };

    fetchCategoriesAndProducts();
  }, []);

  // Calculate countdown timer for Haat Bazar (Next Saturday)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isHaatBazarToday, setIsHaatBazarToday] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentDay = now.getDay(); // 0 (Sun) - 6 (Sat)
      
      if (currentDay === 6) {
        setIsHaatBazarToday(true);
        return;
      }
      
      setIsHaatBazarToday(false);

      // Calculate days until next Saturday (6)
      const daysUntilSaturday = (6 - currentDay + 7) % 7;
      
      const targetDate = new Date(now);
      targetDate.setDate(now.getDate() + daysUntilSaturday);
      targetDate.setHours(0, 0, 0, 0); // Start of Saturday (Midnight)
      
      // If we are past saturday (should be caught by above check, but for safety in generic logic)
      if (targetDate.getTime() <= now.getTime()) {
        targetDate.setDate(targetDate.getDate() + 7);
      }
      
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft(); // Initial calculation
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  // If delivery user, show simplified navbar
  if (isDelivery) {
    return (
      <header className="w-full border-b relative z-40 bg-white">
        <div className="flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img src={logo} alt="Haat Bazar Logo" className="h-8 lg:h-12 w-auto object-contain" />
          </div>

          {/* Delivery Dashboard Title */}
          <h1 className="text-lg lg:text-xl font-semibold text-gray-900">Delivery Dashboard</h1>

          {/* Logout Button */}
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600 hidden sm:block">
              {user?.name}
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#992A16] transition-colors cursor-pointer"
            >
              <FiLogOut className="text-base" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="w-full border-b relative z-40">
        {/* Top Announcement Bar */}
        {showAnnouncement && (
          <div 
            className={`${
              isHaatBazarToday ? 'bg-green-600' : 'bg-[#992A16]'
            } text-white text-[10px] sm:text-xs md:text-sm px-2 sm:px-6 py-2 relative flex flex-col sm:flex-row justify-center items-center text-center sm:text-left gap-1 sm:gap-0 transition-colors duration-300`}
          >
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-6">
              <p>
                We deliver to you every day from <span className="font-semibold">7:00 AM to 5:00 PM.</span>
              </p>
              {isHaatBazarToday ? (
                <p className="font-bold text-base animate-pulse">
                  Haat bazar is today, visit us in Bhirkuti Mandap!!
                </p>
              ) : (
                <p>
                  Haat Bazar start in:
                  <span className="ml-1 sm:ml-2 font-semibold">{timeLeft.days}</span> days
                  <span className="ml-1 sm:ml-2 font-semibold">{timeLeft.hours}</span> hours
                  <span className="ml-1 sm:ml-2 font-semibold">{timeLeft.minutes}</span> min
                  <span className="ml-1 sm:ml-2 font-semibold">{timeLeft.seconds}</span> sec
                </p>
              )}
            </div>
            <button
              onClick={() => setShowAnnouncement(false)}
              className="absolute right-2 sm:right-4 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <FiX className="text-lg" />
            </button>
          </div>
        )}

        {/* Main Navbar */}
        <div className="flex flex-col lg:flex-row items-center gap-3 lg:gap-6 px-4 lg:px-6 py-3 lg:py-4">
          {/* Header Row: Logo & Actions (Mobile) */}
          <div className="w-full lg:w-auto flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img src={logo} alt="Haat Bazar Logo" className="h-8 lg:h-12 w-auto object-contain" />
            </Link>

            {/* Mobile Actions: Account, Wishlist, Cart, Hamburger */}
            <div className="flex items-center gap-3 lg:hidden text-gray-700">
              {isAuthenticated ? (
                <button
                  onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                  className="flex items-center gap-1 cursor-pointer hover:text-[#992A16] transition-colors"
                >
                  <FiUser className="text-xl" />
                </button>
              ) : (
                <button
                  onClick={openLogin}
                  className="flex items-center gap-1 cursor-pointer hover:text-[#992A16] transition-colors"
                >
                  <FiUser className="text-xl" />
                </button>
              )}
              <button
                onClick={() => navigate('/wishlist')}
                className="relative cursor-pointer hover:text-[#992A16] transition-colors"
                aria-label="Open wishlist"
              >
                <FiHeart className="text-xl" />
                {isAuthenticated && wishlist && wishlist.totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {wishlist.totalItems}
                  </span>
                )}
              </button>

              {/* ✅ Mobile cart button opens overlay */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative cursor-pointer"
                aria-label="Open cart"
              >
                <FiShoppingCart className="text-xl" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              </button>

              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="cursor-pointer">
                {isMobileMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="w-full lg:flex-1 relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)} // Delay to allow click
              className="w-full bg-gray-100 rounded-md pl-3 pr-10 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#992A16]/20 h-9 lg:h-10"
            />
            <button 
              onClick={handleSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#992A16] transition-colors cursor-pointer"
            >
              <FiSearch className="text-sm lg:text-lg" />
            </button>

            {/* Live Search Dropdown */}
            {isSearchFocused && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-96 overflow-y-auto z-50">
                {isSearchLoading ? (
                  <div className="p-4 text-center text-gray-500 text-sm">Loading...</div>
                ) : searchResults.length > 0 ? (
                  <>
                    {searchResults.map((product) => (
                      <div
                        key={product._id}
                        onClick={() => {
                          navigate(`/products/${product._id}`);
                          setSearchQuery("");
                          setIsSearchFocused(false);
                        }}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                      >
                        <img 
                          src={product.images?.[0]?.secure_url || '/placeholder.jpg'} 
                          alt={product.name} 
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-gray-500">{formatNPR(product.price)}</span>
                            {product.category && (
                              <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                                {product.category.name}
                              </span>
                            )}
                          </div>
                          <div className={`text-[10px] font-medium mt-0.5 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isAuthenticated) {
                                openLogin();
                                return;
                              }
                              if (isInWishlist(product._id)) {
                                removeFromWishlist(product._id);
                              } else {
                                addToWishlist(product._id);
                              }
                            }}
                            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-medium transition-all ${
                              isInWishlist(product._id)
                                ? "bg-red-50 text-[#992A16] border border-red-100"
                                : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100"
                            }`}
                          >
                            <FiHeart className={`text-xs ${isInWishlist(product._id) ? "fill-[#992A16]" : ""}`} />
                            <span>Wishlist</span>
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isAuthenticated) {
                                openLogin();
                                return;
                              }
                              addToCart(product._id, 1);
                            }}
                            disabled={product.stock <= 0}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-medium transition-all ${
                              product.stock > 0 
                                ? "bg-[#992A16] text-white hover:bg-[#7a2112] shadow-sm" 
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            <FiShoppingCart className="text-xs" />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    ))}
                    <div 
                      onClick={handleSearch}
                      className="p-3 text-center text-sm text-blue-600 hover:bg-blue-50 cursor-pointer font-medium border-t"
                    >
                      View all results for "{searchQuery}"
                    </div>
                  </>
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm">No products found</div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-6 text-gray-700">
            {/* Account / Login */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                  className="flex items-center gap-1 cursor-pointer hover:text-[#992A16] transition-colors"
                >
                  <FiUser className="text-xl" />
                  <span className="text-sm">{user?.name?.split(' ')[0]}</span>
                  <FiChevronDown className={`text-sm transition-transform duration-200 ${isAccountDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isAccountDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg min-w-[220px] z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="text-sm font-semibold text-gray-900">{user?.name}</div>
                      <div className="text-xs text-gray-500">{user?.email}</div>
                      <span className="inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
                        {user?.role}
                      </span>
                    </div>

                    {/* Admin Links */}
                    {isAdmin && (
                      <>
                        <div className="px-4 py-2 border-b border-gray-50">
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Admin</div>
                          <Link
                            to="/admin"
                            onClick={() => setIsAccountDropdownOpen(false)}
                            className="flex items-center gap-2 py-1.5 hover:text-[#992A16] cursor-pointer transition-colors duration-200 text-sm"
                          >
                            Dashboard
                          </Link>
                          <Link
                            to="/admin/products"
                            onClick={() => setIsAccountDropdownOpen(false)}
                            className="flex items-center gap-2 py-1.5 hover:text-[#992A16] cursor-pointer transition-colors duration-200 text-sm"
                          >
                            Manage Products
                          </Link>
                          <Link
                            to="/admin/categories"
                            onClick={() => setIsAccountDropdownOpen(false)}
                            className="flex items-center gap-2 py-1.5 hover:text-[#992A16] cursor-pointer transition-colors duration-200 text-sm"
                          >
                            Manage Categories
                          </Link>
                          <Link
                            to="/admin/orders"
                            onClick={() => setIsAccountDropdownOpen(false)}
                            className="flex items-center gap-2 py-1.5 hover:text-[#992A16] cursor-pointer transition-colors duration-200 text-sm"
                          >
                            Manage Orders
                          </Link>
                        </div>
                      </>
                    )}

                    {/* Delivery Links */}
                    {isDelivery && (
                      <>
                        <div className="px-4 py-2 border-b border-gray-50">
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Delivery</div>
                          <Link
                            to="/delivery"
                            onClick={() => setIsAccountDropdownOpen(false)}
                            className="flex items-center gap-2 py-1.5 hover:text-[#992A16] cursor-pointer transition-colors duration-200 text-sm"
                          >
                            Dashboard
                          </Link>
                          <Link
                            to="/delivery/orders"
                            onClick={() => setIsAccountDropdownOpen(false)}
                            className="flex items-center gap-2 py-1.5 hover:text-[#992A16] cursor-pointer transition-colors duration-200 text-sm"
                          >
                            My Deliveries
                          </Link>
                        </div>
                      </>
                    )}

                    {/* Customer Links */}
                    {!isAdmin && !isDelivery && (
                      <Link
                        to="/orders"
                        onClick={() => setIsAccountDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 hover:text-[#992A16] cursor-pointer transition-colors duration-200 text-sm"
                      >
                        My Orders
                      </Link>
                    )}

                    {/* Logout */}
                    <button
                      onClick={() => {
                        logout();
                        setIsAccountDropdownOpen(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 hover:text-[#992A16] cursor-pointer transition-colors duration-200 w-full text-left text-sm border-t border-gray-100"
                    >
                      <FiLogOut className="text-base" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openLogin}
                className="flex items-center gap-1 cursor-pointer hover:text-[#992A16] transition-colors"
              >
                <FiUser className="text-xl" />
                <span className="text-sm">Login</span>
              </button>
            )}

            <button
              onClick={() => navigate('/wishlist')}
              className="relative cursor-pointer hover:text-[#992A16] transition-colors"
              aria-label="Open wishlist"
            >
              <FiHeart className="text-xl" />
              {isAuthenticated && wishlist && wishlist.totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {wishlist.totalItems}
                </span>
              )}
            </button>

            {/* ✅ Desktop cart button opens overlay */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative cursor-pointer"
              aria-label="Open cart"
            >
              <FiShoppingCart className="text-xl" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex px-6 py-3 gap-6 text-sm font-medium border-t items-center">
          {isAdmin ? (
            <>
              {/* Admin Navigation */}
              <Link 
                to="/admin" 
                className={`cursor-pointer transition-colors duration-200 pb-1 ${
                  isActive('/admin') 
                    ? 'text-[#992A16] border-b-2 border-[#992A16]' 
                    : 'hover:text-[#992A16]'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                to="/admin/products" 
                className={`cursor-pointer transition-colors duration-200 pb-1 ${
                  isActive('/admin/products') 
                    ? 'text-[#992A16] border-b-2 border-[#992A16]' 
                    : 'hover:text-[#992A16]'
                }`}
              >
                Manage Products
              </Link>
              <Link 
                to="/admin/categories" 
                className={`cursor-pointer transition-colors duration-200 pb-1 ${
                  isActive('/admin/categories') 
                    ? 'text-[#992A16] border-b-2 border-[#992A16]' 
                    : 'hover:text-[#992A16]'
                }`}
              >
                Manage Categories
              </Link>
              <Link 
                to="/admin/orders" 
                className={`cursor-pointer transition-colors duration-200 pb-1 ${
                  isActive('/admin/orders') 
                    ? 'text-[#992A16] border-b-2 border-[#992A16]' 
                    : 'hover:text-[#992A16]'
                }`}
              >
                Manage Orders
              </Link>
              <Link 
                to="/admin/customers" 
                className={`cursor-pointer transition-colors duration-200 pb-1 ${
                  isActive('/admin/customers') 
                    ? 'text-[#992A16] border-b-2 border-[#992A16]' 
                    : 'hover:text-[#992A16]'
                }`}
              >
                Customers
              </Link>
              <Link 
                to="/admin/delivery-persons" 
                className={`cursor-pointer transition-colors duration-200 pb-1 ${
                  isActive('/admin/delivery-persons') 
                    ? 'text-[#992A16] border-b-2 border-[#992A16]' 
                    : 'hover:text-[#992A16]'
                }`}
              >
                Delivery Staff
              </Link>
            </>
          ) : (
            <>
              {/* Customer Navigation */}
              <Link 
                to="/" 
                className={`cursor-pointer transition-colors duration-200 pb-1 ${
                  location.pathname === '/' 
                    ? 'text-[#992A16] border-b-2 border-[#992A16]' 
                    : 'hover:text-[#992A16]'
                }`}
              >
                Home
              </Link>

              {/* Category Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="flex items-center gap-2 cursor-pointer hover:text-[#992A16] transition-colors duration-200 bg-transparent border-none font-medium text-sm"
                >
                  <span>Category</span>
                  <FiChevronDown className={`transition-transform duration-200 ${isCategoryOpen ? "rotate-180" : ""}`} />
                </button>

                {isCategoryOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg min-w-[200px] z-50">
                    {categories.map((category) => (
                      <div
                        key={category._id}
                        onClick={() => {
                          navigate(`/products?category=${category._id}`);
                          setIsCategoryOpen(false);
                        }}
                        className="px-4 py-2 hover:bg-gray-50 hover:text-[#992A16] cursor-pointer transition-colors duration-200 border-b last:border-b-0"
                      >
                        {category.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Products Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProductsOpen(!isProductsOpen)}
                  className="flex items-center gap-2 cursor-pointer hover:text-[#992A16] transition-colors duration-200 bg-transparent border-none font-medium text-sm"
                >
                  <span>Products</span>
                  <FiChevronDown className={`transition-transform duration-200 ${isProductsOpen ? "rotate-180" : ""}`} />
                </button>

                {isProductsOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg min-w-[250px] z-50 max-h-96 overflow-y-auto">
                    <Link 
                      to="/products"
                      onClick={() => setIsProductsOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-50 hover:text-[#992A16] cursor-pointer transition-colors duration-200 border-b font-semibold"
                    >
                      All Products
                    </Link>
                    {products.map((product) => (
                      <Link
                        key={product._id}
                        to={`/products/${product._id}`}
                        onClick={() => setIsProductsOpen(false)}
                        className="block px-4 py-2 hover:bg-gray-50 hover:text-[#992A16] cursor-pointer transition-colors duration-200 border-b last:border-b-0 text-sm"
                      >
                        {product.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link 
                to="/blog" 
                className={`cursor-pointer transition-colors duration-200 font-medium text-sm pb-1 ${
                  location.pathname === '/blog' 
                    ? 'text-[#992A16] border-b-2 border-[#992A16]' 
                    : 'hover:text-[#992A16]'
                }`}
              >
                Blog
              </Link>
              <Link 
                to="/contact" 
                className={`cursor-pointer transition-colors duration-200 font-medium text-sm pb-1 ${
                  location.pathname === '/contact' 
                    ? 'text-[#992A16] border-b-2 border-[#992A16]' 
                    : 'hover:text-[#992A16]'
                }`}
              >
                Contact
              </Link>
              <Link 
                to="/about" 
                className={`cursor-pointer transition-colors duration-200 font-medium text-sm pb-1 ${
                  location.pathname === '/about' 
                    ? 'text-[#992A16] border-b-2 border-[#992A16]' 
                    : 'hover:text-[#992A16]'
                }`}
              >
                About Us
              </Link>

              <div className="ml-auto flex gap-4 items-center">
                <Link 
                  to="/orders" 
                  onClick={(e) => {
                    if (!isAuthenticated) {
                      e.preventDefault();
                      openLogin();
                    }
                  }}
                  className={`cursor-pointer transition-colors duration-200 font-medium text-sm pb-1 ${
                    isActive('/orders') 
                      ? 'text-[#992A16] border-b-2 border-[#992A16]' 
                      : 'hover:text-[#992A16]'
                  }`}
                >
                  Order Tracking
                </Link>
                <Link to="/almost-finished" className="text-red-500 font-semibold cursor-pointer flex items-center hover:text-red-600 transition-colors">
                  Almost Finished
                  <span className="ml-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded">SALE</span>
                </Link>
              </div>
            </>
          )}
        </nav>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden px-6 py-4 flex flex-col gap-4 text-sm font-medium border-t bg-white absolute top-[138px] left-0 right-0 z-50 shadow-lg h-[calc(100vh-138px)] overflow-y-auto">
            {/* Account Section for Mobile */}
            {isAuthenticated ? (
              <div className="pb-4 border-b border-gray-200">
                <div className="text-sm font-semibold text-gray-900">{user?.name}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
                <div className="flex flex-col gap-2 mt-3">
                  <Link
                    to="/orders"
                    className="text-sm py-2 hover:text-[#992A16] transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-sm py-2 hover:text-[#992A16] transition-colors text-left"
                  >
                    <FiLogOut className="text-base" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="pb-4 border-b border-gray-200">
                <button
                  onClick={() => {
                    openLogin();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-sm font-semibold hover:text-[#992A16] transition-colors"
                >
                  <FiUser className="text-lg" />
                  Login
                </button>
              </div>
            )}

            <Link 
              to="/" 
              className="cursor-pointer hover:text-[#992A16] transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>

            <div className="flex flex-col gap-2">
              <div
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex items-center justify-between cursor-pointer"
              >
                <span className="font-bold text-gray-900">Category</span>
                <FiChevronDown
                  className={`transition-transform duration-200 ${isCategoryOpen ? "rotate-180" : ""}`}
                />
              </div>
              {isCategoryOpen &&
                categories.map((category) => (
                  <div
                    key={category._id}
                    className="flex items-center gap-3 pl-4 py-1 cursor-pointer hover:bg-gray-50 rounded-lg"
                  >
                    <span className="text-gray-600 hover:text-[#992A16]">{category.name}</span>
                  </div>
                ))}
            </div>

            <div className="flex flex-col gap-2">
              <div
                onClick={() => setIsProductsOpen(!isProductsOpen)}
                className="flex items-center justify-between cursor-pointer"
              >
                <span className="font-bold text-gray-900">Products</span>
                <FiChevronDown
                  className={`transition-transform duration-200 ${isProductsOpen ? "rotate-180" : ""}`}
                />
              </div>
              {isProductsOpen && (
                <>
                  <Link 
                    to="/products"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="pl-4 text-gray-600 hover:text-[#992A16] cursor-pointer py-1 block font-semibold"
                  >
                    All Products
                  </Link>
                  {products.slice(0, 5).map((product) => (
                    <Link
                      key={product._id}
                      to={`/products/${product._id}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="pl-4 text-gray-600 hover:text-[#992A16] cursor-pointer py-1 block"
                    >
                      {product.name}
                    </Link>
                  ))}
                </>
              )}
            </div>

            <Link 
              to="/blog" 
              className="cursor-pointer hover:text-[#992A16] transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link 
              to="/contact" 
              className="cursor-pointer hover:text-[#992A16] transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <span className="cursor-pointer hover:text-[#992A16] transition-colors duration-200">About Us</span>
            <span 
              onClick={() => {
                if (isAuthenticated) {
                  navigate('/orders');
                } else {
                  openLogin();
                }
                setIsMobileMenuOpen(false);
              }}
              className="cursor-pointer hover:text-[#992A16] transition-colors duration-200"
            >
              Order Tracking
            </span>
            <Link 
              to="/almost-finished" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-red-500 font-semibold cursor-pointer hover:text-red-600 transition-colors"
            >
              Almost Finished SALE
            </Link>
          </nav>
        )}
      </header>

      {/* ✅ Cart Overlay mounted once */}
      <CartOverlay
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        fees={fees}
        onInc={incQty}
        onDec={decQty}
        proceedLabel={isAuthenticated ? "Proceed to Checkout" : "Login to Proceed"}
        onProceed={() => {
          if (isAuthenticated) {
            navigate('/checkout');
          } else {
            openLogin();
          }
          setIsCartOpen(false);
        }}
      />
    </>
  );
};

export default Navbar;