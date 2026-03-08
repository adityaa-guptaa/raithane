import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Truck, Clock } from 'lucide-react';

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);


  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/orders');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Success Animation */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          {/* Animated Success Icon */}
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
            <div className="relative bg-green-500 rounded-full p-6 animate-bounce">
              <CheckCircle className="w-16 h-16 text-white" strokeWidth={2.5} />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Order Placed Successfully! 🎉
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your order. We've received your order and will process it shortly.
          </p>

          {/* Order Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6 transform hover:scale-105 transition-transform">
              <div className="bg-blue-500 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Order Confirmed</h3>
              <p className="text-sm text-gray-600">Your order has been received and confirmed</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-6 transform hover:scale-105 transition-transform">
              <div className="bg-purple-500 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Processing</h3>
              <p className="text-sm text-gray-600">We're preparing your items for delivery</p>
            </div>

            <div className="bg-green-50 rounded-lg p-6 transform hover:scale-105 transition-transform">
              <div className="bg-green-500 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">On the Way</h3>
              <p className="text-sm text-gray-600">Your order will be delivered soon</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <button
              onClick={() => navigate('/orders')}
              className="bg-[#992a16] text-white px-8 py-3 rounded-lg hover:bg-[#bb3f29] font-semibold transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              View My Orders
            </button>
            <button
              onClick={() => navigate('/')}
              className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
            >
              Continue Shopping
            </button>
          </div>

          {/* Auto Redirect Notice */}
          <p className="text-sm text-gray-500">
            Redirecting to orders page in <span className="font-bold text-[#992a16]">{countdown}</span> seconds...
          </p>
        </div>

        {/* Additional Info */}
        <div className="mt-6 bg-white/80 backdrop-blur rounded-lg p-6 text-center">
          <p className="text-sm text-gray-600">
            📧 A confirmation email has been sent to your registered email address.
            <br />
            You can track your order status in the "My Orders" section.
          </p>
        </div>
      </div>
    </div>
  );
}
