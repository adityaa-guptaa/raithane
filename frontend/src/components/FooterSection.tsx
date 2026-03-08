import { Phone, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import playStore from "../assets/play.jpg";
import appStore from "../assets/app.jpg";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAuthModal } from "../context/AuthModalContext";

export default function Footer() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { openLogin } = useAuthModal();

  const handleOrderTracking = () => {
    if (isAuthenticated) {
      navigate('/orders');
    } else {
      openLogin();
    }
  };

  return (
    <footer className="bg-gray-50 border-t hidden lg:block">
      
      <div className="border-t" />

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12 grid grid-cols-2 lg:grid-cols-5 gap-x-4 gap-y-8">
        {/* Help */}
        <div>
          <h4 className="font-semibold mb-3">Do You Need Help ?</h4>
          <p className="text-sm text-gray-500 mb-4">
            We are here to assist you. Reach out to us through any of the following ways:
          </p>

          <div className="flex items-center gap-2 text-sm mb-2">
            <Phone className="w-4 h-4" />
            <span className="text-gray-500">Monday–Friday: 08am–9pm</span>
          </div>
          <p className="text-lg font-bold">+977 9851405837</p>

          <p className="mt-4 text-sm text-gray-500">Need help with your order?</p>
          <p className="font-medium">info@raithaneagri.com</p>
        </div>

        {/* Make Money */}
        <div>
          <h4 className="font-semibold mb-3">Make Money with Us</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link to="/sell" className="hover:text-[#992A16] transition-colors">Sell on Raithane</Link></li>
            <li><Link to="/sell-services" className="hover:text-[#992A16] transition-colors">Sell Your Services on Raithane</Link></li>
            <li><Link to="/business" className="hover:text-[#992A16] transition-colors">Sell on Raithane Business</Link></li>
            <li><Link to="/sell-apps" className="hover:text-[#992A16] transition-colors">Sell Your Apps on Raithane</Link></li>
            <li><Link to="/affiliate" className="hover:text-[#992A16] transition-colors">Become an Affiliate</Link></li>
            <li><Link to="/advertise" className="hover:text-[#992A16] transition-colors">Advertise Your Products</Link></li>
            <li><Link to="/publish" className="hover:text-[#992A16] transition-colors">Sell-Publish with Us</Link></li>
            <li><Link to="/vendor" className="hover:text-[#992A16] transition-colors">Become an Raithane Vendor</Link></li>
          </ul>
        </div>

        {/* Help You */}
        <div>
          <h4 className="font-semibold mb-3">Let Us Help You</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link to="/accessibility" className="hover:text-[#992A16] transition-colors">Accessibility Statement</Link></li>
            <li 
              onClick={handleOrderTracking}
              className="cursor-pointer hover:text-[#992A16] transition-colors"
            >
              Your Orders
            </li>
            <li><Link to="/returns" className="hover:text-[#992A16] transition-colors">Returns & Replacements</Link></li>
            <li><Link to="/shipping" className="hover:text-[#992A16] transition-colors">Shipping Rates & Policies</Link></li>
            <li><Link to="/refund-policy" className="hover:text-[#992A16] transition-colors">Refund and Returns Policy</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-[#992A16] transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-[#992A16] transition-colors">Terms and Conditions</Link></li>
            <li><Link to="/cookie-settings" className="hover:text-[#992A16] transition-colors">Cookie Settings</Link></li>
            <li><Link to="/help" className="hover:text-[#992A16] transition-colors">Help Center</Link></li>
          </ul>
        </div>

        {/* About */}
        <div>
          <h4 className="font-semibold mb-3">Get to Know Us</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link to="/about" className="hover:text-[#992A16] transition-colors">About Raithane Nepal</Link></li>
            <li><Link to="/contact" className="hover:text-[#992A16] transition-colors">Contact Us</Link></li>
            <li><Link to="/blog" className="hover:text-[#992A16] transition-colors">Our Blog</Link></li>
            <li><Link to="/careers" className="hover:text-[#992A16] transition-colors">Careers for Raithane</Link></li>
            <li><Link to="/investors" className="hover:text-[#992A16] transition-colors">Investor Relations</Link></li>
            <li><Link to="/reviews" className="hover:text-[#992A16] transition-colors">Customer reviews</Link></li>
            <li><Link to="/social-responsibility" className="hover:text-[#992A16] transition-colors">Social Responsibility</Link></li>
            <li><Link to="/locations" className="hover:text-[#992A16] transition-colors">Store Locations</Link></li>
          </ul>
        </div>

        {/* App */}
        <div>
          <h4 className="font-semibold mb-3">Download our app</h4>
          <div className="space-y-3">
            <img src={playStore} alt="Google Play" className="w-36" />
            <img src={appStore} alt="App Store" className="w-36" />
          </div>

          <p className="text-sm text-gray-500 mt-4">Follow us on social media:</p>
          <div className="flex gap-3 mt-2">
            <span className="w-9 h-9 bg-white border rounded flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition cursor-pointer">
              <Facebook className="w-4 h-4" />
            </span>
            <span className="w-9 h-9 bg-white border rounded flex items-center justify-center hover:bg-blue-50 hover:text-blue-400 transition cursor-pointer">
              <Twitter className="w-4 h-4" />
            </span>
            <span className="w-9 h-9 bg-white border rounded flex items-center justify-center hover:bg-pink-50 hover:text-pink-600 transition cursor-pointer">
              <Instagram className="w-4 h-4" />
            </span>
            <span className="w-9 h-9 bg-white border rounded flex items-center justify-center hover:bg-blue-50 hover:text-blue-700 transition cursor-pointer">
              <Linkedin className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>

      <div className="border-t" />

      {/* Bottom */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <p>
          Copyright 2025 © Raithane Agri Products Nepal. All right reserved.
        </p>
      </div>
    </footer>
  );
}
