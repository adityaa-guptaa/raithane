import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, apiRequest } from '../../config/api';
import { MapPin, Phone, Package, User, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

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
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
}

export default function DeliveryOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await apiRequest(API_ENDPOINTS.DELIVERY.GET_DELIVERY(id!));
      setOrder(response.data);
    } catch (err) {
      console.error('Failed to fetch order:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    const statusLabels: { [key: string]: string } = {
      picked_up: 'Picked Up',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Delivered'
    };
    
    const label = statusLabels[newStatus] || newStatus;
    
    if (!window.confirm(`Update order status to "${label}"?`)) return;

    setUpdating(true);
    const toastId = toast.loading('Updating order status...');
    
    try {
      await apiRequest(API_ENDPOINTS.DELIVERY.UPDATE_STATUS(id!), {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      
      toast.success(`Order marked as ${label}!`, { id: toastId });
      await fetchOrder();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status', { id: toastId });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
          <button
            onClick={() => navigate('/delivery/orders')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Deliveries
          </button>
        </div>
      </div>
    );
  }

  const canPickup = order.status === 'confirmed' || order.status === 'processing';
  const canMarkOutForDelivery = order.status === 'picked_up' || order.status === 'shipped';
  const canDeliver = order.status === 'out_for_delivery';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/delivery/orders')}
          className="text-blue-600 hover:text-blue-700 mb-6 flex items-center gap-2"
        >
          ← Back to Deliveries
        </button>

        {/* Order Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-wrap justify-between items-start gap-4">
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
            <span className={`px-6 py-3 rounded-full text-lg font-semibold ${
              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
              order.status === 'out_for_delivery' || order.status === 'picked_up' || order.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
              order.status === 'processing' ? 'bg-purple-100 text-purple-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {order.status === 'confirmed' ? 'Ready for Pickup' :
               order.status === 'out_for_delivery' || order.status === 'picked_up' ? 'Out for Delivery' :
               order.status === 'shipped' ? 'Out for Delivery' :
               order.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer & Delivery Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Information
              </h2>
              <div className="space-y-2">
                <p className="text-gray-900">
                  <span className="font-medium">Name:</span> {order.user.name}
                </p>
                <p className="text-gray-900 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${order.user.phone}`} className="text-blue-600 hover:text-blue-700">
                    {order.user.phone}
                  </a>
                </p>
                <p className="text-gray-900">
                  <span className="font-medium">Email:</span> {order.user.email}
                </p>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Delivery Address
              </h2>
              <div className="text-gray-700 space-y-1">
                <p className="font-medium text-lg">{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Open in Maps
              </a>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Items
              </h2>
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
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
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
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Details
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="font-bold text-gray-900 text-xl">Rs.{order.totalPrice.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <p className="text-gray-600 mb-1">Payment Method</p>
                  <p className="font-medium text-gray-900">{order.paymentMethod}</p>
                </div>
                <div className="border-t pt-3">
                  <p className="text-gray-600 mb-1">Payment Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    order.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                    order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            {order.status !== 'delivered' && order.status !== 'cancelled' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Update Status</h2>
                <div className="space-y-3">
                  {canPickup && (
                    <button
                      onClick={() => handleUpdateStatus('picked_up')}
                      disabled={updating}
                      className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 font-semibold disabled:opacity-50 transition-colors"
                    >
                      {updating ? 'Updating...' : '📦 Mark as Picked Up'}
                    </button>
                  )}
                  
                  {canMarkOutForDelivery && (
                    <button
                      onClick={() => handleUpdateStatus('out_for_delivery')}
                      disabled={updating}
                      className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 font-semibold disabled:opacity-50 transition-colors"
                    >
                      {updating ? 'Updating...' : '🚚 Mark as Out for Delivery'}
                    </button>
                  )}
                  
                  {canDeliver && (
                    <button
                      onClick={() => handleUpdateStatus('delivered')}
                      disabled={updating}
                      className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 font-semibold disabled:opacity-50 transition-colors"
                    >
                      {updating ? 'Updating...' : '✓ Mark as Delivered'}
                    </button>
                  )}

                  {!canPickup && !canMarkOutForDelivery && !canDeliver && (
                    <div className="text-center py-4 text-gray-600">
                      {order.status === 'delivered' ? '✓ Order Delivered' : 'No actions available'}
                    </div>
                  )}
                  
                  {/* Current Status Info */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600 text-center">
                      Current Status: <span className="font-semibold">{order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Delivered Status */}
            {order.status === 'delivered' && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-green-900 mb-2">Delivery Complete!</h3>
                  <p className="text-green-700">This order has been successfully delivered.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
