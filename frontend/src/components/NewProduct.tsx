import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { apiRequest, API_ENDPOINTS } from "../config/api";

interface Product {
  _id: string;
  name: string;
  price: number;
  images?: Array<{ secure_url: string; public_id: string }>;
  discount?: number;
  stock?: number;
  brand?: string;
  isOrganic?: boolean;
  specifications?: Record<string, string>;
}

const NewProducts = () => {
  const navigate = useNavigate();
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
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 sm:h-64 bg-gray-200 rounded"></div>
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
            NEW PRODUCTS
          </h2>
          <button 
            onClick={() => navigate('/products?type=new-arrivals')}
            className="flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-medium border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all whitespace-nowrap active:scale-95"
          >
            View All →
          </button>
        </div>
        <span className="text-xs sm:text-sm text-gray-500">
          Some of the new products arriving this weeks
        </span>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-6">
        {products.map((product) => {
          return <ProductCard key={product._id} product={product as any} />;
        })}
      </div>
    </section>
  );
};

export default NewProducts;