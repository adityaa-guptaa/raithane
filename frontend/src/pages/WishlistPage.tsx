import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const { wishlist, loading, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleRemove = async (productId: string) => {
    try {
      await removeFromWishlist(productId);
      toast.success('Removed from wishlist!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove item');
    }
  };

  const handleClearWishlist = async () => {
    if (window.confirm('Clear entire wishlist?')) {
      try {
        await clearWishlist();
        toast.success('Wishlist cleared!');
      } catch (error: any) {
        toast.error(error.message || 'Failed to clear wishlist');
      }
    }
  };

  const handleMoveToCart = async (productId: string) => {
    try {
      await addToCart(productId, 1);
      await removeFromWishlist(productId);
      toast.success('Moved to cart!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to move item to cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#992a16]"></div>
      </div>
    );
  }

  if (!wishlist || wishlist.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">Start adding items you love!</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-[#992a16] text-white px-6 py-3 rounded-md hover:bg-[#7a2112] transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600 mt-1">{wishlist.totalItems} items</p>
          </div>
          <button
            onClick={handleClearWishlist}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Clear Wishlist
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.items.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              {/* Product Image */}
              <div className="relative">
                <img
                  src={item.product.images?.[0]?.secure_url || '/placeholder.jpg'}
                  alt={item.product.name}
                  className="w-full h-48 object-contain cursor-pointer"
                  onClick={() => navigate(`/products/${item.product._id}`)}
                />
                <button
                  onClick={() => handleRemove(item.product._id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>

              {/* Product Details */}
              <div className="p-4">
                <h3 
                  className="text-lg font-semibold text-gray-900 mb-2 cursor-pointer hover:text-[#992a16] transition"
                  onClick={() => navigate(`/products/${item.product._id}`)}
                >
                  {item.product.name}
                </h3>
                
                <div className="flex items-center justify-between mb-3">
                  {item.product.price > 0 ? (
                    <span className="text-xl font-bold text-[#992a16]">
                      Rs. {item.product.price.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-xl font-bold text-gray-500">Price not set</span>
                  )}
                  {item.product.stock > 0 ? (
                    <span className="text-sm text-green-600 font-medium">In Stock</span>
                  ) : (
                    <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleMoveToCart(item.product._id)}
                    disabled={item.product.stock === 0}
                    className="w-full bg-[#992a16] text-white px-4 py-2 rounded-md hover:bg-[#7a2112] transition flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Move to Cart
                  </button>
                  
                  <button
                    onClick={() => navigate(`/products/${item.product._id}`)}
                    className="w-full border border-[#992a16] text-[#992a16] px-4 py-2 rounded-md hover:bg-[#992a16] hover:text-white transition"
                  >
                    View Details
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-3">
                  Added {new Date(item.addedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
