import React, { useMemo, useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Truck,
  BadgePercent,
  LayoutGrid,
  Heart,
} from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import YouMayAlsoLike from "../components/YouMayAlsoLike";
import NewProducts from "../components/NewProduct";

export default function ProductPageMock() {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  
  // Mock product ID for demo purposes
  const mockProductId = "mock-product-123";
  
  const images = useMemo(
    () => [
      {
        id: "img-3",
        src: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1400&q=80",
        alt: "Packshot placeholder 1",
      },
      {
        id: "img-4",
        src: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=1400&q=80",
        alt: "Packshot placeholder 2",
      },
      {
        id: "img-5",
        src: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=1400&q=80",
        alt: "Info card placeholder",
      },
      {
        id: "img-6",
        src: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=1400&q=80",
        alt: "Brand card placeholder",
      },
    ],
    []
  );

  const variants = useMemo(
    () => [
      {
        id: "v1",
        labelTop: "450 g",
        price: 185,
        oldPrice: null,
      },
      {
        id: "v2",
        labelTop: "2 x 450 g",
        price: 352,
        oldPrice: 370,
      },
    ],
    []
  );

  const [activeImageId, setActiveImageId] = useState(images[0].id);
  const [selectedVariantId, setSelectedVariantId] = useState(variants[0].id);

  const activeImage = images.find((i) => i.id === activeImageId) ?? images[0];
  const selectedVariant =
    variants.find((v) => v.id === selectedVariantId) ?? variants[0];

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      alert('Please login to add items to wishlist');
      return;
    }

    try {
      if (isInWishlist(mockProductId)) {
        await removeFromWishlist(mockProductId);
      } else {
        await addToWishlist(mockProductId);
      }
    } catch (error: any) {
      alert(error.message || 'Failed to update wishlist');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 lg:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.35fr_1fr]">
          {/* LEFT: Gallery */}
          <section>
            <div className="rounded-lg border border-gray-200 bg-white">
              <div className="p-4">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-gray-50">
                  <img
                    src={activeImage.src}
                    alt={activeImage.alt}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </div>

                {/* Thumbnails row */}
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex w-full items-center gap-3 overflow-x-auto pb-1">
                    {images.slice(0, 6).map((img) => {
                      const active = img.id === activeImageId;
                      return (
                        <button
                          key={img.id}
                          type="button"
                          onClick={() => setActiveImageId(img.id)}
                          className={[
                            "group relative h-16 w-16 flex-none overflow-hidden rounded-md border bg-gray-50",
                            active
                              ? "border-emerald-600 ring-2 ring-emerald-100"
                              : "border-gray-200 hover:border-gray-300",
                          ].join(" ")}
                          aria-label={`Select image: ${img.alt}`}
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

                  {/* Right arrow button (visual) */}
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50"
                    aria-label="Next thumbnails"
                    onClick={() => {
                      // Simple demo behavior: cycle image
                      const idx = images.findIndex((i) => i.id === activeImageId);
                      const next = images[(idx + 1) % images.length];
                      setActiveImageId(next.id);
                    }}
                  >
                    <ChevronRight className="h-5 w-5 text-gray-700" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold text-gray-900">
                Product Details
              </h2>

              <div className="mt-4 space-y-2 text-sm text-gray-800">
                <div>
                  <div className="font-medium text-gray-900">Fresh/Frozen</div>
                  <div className="text-gray-600">Fresh</div>
                </div>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-800"
                >
                  View more details
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>

          {/* RIGHT: Product meta */}
          <aside>
            {/* Breadcrumbs */}
            <nav className="text-sm text-gray-500">
              <ol className="flex flex-wrap items-center gap-1">
                <li className="hover:text-gray-700">Home</li>
                <li className="text-gray-300">/</li>
                <li className="hover:text-gray-700">Chicken</li>
                <li className="text-gray-300">/</li>
                <li className="text-gray-400">
                  Licious Chicken Curry Cut (Large - 7 to 11 Pcs)
                </li>
              </ol>
            </nav>

            <h1 className="mt-3 text-2xl font-semibold leading-snug text-gray-900">
              Licious Chicken Curry Cut (Large - 7 to 11 Pcs)
            </h1>

            {/* Select Unit */}
            <div className="mt-8">
              <div className="text-sm font-semibold text-gray-900">
                Select Unit
              </div>

              <div className="mt-3 flex gap-3">
                {variants.map((v) => {
                  const active = v.id === selectedVariantId;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariantId(v.id)}
                      className={[
                        "w-[132px] rounded-xl border p-3 text-left transition",
                        active
                          ? "border-emerald-600 ring-2 ring-emerald-100"
                          : "border-gray-200 hover:border-gray-300",
                      ].join(" ")}
                      aria-pressed={active}
                    >
                      <div className="text-sm font-semibold text-gray-900">
                        {v.labelTop}
                      </div>
                      <div className="mt-1 flex items-baseline gap-2">
                        <div className="text-base font-bold text-gray-900">
                          Rs.{v.price}
                        </div>
                        {v.oldPrice ? (
                          <div className="text-sm text-gray-400 line-through">
                            Rs.{v.oldPrice}
                          </div>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price + CTA row */}
            <div className="mt-8 flex items-start justify-between gap-6">
              <div>
                <div className="text-sm font-semibold text-gray-800">
                  {selectedVariant.labelTop}
                </div>
                <div className="mt-1 text-2xl font-bold text-gray-900">
                  Rs.{selectedVariant.price}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  (Inclusive of all taxes)
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  className="flex-1 h-12 rounded-lg bg-[#992A16] px-8 text-sm font-semibold text-white shadow-sm hover:bg-[#b83e29] active:bg-[#7a2313]"
                >
                  Add to cart
                </button>
                
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  className="h-12 w-12 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition"
                  aria-label="Toggle wishlist"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isInWishlist(mockProductId)
                        ? 'fill-[#992a16] text-[#992a16]'
                        : 'text-gray-600'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Why shop */}
            <div className="mt-12">
              <h3 className="text-lg font-semibold text-gray-900">
                Why shop from Raithane?
              </h3>

              <div className="mt-5 space-y-5">
                <Benefit
                  icon={<Truck className="h-5 w-5 text-gray-700" />}
                  title="Superfast Delivery"
                  description="Get your order delivered to your doorstep at the earliest from dark stores near you."
                />
                <Benefit
                  icon={<BadgePercent className="h-5 w-5 text-gray-700" />}
                  title="Best Prices & Offers"
                  description="Best price destination with offers directly from the manufacturers."
                />
                <Benefit
                  icon={<LayoutGrid className="h-5 w-5 text-gray-700" />}
                  title="Wide Assortment"
                  description="Choose from 5000+ products across food, personal care, household & other categories."
                />
              </div>
            </div>
          </aside>
        </div>
        
      </div>

      {/* You May Also Like - Full Width */}
      <div className="mt-12 mb-12"><YouMayAlsoLike /></div>
      <div className="mt-12 mb-12"> <NewProducts /> </div>
      
    </div>
    
  );
}

function Benefit({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
        {icon}
      </div>
      <div>
        <div className="text-sm font-semibold text-gray-900">{title}</div>
        <p className="mt-1 text-sm leading-relaxed text-gray-600">
          {description}
        </p>
      </div>
    </div>
  );
}