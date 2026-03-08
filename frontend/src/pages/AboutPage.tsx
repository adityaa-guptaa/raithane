import { Truck, ShieldCheck, Heart, Users, MapPin, Mail, Phone } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-[#992A16] text-white py-20 px-6 sm:px-12 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <h1 className="relative text-4xl sm:text-5xl font-extrabold mb-4">About Raithane</h1>
        <p className="relative text-lg sm:text-xl max-w-2xl mx-auto opacity-90">
          Connecting you with the purest organic products directly from local farmers.
        </p>
      </div>

      {/* Mission & Vision */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            At Raithane, we believe in the power of nature. Our mission is to bridge the gap between
            conscious consumers and local organic farmers. We are dedicated to providing fresh, chemical-free,
            and high-quality produce while ensuring fair trade practices that empower our farming communities.
          </p>
          <div className="flex gap-4">
            <div className="flex flex-col items-center p-4 bg-orange-50 rounded-lg w-1/3">
              <Users className="w-8 h-8 text-[#992A16] mb-2" />
              <span className="text-sm font-semibold text-gray-800">Community</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg w-1/3">
              <Heart className="w-8 h-8 text-green-600 mb-2" />
              <span className="text-sm font-semibold text-gray-800">Health</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg w-1/3">
              <ShieldCheck className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-sm font-semibold text-gray-800">Trust</span>
            </div>
          </div>
        </div>
        <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg">
           <img 
            src="https://images.unsplash.com/photo-1595855709915-d7b579717d5c?auto=format&fit=crop&q=80&w=1000" 
            alt="Farmers working" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
            <p className="text-white font-medium">Empowering Local Farmers</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Raithane?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Truck className="w-10 h-10 text-[#992A16]" />}
              title="Farm to Doorstep"
              desc="We ensure that the produce travels the shortest distance from the farm to your kitchen, retaining freshness."
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-10 h-10 text-[#992A16]" />}
              title="100% Organic & Certified"
              desc="Every product is rigorously checked and certified to be free from harmful chemicals and pesticides."
            />
            <FeatureCard 
              icon={<Heart className="w-10 h-10 text-[#992A16]" />}
              title="Fair Trade Practices"
              desc="We ensure our farmers get the best price for their hard work, fostering a sustainable ecosystem."
            />
          </div>
        </div>
      </section>

      {/* Store Info */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Visit Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-gray-700" />
            </div>
            <h3 className="font-semibold text-gray-900">Our Location</h3>
            <p className="text-gray-600 mt-2">Kathmandu, Nepal</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-gray-700" />
            </div>
            <h3 className="font-semibold text-gray-900">Email Us</h3>
            <p className="text-gray-600 mt-2">support@raithane.com</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-gray-700" />
            </div>
            <h3 className="font-semibold text-gray-900">Call Us</h3>
            <p className="text-gray-600 mt-2">+977-9800000000</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition text-center border border-gray-100">
      <div className="inline-block p-3 bg-red-50 rounded-full mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{desc}</p>
    </div>
  );
}
