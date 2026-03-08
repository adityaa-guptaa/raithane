import { Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images?: Array<{ secure_url: string; public_id?: string }> | any;
  category?: { name: string; slug: string };
  stock?: number;
  brand?: string;
  isOrganic?: boolean;
  specifications?: Record<string, string>;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  // Calculate original price if discount exists but originalPrice is not present directly
  const originalPrice = product.originalPrice 
    || (product.discount ? product.price / (1 - product.discount / 100) : product.price);

  return (
    <div
      className="border border-gray-200 rounded-xl p-3 relative hover:shadow-lg transition bg-white flex flex-col justify-between group h-full"
    >
      {/* Wishlist Button */}
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          addToWishlist(product._id);
        }}
        className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 active:scale-95 transition-transform"
      >
        <Heart 
          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
            isInWishlist(product._id) 
              ? 'fill-red-500 text-red-500' 
              : 'text-gray-400 hover:text-red-500'
          }`} 
        />
      </button>

      {/* Product Image */}
      <Link 
        to={`/products/${product._id}`}
        className="cursor-pointer mb-3 relative block group"
      >
        <img
          src={product.images?.[0]?.secure_url || '/placeholder.jpg'}
          alt={product.name}
          className="h-28 sm:h-40 w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Content Container */}
      <div className="flex flex-col flex-1">
        {/* Title */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <Link to={`/products/${product._id}`} className="w-full">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 leading-snug cursor-pointer hover:text-[#992A16] transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>
        
        {/* Tags/Brand */}
        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
          {product.isOrganic && (
            <span className="text-[10px] sm:text-xs font-medium px-1.5 py-0.5 rounded bg-green-100 text-green-700">
              Organic
            </span>
          )}
          {product.brand && (
            <span className="text-[10px] sm:text-xs text-gray-500 font-medium px-1.5 py-0.5 bg-gray-100 rounded">
              {product.brand}
            </span>
          )}
        </div>

        {/* Pricing & Add to Cart */}
        <div className="mt-auto pt-2">
          <div className="flex items-baseline gap-2 mb-3">
            {product.price > 0 ? (
              <>
                <span className="text-sm sm:text-base font-bold text-[#992A16]">
                  Rs. {product.price.toFixed(2)}
                </span>
                {originalPrice > product.price && (
                  <span className="text-xs text-gray-400 line-through">
                     Rs. {originalPrice.toFixed(2)}
                  </span>
                )}
              </>
            ) : (
              <span className="text-sm sm:text-base font-bold text-gray-500">Price not set</span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (product.stock === 0) return;
              if (!isInCart(product._id)) {
                addToCart(product._id, 1);
              }
            }}
            disabled={product.stock === 0}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg transition text-xs sm:text-sm font-semibold shadow-sm active:scale-95 ${
              isInCart(product._id)
                ? 'bg-green-600 text-white cursor-default'
                : product.stock === 0
                ? 'bg-gray-400 text-white shadow-none'
                : 'bg-[#992A16] text-white hover:bg-[#7a2112]'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {product.stock === 0 
              ? 'Out of Stock' 
              : isInCart(product._id) ? 'Added' : 'Add to Cart'
            }
          </button>
        </div>
      </div>
    </div>
  );
}
