import heroImage from "../assets/hero-product.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    title: "Get the best quality products at the lowest prices",
    description: "We have prepared special discounts for you on organic breakfast products.",
    price: "Rs.210.67",
    originalPrice: "Rs.590.99",
    badge: "Weekend Discount",
    bgColor: "#f8f6f2",
  },
  {
    title: "Fresh Organic Vegetables Delivered to Your Door",
    description: "Shop our premium selection of farm-fresh organic vegetables.",
    price: "Rs.150.00",
    originalPrice: "Rs.350.99",
    badge: "Fresh Delivery",
    bgColor: "#f5f3ed",
  },
  {
    title: "Premium Organic Fruits at Best Prices",
    description: "Handpicked organic fruits sourced directly from local farms.",
    price: "Rs.320.50",
    originalPrice: "Rs.650.00",
    badge: "Limited Time",
    bgColor: "#faf8f4",
  },
];

const HeroSection = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="w-full rounded-xl overflow-hidden relative h-auto">
      {/* Slides Container */}
      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0 relative"
              style={{ backgroundColor: slide.bgColor }}
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <img
                  src={heroImage}
                  alt="Organic product"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Content */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10 min-h-[300px] sm:min-h-[400px]">
                {/* Left Content */}
                <div className="space-y-3 sm:space-y-5 bg-white/80 backdrop-blur-md p-6 rounded-2xl lg:bg-transparent lg:backdrop-blur-none lg:p-0 shadow-sm lg:shadow-none max-w-lg lg:max-w-none mx-auto lg:mx-0">
                  <span className="inline-block bg-green-100 text-green-800 text-xs sm:text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    {slide.badge}
                  </span>

                  <h1 className="text-2xl sm:text-4xl lg:text-6xl font-extrabold text-[#2f1f4a] leading-tight">
                    {slide.title}
                  </h1>

                  <p className="text-sm sm:text-lg text-gray-700 lg:text-gray-600 max-w-md font-medium lg:font-normal">
                    {slide.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <button 
                      onClick={() => navigate('/weekly-offers')}
                      className="bg-[#992A16] hover:bg-[#be3c25] active:scale-95 transition-all text-white font-bold px-6 py-3 text-sm sm:text-base rounded-xl shadow-lg hover:shadow-xl"
                    >
                      Shop Now
                    </button>

                    <div className="flex items-center gap-2 bg-white/50 lg:bg-transparent px-3 py-1 rounded-lg">
                      <span className="text-xl sm:text-3xl font-bold text-[#992A16]">{slide.price}</span>
                      <span className="text-sm sm:text-lg text-gray-500 line-through decoration-red-500/50">{slide.originalPrice}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-500 font-medium italic">
                    * Limited time offer. While stocks last.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dot Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 shadow-sm ${
                currentSlide === index
                  ? "bg-[#992A16] w-6 sm:w-8"
                  : "bg-gray-300 hover:bg-gray-400 w-2 sm:w-3"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation Arrows (Hidden on very small screens to avoid clutter) */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className="hidden sm:flex absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 p-2 sm:p-3 rounded-full shadow-md hover:shadow-lg transition-all active:scale-95"
          aria-label="Previous slide"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="hidden sm:flex absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 p-2 sm:p-3 rounded-full shadow-md hover:shadow-lg transition-all active:scale-95"
          aria-label="Next slide"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default HeroSection;