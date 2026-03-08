import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, apiRequest } from '../config/api';
import { Package, Clock, CheckCircle, XCircle, Truck, MapPin, CreditCard } from 'lucide-react';

interface Order {
  _id: string;
  orderNumber: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
  items: {
    product: {
      _id: string;
      name: string;
      images: { secure_url: string }[];
    };
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'processing' | 'picked_up' | 'out_for_delivery' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: string;
  shippingAddress: {
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  deliveryPerson?: {
    name: string;
    phone: string;
  };
  createdAt: string;
  updatedAt: string;
}

const statusIcons = {
  pending: Clock,
  confirmed: CheckCircle,
  processing: Package,
  picked_up: Truck,
  out_for_delivery: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
};

const statusColors = {
  pending: 'text-yellow-600 bg-yellow-50',
  confirmed: 'text-blue-600 bg-blue-50',
  processing: 'text-purple-600 bg-purple-50',
  picked_up: 'text-indigo-600 bg-indigo-50',
  out_for_delivery: 'text-orange-600 bg-orange-50',
  delivered: 'text-green-600 bg-green-50',
  cancelled: 'text-red-600 bg-red-50',
};

const statusTimeline = ['pending', 'confirmed', 'processing', 'picked_up', 'out_for_delivery', 'delivered'];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await apiRequest(API_ENDPOINTS.ORDERS.GET_ORDER(id!));
      setOrder(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch order');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      await apiRequest(API_ENDPOINTS.ORDERS.CANCEL_ORDER(id!), {
        method: 'PUT',
      });
      fetchOrder();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel order');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'This order does not exist'}</p>
          <button
            onClick={() => navigate('/orders')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const StatusIcon = statusIcons[order.status];
  const currentStatusIndex = statusTimeline.indexOf(order.status);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/orders')}
          className="text-blue-600 hover:text-blue-700 mb-6 flex items-center gap-2"
        >
          ← Back to Orders
        </button>

        {/* Order Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-wrap justify-between items-start mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
              <p className="text-gray-600 mt-2">
                Placed on {new Date(order.createdAt).toLocaleString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className={`px-6 py-3 rounded-full flex items-center gap-2 ${statusColors[order.status]}`}>
                <StatusIcon className="w-5 h-5" />
                <span className="font-semibold text-lg capitalize">{order.status}</span>
              </div>
              {order.status === 'pending' || order.status === 'confirmed' ? (
                <button
                  onClick={handleCancelOrder}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Cancel Order
                </button>
              ) : null}
            </div>
          </div>

          {/* Order Timeline */}
          {order.status !== 'cancelled' && (
            <div className="mt-6">
              <div className="flex justify-between">
                {statusTimeline.map((status, index) => {
                  const Icon = statusIcons[status as keyof typeof statusIcons];
                  const isCompleted = index <= currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;

                  return (
                    <div key={status} className="flex flex-col items-center flex-1 relative">
                      {index > 0 && (
                        <div
                          className={`absolute top-5 -left-1/2 w-full h-0.5 ${
                            isCompleted ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                          style={{ zIndex: 0 }}
                        />
                      )}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 ${
                          isCompleted ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                        } ${isCurrent ? 'ring-4 ring-blue-200' : ''}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <p className={`mt-2 text-xs text-center capitalize ${
                        isCompleted ? 'text-blue-600 font-semibold' : 'text-gray-600'
                      }`}>
                        {status}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4 border-b last:border-b-0 pb-4 last:pb-0">
                    <img
                      src={item.product.images[0]?.secure_url || '/placeholder.jpg'}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                      <p className="text-gray-600 mt-1">Quantity: {item.quantity}</p>
                      <p className="text-gray-600">Price: Rs.{item.price} each</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        Rs.{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Person */}
            {order.deliveryPerson && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Delivery Person
                </h2>
                <div className="space-y-2">
                  <p className="text-gray-900">
                    <span className="font-medium">Name:</span> {order.deliveryPerson.name}
                  </p>
                  <p className="text-gray-900">
                    <span className="font-medium">Phone:</span> {order.deliveryPerson.phone}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs.{order.itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{order.shippingPrice === 0 ? 'FREE' : `Rs.${order.shippingPrice.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (18%)</span>
                  <span>Rs.{order.taxPrice.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>Rs.{order.totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <div className="border-t pt-4 space-y-2">
                <p className={`flex items-center gap-2 ${
                  order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  <CreditCard className="w-4 h-4" />
                  <span className="font-medium capitalize">Payment {order.paymentStatus}</span>
                </p>
                <p className="text-sm text-gray-600">Method: {order.paymentMethod.toUpperCase()}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Shipping Address
              </h2>
              <div className="text-gray-700 space-y-1">
                <p>{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                <p className="mt-3 pt-3 border-t">Phone: {order.shippingAddress.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
