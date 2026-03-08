import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest, API_ENDPOINTS } from "../config/api";

interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: {
    secure_url: string;
    public_id: string;
  };
}

const TopCategories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiRequest(API_ENDPOINTS.CATEGORIES.LIST);
        setCategories(response.data || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="w-full max-w-7xl mx-auto px-6 py-10">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-3 lg:grid-cols-9 gap-4">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }
  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-10">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-start flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
          <h2 className="text-sm sm:text-xl font-semibold text-gray-900 leading-tight">
            Top Categories
          </h2>
          <span className="text-[10px] sm:text-sm text-gray-400 leading-tight">
            New products with updated stocks.
          </span>
        </div>

        <button 
          onClick={() => navigate('/products')}
          className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm font-medium text-gray-700 border border-gray-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-gray-50 transition whitespace-nowrap"
        >
          View All
          <span>→</span>
        </button>
      </div>

      {/* Categories Grid (Desktop) */}
      <div className="hidden md:block border border-gray-200 rounded-xl overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-9 divide-x divide-y lg:divide-y-0">
          {categories.map((category) => (
            <div
              key={category._id}
              onClick={() => navigate(`/products?category=${category._id}`)}
              className="flex flex-col items-center justify-center p-6 hover:bg-gray-50 transition cursor-pointer"
            >
              {category.image?.secure_url ? (
                <img
                  src={category.image.secure_url}
                  alt={category.name}
                  className="h-24 object-contain mb-1"
                />
              ) : (
                <div className="h-24 w-24 bg-gray-200 rounded-lg flex items-center justify-center mb-1">
                  <span className="text-gray-400 text-xs">No Image</span>
                </div>
              )}
              <p className="text-sm font-medium text-gray-800 text-center">
                {category.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Horizontal Scroll (Mobile) */}
      <div className="md:hidden overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
        <div className="flex gap-4">
          {categories.map((category) => (
            <div
              key={category._id}
              onClick={() => navigate(`/products?category=${category._id}`)}
              className="flex-shrink-0 flex flex-col items-center justify-center p-3 bg-white border border-gray-100 rounded-xl shadow-sm w-24 h-28 space-y-2 active:scale-95 transition-transform"
            >
              {category.image?.secure_url ? (
                <img
                  src={category.image.secure_url}
                  alt={category.name}
                  className="w-12 h-12 object-contain"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-[10px] text-gray-400">N/A</span>
                </div>
              )}
              <p className="text-xs font-medium text-gray-800 text-center line-clamp-2 leading-tight">
                {category.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCategories;