import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { apiRequest, API_ENDPOINTS } from "../config/api";

interface Product {
  _id: string;
  name: string;
  price: number;
  images?: { secure_url: string }[];
  discount?: number;
  rating?: number;
  brand?: string;
  isOrganic?: boolean;
  specifications?: Record<string, string>;
}

export default function FeaturedProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiRequest(`${API_ENDPOINTS.PRODUCTS.LIST}?limit=4&featured=true`);
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
          <div className="grid grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
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
    <section className="max-w-7xl mx-auto mt-10 px-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:gap-2 mb-6 sm:mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 leading-tight uppercase tracking-tight">
            FEATURED PRODUCTS
          </h2>
          <button 
            onClick={() => navigate('/products?type=featured')}
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
          return <ProductCard key={item._id} product={item as any} />;
        })}
      </div>
    </section>
  );
}
