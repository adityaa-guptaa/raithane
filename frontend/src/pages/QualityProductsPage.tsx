import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: { secure_url: string };
  brand?: string;
  isOrganic?: boolean;
  specifications?: Record<string, string>;
  discount?: number;
}

const QualityProductsPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/products?limit=12`
      );
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product._id);
    toast.success("Added to cart!");
  };

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-[#992A16] to-[#be3c25] text-white py-12 lg:py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl lg:text-6xl font-extrabold mb-4">
            Best Quality Products
          </h1>
          <p className="text-lg lg:text-2xl mb-6 opacity-90">
            We provide you the best quality products
          </p>
          <p className="text-base lg:text-lg mb-8 opacity-80 max-w-2xl mx-auto">
            Only this week. Don't miss out on our selection of premium quality products at unbeatable prices!
          </p>
          <button
            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
            className="inline-flex items-center gap-2 bg-white text-[#992A16] font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition text-lg"
          >
            Shop Now
            <span className="text-2xl">→</span>
          </button>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12 lg:py-20">
        <div className="mb-8">
          <h2 className="text-2xl lg:text-4xl font-bold text-gray-800 mb-2">
            Quality Products
          </h2>
          <p className="text-gray-600">Handpicked premium quality products</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#992A16]"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group"
              >
                {/* Image Container */}
                <div
                  className="relative overflow-hidden bg-gray-100 h-48 sm:h-56 cursor-pointer"
                  onClick={() => handleProductClick(product._id)}
                >
                  <img
                    src={product.image?.secure_url || ""}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                  {(product.discount ?? 0) > 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {product.discount}% OFF
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4">
                  {/* Product Name with Organic Badge */}
                  <div className="flex items-center gap-2 mb-2">
                    <h3
                      className="font-bold text-sm sm:text-base text-gray-800 line-clamp-2 cursor-pointer hover:text-[#992A16]"
                      onClick={() => handleProductClick(product._id)}
                    >
                      {product.name}
                    </h3>
                    {product.isOrganic && (
                      <span className="bg-green-100 text-green-800 text-[6px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                        Organic
                      </span>
                    )}
                  </div>

                  {/* Brand */}
                  {product.brand && (
                    <span className="text-[8px] sm:text-xs text-gray-600 font-medium block mb-2 truncate">
                      {product.brand}
                    </span>
                  )}

                  {/* Specifications Preview */}
                  {product.specifications && Object.keys(product.specifications).length > 0 && (
                    <div className="mb-2">
                      {Object.entries(product.specifications)
                        .slice(0, 2)
                        .map(([key, value]) => (
                          <p key={key} className="text-[7px] sm:text-[10px] text-gray-500">
                            {key}: {value}
                          </p>
                        ))}
                    </div>
                  )}

                  {/* Price */}
                  <div className="mb-3">
                    <span className="text-base sm:text-lg font-bold text-[#992A16]">
                      Rs. {product.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-[#992A16] hover:bg-[#7a2112] text-white font-semibold py-2 rounded-lg text-sm transition"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleProductClick(product._id)}
                      className="flex-1 border border-[#992A16] text-[#992A16] hover:bg-[#f8f6f2] font-semibold py-2 rounded-lg text-sm transition"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-[#f8f6f2] py-12 lg:py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-[#2f1f4a] mb-6">
            Premium Quality Guaranteed!
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            All our products are carefully selected to ensure the highest quality for your family. Shop now and experience the difference!
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-2 bg-[#992A16] hover:bg-[#be3c25] text-white font-bold px-8 py-3 rounded-lg transition text-lg"
          >
            Shop Now
            <span className="text-2xl">→</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default QualityProductsPage;
