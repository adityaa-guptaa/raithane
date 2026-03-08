import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { API_ENDPOINTS, apiRequest } from '../../config/api';
import { Filter, MapPin } from 'lucide-react';

interface Order {
  _id: string;
  orderNumber: string;
  user: {
    name: string;
    phone: string;
  };
  totalPrice: number;
  status: string;
  paymentMethod: string;
  shippingAddress: {
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: string;
}

export default function DeliveryOrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  useEffect(() => {
    const status = searchParams.get('status');
    if (status) {
      setStatusFilter(status);
    }
  }, [searchParams]);

  const fetchOrders = async () => {
    try {
      let url = API_ENDPOINTS.DELIVERY.MY_DELIVERIES;
      if (statusFilter !== 'all') {
        url += `?status=${statusFilter}`;
      }
      const response = await apiRequest(url);
      setOrders(response.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    if (status === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ status });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Deliveries</h1>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Deliveries</option>
              <option value="confirmed">Ready for Pickup</option>
              <option value="processing">Processing</option>
              <option value="picked_up">Picked Up</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex flex-wrap justify-between items-start mb-4 gap-4">
                  <div>
                    <Link
                      to={`/delivery/orders/${order._id}`}
                      className="text-xl font-bold text-blue-600 hover:text-blue-700"
                    >
                      Order #{order.orderNumber}
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'out_for_delivery' ? 'bg-indigo-100 text-indigo-800' :
                    order.status === 'picked_up' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'processing' ? 'bg-purple-100 text-purple-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status === 'confirmed' ? 'Ready for Pickup' :
                     order.status === 'out_for_delivery' ? 'Out for Delivery' :
                     order.status === 'picked_up' ? 'Picked Up' :
                     order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                  {/* Customer Info */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Customer</h3>
                    <p className="text-gray-700">{order.user.name}</p>
                    <p className="text-gray-600 text-sm">{order.user.phone}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Payment: {order.paymentMethod.toUpperCase()} - Rs.{order.totalPrice.toFixed(2)}
                    </p>
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Delivery Address
                    </h3>
                    <p className="text-gray-700">{order.shippingAddress.street}</p>
                    <p className="text-gray-700">
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <Link
                    to={`/delivery/orders/${order._id}`}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 text-center font-medium"
                  >
                    View Details
                  </Link>
                  {order.status !== 'delivered' && (
                    <Link
                      to={`/delivery/orders/${order._id}`}
                      className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-md hover:bg-blue-50 text-center font-medium"
                    >
                      Update Status
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {orders.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 text-lg">
              {statusFilter === 'all' 
                ? 'No deliveries assigned yet'
                : `No ${statusFilter} deliveries`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
