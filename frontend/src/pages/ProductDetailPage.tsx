import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Truck, BadgePercent, Heart } from 'lucide-react';
import { apiRequest, API_ENDPOINTS } from '../config/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useAuthModal } from '../context/AuthModalContext';
import YouMayAlsoLike from '../components/YouMayAlsoLike';
import NewProduct from '../components/NewProduct';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { openLogin } = useAuthModal();

  useEffect(() => {
    if (id) {
      // Scroll to top when product ID changes
      window.scrollTo(0, 0);
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await apiRequest(API_ENDPOINTS.PRODUCTS.GET_ONE(id!));
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      openLogin();
      return;
    }

    try {
      await addToCart(product._id, quantity);
    } catch (error: any) {
      // Error already handled by CartContext toast
    }
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      openLogin();
      return;
    }

    try {
      if (isInWishlist(product._id)) {
        await removeFromWishlist(product._id);
      } else {
        await addToWishlist(product._id);
      }
    } catch (error: any) {
      // Error already handled by WishlistContext toast
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#992A16]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Product not found</p>
      </div>
    );
  }

  const images = product.images?.length > 0 
    ? product.images.map((img: any, idx: number) => ({
        id: `img-${idx}`,
        src: img.secure_url || img,
        alt: `${product.name} ${idx + 1}`
      }))
    : [{ id: 'img-0', src: '/placeholder.jpg', alt: product.name }];

  const selectedImage = images[selectedImageIndex] || images[0];

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:py-6 lg:px-6">
        <div className="grid grid-cols-1 gap-6 sm:gap-10 lg:grid-cols-[1.35fr_1fr]">
          {/* LEFT: Gallery */}
          <section>
            <div className="rounded-lg border border-gray-200 bg-white">
              <div className="p-4">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-gray-50">
                  <img
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    className="h-full w-full object-contain"
                    draggable={false}
                  />
                </div>

                {/* Thumbnails row */}
                {images.length > 1 && (
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex w-full items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
                      {images.map((img: any, idx: number) => {
                        const active = idx === selectedImageIndex;
                        return (
                          <button
                            key={img.id}
                            type="button"
                            onClick={() => setSelectedImageIndex(idx)}
                            className={[
                              "group relative h-16 w-16 flex-none overflow-hidden rounded-md border bg-gray-50 transition-all",
                              active
                                ? "border-[#992A16] ring-2 ring-red-100"
                                : "border-gray-200 hover:border-gray-300",
                            ].join(" ")}
                          >
                            <img
                              src={img.src}
                              alt={img.alt}
                              className="h-full w-full object-cover"
                              draggable={false}
                            />
                          </button>
                        );
                      })}
                    </div>

                    {images.length > 6 && (
                      <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50"
                        onClick={() => setSelectedImageIndex((selectedImageIndex + 1) % images.length)}
                      >
                        <ChevronRight className="h-5 w-5 text-gray-700" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* RIGHT: Product meta */}
          <aside className="flex flex-col h-full">
            {/* Breadcrumbs */}
            <nav className="text-[10px] sm:text-xs text-gray-500 mb-1 sm:mb-2">
              <ol className="flex flex-wrap items-center gap-1">
                <li className="hover:text-gray-700 cursor-pointer" onClick={() => navigate('/')}>Home</li>
                <li className="text-gray-300">/</li>
                <li className="hover:text-gray-700 cursor-pointer" onClick={() => navigate('/products')}>Products</li>
                {product.category && (
                  <>
                    <li className="text-gray-300">/</li>
                    <li className="hover:text-gray-700">{product.category.name}</li>
                  </>
                )}
                <li className="text-gray-300">/</li>
                <li className="text-gray-400 line-clamp-1">{product.name}</li>
              </ol>
            </nav>

            <h1 className="text-xl sm:text-2xl font-bold leading-tight text-gray-900">
              {product.name}
            </h1>

            {/* Brand and Organic Badge */}
            <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-3">
              {product.brand && (
                <span className="text-[10px] sm:text-xs text-gray-600 font-medium bg-gray-100 px-1.5 py-0.5 rounded">Brand: {product.brand}</span>
              )}
              {product.isOrganic && (
                <span className="inline-block px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
                  Organic
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mt-1 sm:mt-2">
              <p className={`text-[10px] sm:text-xs font-medium flex items-center gap-1 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-green-600' : 'bg-red-600'}`}></span>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </p>
            </div>

            {/* Price section with enhanced styling */}
            <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex flex-wrap items-baseline gap-2">
                <div className="text-xl sm:text-2xl font-bold text-[#992A16]">Rs.{product.price}</div>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <div className="text-xs sm:text-sm text-gray-400 line-through">Rs.{product.originalPrice}</div>
                    <div className="text-[10px] sm:text-xs font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </div>
                  </>
                )}
              </div>
              <div className="mt-1 text-[10px] sm:text-xs text-gray-500">(Inclusive of all taxes)</div>
            </div>

            {/* Actions */}
            <div className="mt-3 sm:mt-4 flex flex-col gap-2.5 sm:gap-3">
               {/* Quantity Selector */}
               <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <label className="text-[10px] sm:text-xs font-medium text-gray-700">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2.5 py-1 sm:px-3 sm:py-1.5 hover:bg-gray-100 text-gray-600 transition"
                  >
                    -
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    readOnly
                    className="w-10 sm:w-12 px-1 sm:px-2 py-1 sm:py-1.5 text-center border-x border-gray-300 bg-transparent text-sm font-medium cursor-default focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-2.5 py-1 sm:px-3 sm:py-1.5 hover:bg-gray-100 text-gray-600 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-2 sm:gap-3 flex-wrap sm:flex-nowrap mt-1 sm:mt-0">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 h-9 sm:h-10 rounded-lg bg-[#992A16] px-4 sm:px-8 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-[#b83e29] hover:shadow-lg active:scale-95 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                    <Truck className="w-4 h-4 sm:w-4 sm:h-4" />
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
                >
                  <Heart
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${
                      isInWishlist(product._id)
                        ? 'fill-[#992a16] text-[#992a16]'
                        : 'text-gray-400 hover:text-[#992a16]'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100">
               <div className="space-y-2.5 sm:space-y-3">
                <Benefit
                  icon={<Truck className="h-4 w-4 sm:h-4 sm:w-4 text-[#992A16]" />}
                  title="Superfast Delivery"
                  description="Get your order delivered to your doorstep at the earliest."
                />
                <Benefit
                  icon={<BadgePercent className="h-4 w-4 sm:h-4 sm:w-4 text-[#992A16]" />}
                  title="Best Prices & Offers"
                  description="Best price destination with offers directly from manufacturers."
                />
              </div>
            </div>
          </aside>
        </div>

        {/* Product Details Section (Full Width) */}
        <div className="mt-4 sm:mt-8 bg-white rounded-xl border border-gray-200 p-3.5 sm:p-5 shadow-sm">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-[#992A16] rounded-full"></span>
            Product Description
          </h2>

          <div className="space-y-6 text-sm sm:text-base leading-relaxed text-gray-700">
            {product.description && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
            )}
            
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]: any) => (
                    <div key={key} className="flex flex-col sm:flex-row sm:justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 gap-1 sm:gap-4">
                      <span className="text-gray-600 capitalize font-medium">{key}</span>
                      <span className="text-gray-900 font-semibold sm:text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {product.category && (
              <div>
                <span className="font-semibold text-gray-900">Category: </span>
                <span className="text-gray-600">{product.category.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* You May Also Like - Full Width */}
      <div className="mt-8 mb-8 sm:mt-12 sm:mb-12">
        <YouMayAlsoLike />
      </div>
      <div className="mt-8 mb-8 sm:mt-12 sm:mb-12">
        <NewProduct />
      </div>
    </div>
  );
}

function Benefit({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-2.5 sm:gap-3">
      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-amber-50 shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-xs sm:text-sm font-semibold text-gray-900">{title}</div>
        <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-sm leading-relaxed text-gray-600">{description}</p>
      </div>
    </div>
  );
}
