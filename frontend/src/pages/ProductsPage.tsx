import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiRequest, API_ENDPOINTS } from '../config/api';
import ProductCard from '../components/ProductCard';

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: Array<{ secure_url: string }>;
  category: { name: string; slug: string };
  stock: number;
  shortDescription?: string;
  brand?: string;
  isOrganic?: boolean;
  specifications?: Record<string, string>;
}

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type');
  const categoryParam = searchParams.get('category');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || '');
  const [productType, setProductType] = useState(typeParam || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const query = searchParams.get('search');
    if (query !== null && query !== search) {
      setSearch(query);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, search, sort, page, productType]);

  const fetchCategories = async () => {
    try {
      const response = await apiRequest(API_ENDPOINTS.CATEGORIES.GET_ALL);
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (search) params.append('search', search);
      if (sort) params.append('sort', sort);
      if (productType) {
        // Map product type to backend field
        const typeMap: { [key: string]: string } = {
          'new-arrivals': 'isNewArrival',
          'featured': 'isFeatured',
          'trending': 'isTrending',
          'best-sellers': 'isBestSeller',
          'on-sale': 'isOnSale',
          'organic': 'isOrganic'
        };
        const field = typeMap[productType];
        if (field) params.append(field, 'true');
      }
      params.append('page', page.toString());

      const response = await apiRequest(`${API_ENDPOINTS.PRODUCTS.GET_ALL}?${params}`);
      setProducts(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {productType === 'new-arrivals' ? 'New Arrivals' :
             productType === 'featured' ? 'Featured Products' :
             productType === 'trending' ? 'Trending Products' :
             productType === 'best-sellers' ? 'Best Sellers' :
             productType === 'on-sale' ? 'On Sale' :
             productType === 'organic' ? 'Organic Products' :
             'All Products'}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white p-3 sm:p-5 rounded-xl border border-gray-100 shadow-sm mb-4 sm:mb-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
            {/* Search */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 mb-1 sm:mb-1.5 uppercase tracking-wider">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none text-gray-400">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-8 sm:pl-9 pr-3 sm:pr-4 py-1.5 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#992A16]/20 focus:border-[#992A16] hover:bg-white transition-colors"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Category */}
            <div className="col-span-1">
              <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 mb-1 sm:mb-1.5 uppercase tracking-wider">Category</label>
              <div className="relative">
                <select
                  className="appearance-none w-full pl-2 sm:pl-4 pr-8 sm:pr-10 py-1.5 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#992A16]/20 focus:border-[#992A16] hover:bg-white transition-colors cursor-pointer"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 text-gray-500">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {/* Product Type */}
            <div className="col-span-1">
              <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 mb-1 sm:mb-1.5 uppercase tracking-wider">Type</label>
              <div className="relative">
                <select
                  className="appearance-none w-full pl-2 sm:pl-4 pr-8 sm:pr-10 py-1.5 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#992A16]/20 focus:border-[#992A16] hover:bg-white transition-colors cursor-pointer"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="new-arrivals">New Arrivals</option>
                  <option value="featured">Featured</option>
                  <option value="trending">Trending</option>
                  <option value="best-sellers">Best Sellers</option>
                  <option value="on-sale">On Sale</option>
                  <option value="organic">Organic</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 text-gray-500">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {/* Sort */}
            <div className="col-span-2 lg:col-span-1">
              <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 mb-1 sm:mb-1.5 uppercase tracking-wider">Sort By</label>
              <div className="relative">
                <select
                  className="appearance-none w-full pl-2 sm:pl-4 pr-8 sm:pr-10 py-1.5 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#992A16]/20 focus:border-[#992A16] hover:bg-white transition-colors cursor-pointer"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="">Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name">Name</option>
                  <option value="rating">Rating</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 text-gray-500">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product as any} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
