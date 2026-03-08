import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiRequest, API_ENDPOINTS } from "../config/api";
import { Heart, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

interface Product {
  _id: string;
  name: string;
  price: number;
  images?: Array<{ secure_url: string }>;
  discount?: number;
  stock?: number;
  brand?: string;
  isOrganic?: boolean;
  specifications?: Record<string, string>;
}

export default function NewArrivals() {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiRequest(`${API_ENDPOINTS.PRODUCTS.LIST}?limit=6&sort=-createdAt`);
        setProducts(response.data || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:gap-2 mb-6 sm:mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 leading-tight uppercase tracking-tight">
            NEW ARRIVALS
          </h2>
          <button 
            onClick={() => navigate('/products?type=new-arrivals')}
            className="flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-medium border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all whitespace-nowrap active:scale-95"
          >
            View All →
          </button>
        </div>
        <span className="text-xs sm:text-sm text-gray-500">
          Do not miss the current offers until the end of month
        </span>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-6">
        {products.map((item) => {
          const originalPrice = item.discount 
            ? item.price / (1 - item.discount / 100)
            : item.price;
          
          return (
            <div
              key={item._id}
              className="border border-gray-200 rounded-xl p-3 relative hover:shadow-lg transition bg-white flex flex-col justify-between"
            >
              {/* Wishlist Button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  addToWishlist(item._id);
                }}
                className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 active:scale-95 transition-transform"
              >
                <Heart 
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                    isInWishlist(item._id) 
                      ? 'fill-red-500 text-red-500' 
                      : 'text-gray-400 hover:text-red-500'
                  }`} 
                />
              </button>

              {/* Product Image */}
              <div 
                onClick={() => navigate(`/products/${item._id}`)}
                className="cursor-pointer mb-3 relative group"
              >
                <img
                  src={item.images?.[0]?.secure_url || 'https://via.placeholder.com/150'}
                  alt={item.name}
                  className="h-28 sm:h-40 w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content Container */}
              <div className="flex flex-col flex-1">
                {/* Title with Organic Badge */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 
                    onClick={() => navigate(`/products/${item._id}`)}
                    className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 leading-snug cursor-pointer hover:text-[#992A16] transition-colors"
                  >
                    {item.name}
                  </h3>
                </div>

                {/* Tags/Brand */}
                <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                  {item.isOrganic && (
                    <span className="text-[10px] sm:text-xs font-medium px-1.5 py-0.5 rounded bg-green-100 text-green-700">
                      Organic
                    </span>
                  )}
                  {item.brand && (
                    <span className="text-[10px] sm:text-xs text-gray-500 font-medium px-1.5 py-0.5 bg-gray-100 rounded">
                      {item.brand}
                    </span>
                  )}
                </div>

                {/* Pricing */}
                <div className="mt-auto pt-2">
                  <div className="flex items-baseline gap-2 mb-3">
                    {item.price > 0 ? (
                      <>
                        <span className="text-sm sm:text-base font-bold text-[#992A16]">
                          Rs. {item.price.toFixed(2)}
                        </span>
                        {(item.discount ?? 0) > 0 && (
                          <span className="text-xs text-gray-400 line-through">
                             Rs. {originalPrice.toFixed(2)}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-sm sm:text-base font-bold text-gray-500">Price not set</span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isInCart(item._id)) {
                        addToCart(item._id, 1);
                      }
                    }}
                    className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg transition text-xs sm:text-sm font-semibold shadow-sm active:scale-95 ${
                      isInCart(item._id)
                        ? 'bg-green-600 text-white cursor-default'
                        : 'bg-[#992A16] text-white hover:bg-[#7a2112]'
                    }`}
                  >
                    <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {isInCart(item._id) ? 'Added' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
