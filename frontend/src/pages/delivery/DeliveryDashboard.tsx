import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS, apiRequest } from '../../config/api';
import { Package, TrendingUp, Clock, CheckCircle } from 'lucide-react';

interface Stats {
  totalAssigned: number;
  delivered: number;
  pending: number;
  inTransit: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  user: {
    name: string;
    phone: string;
  };
  totalPrice: number;
  status: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: string;
}

export default function DeliveryDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalAssigned: 0,
    delivered: 0,
    pending: 0,
    inTransit: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ordersResponse] = await Promise.all([
        apiRequest(API_ENDPOINTS.DELIVERY.MY_DELIVERIES),
      ]);

      const orders = ordersResponse.data;
      setRecentOrders(orders.slice(0, 5));

      // Calculate stats
      const stats = {
        totalAssigned: orders.length,
        delivered: orders.filter((o: Order) => o.status === 'delivered').length,
        pending: orders.filter((o: Order) => o.status === 'confirmed' || o.status === 'processing').length,
        inTransit: orders.filter((o: Order) => o.status === 'shipped').length,
      };
      setStats(stats);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Delivery Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Assigned</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAssigned}</p>
              </div>
              <Package className="w-10 h-10 text-blue-600" />
            </div>
            <div className="mt-4 text-sm text-gray-600">All time deliveries</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
              <Clock className="w-10 h-10 text-yellow-600" />
            </div>
            <div className="mt-4 text-sm text-yellow-600">Awaiting pickup</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Transit</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inTransit}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-indigo-600" />
            </div>
            <div className="mt-4 text-sm text-indigo-600">Out for delivery</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-gray-900">{stats.delivered}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <span>Successfully completed</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/delivery/orders?status=pending"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <Clock className="w-8 h-8 text-yellow-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">Pending Pickups</h3>
            <p className="text-sm text-gray-600 mt-1">View orders ready for pickup</p>
            <p className="text-2xl font-bold text-yellow-600 mt-3">{stats.pending}</p>
          </Link>

          <Link
            to="/delivery/orders?status=shipped"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <TrendingUp className="w-8 h-8 text-indigo-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">Out for Delivery</h3>
            <p className="text-sm text-gray-600 mt-1">View orders in transit</p>
            <p className="text-2xl font-bold text-indigo-600 mt-3">{stats.inTransit}</p>
          </Link>
        </div>

        {/* Recent Deliveries */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Recent Deliveries</h2>
            <Link to="/delivery/orders" className="text-blue-600 hover:text-blue-700 font-medium">
              View All →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/delivery/orders/${order._id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{order.user.name}</p>
                        <p className="text-sm text-gray-600">{order.user.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">
                        {order.shippingAddress.city}, {order.shippingAddress.state}
                      </p>
                      <p className="text-xs text-gray-600">{order.shippingAddress.zipCode}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-gray-900">Rs.{order.totalPrice.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {recentOrders.length === 0 && (
            <div className="text-center py-12 text-gray-600">No deliveries assigned yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
