import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS, apiRequest } from '../../config/api';
import { 
  Package, Users, ShoppingCart, Clock, 
  CheckCircle, AlertTriangle, Truck, Calendar, Activity
} from 'lucide-react';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalProducts: number;
  activeProducts: number;
  totalUsers: number;
  pendingOrders: number;
  todayOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  lowStockProducts: number;
  statusBreakdown: {
    pending: number;
    confirmed: number;
    processing: number;
    picked_up: number;
    out_for_delivery: number;
    delivered: number;
    cancelled: number;
  };
  recentOrders: {
    _id: string;
    orderNumber: string;
    user: { name: string; email: string; phone: string };
    totalPrice: number;
    status: string;
    deliveryPerson?: { name: string };
    createdAt: string;
  }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await apiRequest(API_ENDPOINTS.ADMIN.DASHBOARD_STATS);
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#992A16]"></div>
      </div>
    );
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-indigo-100 text-indigo-800',
    processing: 'bg-purple-100 text-purple-800',
    picked_up: 'bg-blue-100 text-blue-800',
    out_for_delivery: 'bg-orange-100 text-orange-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store today.</p>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <Link to="/admin/orders" className="block">
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-[#992A16] hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    Rs.{stats?.totalRevenue.toFixed(2) || '0.00'}
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    This month: Rs.{stats?.monthlyRevenue.toFixed(2) || '0.00'}
                  </p>
                </div>
                <div className="bg-gray-100 rounded-full p-3">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-600">₹</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Total Orders */}
          <Link to="/admin/orders" className="block">
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-[#992A16] hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalOrders || 0}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-500 text-sm">{stats?.pendingOrders || 0} pending</span>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-full p-3">
                  <ShoppingCart className="w-8 h-8 text-gray-600" />
                </div>
              </div>
            </div>
          </Link>

          {/* Total Products */}
          <Link to="/admin/products" className="block">
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-[#992A16] hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Products</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalProducts || 0}</p>
                  <p className="text-gray-500 text-sm mt-2">
                    {stats?.activeProducts || 0} active
                  </p>
                </div>
                <div className="bg-gray-100 rounded-full p-3">
                  <Package className="w-8 h-8 text-gray-600" />
                </div>
              </div>
            </div>
          </Link>

          {/* Total Users */}
          <Link to="/admin/customers" className="block">
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-[#992A16] hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Customers</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalUsers || 0}</p>
                  <p className="text-gray-500 text-sm mt-2">Registered users</p>
                </div>
                <div className="bg-gray-100 rounded-full p-3">
                  <Users className="w-8 h-8 text-gray-600" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Today's Stats & Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Today's Orders */}
          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-gray-400">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gray-100 rounded-lg p-3">
                <Calendar className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Today's Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.todayOrders || 0}</p>
              </div>
            </div>
            <Link to="/admin/orders" className="text-sm text-[#992A16] hover:text-[#7a2112] font-medium">
              View all orders →
            </Link>
          </div>

          {/* Delivered Orders */}
          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-gray-400">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gray-100 rounded-lg p-3">
                <CheckCircle className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Delivered Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.deliveredOrders || 0}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">All time deliveries</p>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-[#992A16]">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-50 rounded-lg p-3">
                <AlertTriangle className="w-6 h-6 text-[#992A16]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Low Stock Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.lowStockProducts || 0}</p>
              </div>
            </div>
            <Link to="/admin/products" className="text-sm text-[#992A16] hover:text-[#7a2112] font-medium">
              Manage inventory →
            </Link>
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Order Status Breakdown
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {Object.entries(stats?.statusBreakdown || {}).map(([status, count]) => (
                <div key={status} className="text-center">
                  <div className={`rounded-lg p-4 ${statusColors[status as keyof typeof statusColors]}`}>
                    <p className="text-2xl font-bold">{count}</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 capitalize">
                    {status.replace('_', ' ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            to="/admin/products/new"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow group border-l-4 border-[#992A16]"
          >
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 rounded-lg p-3 group-hover:bg-gray-200 transition-colors">
                <Package className="w-8 h-8 text-gray-700" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Add Product</h3>
                <p className="text-sm text-gray-600 mt-1">Create a new product listing</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/orders"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow group border-l-4 border-gray-400"
          >
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 rounded-lg p-3 group-hover:bg-gray-200 transition-colors">
                <ShoppingCart className="w-8 h-8 text-gray-700" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Manage Orders</h3>
                <p className="text-sm text-gray-600 mt-1">View and update order status</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/categories"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow group border-l-4 border-gray-400"
          >
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 rounded-lg p-3 group-hover:bg-gray-200 transition-colors">
                <Package className="w-8 h-8 text-gray-700" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
                <p className="text-sm text-gray-600 mt-1">Manage product categories</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/delivery-persons"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow group border-l-4 border-[#992A16]"
          >
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 rounded-lg p-3 group-hover:bg-gray-200 transition-colors">
                <Truck className="w-8 h-8 text-gray-700" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delivery Staff</h3>
                <p className="text-sm text-gray-600 mt-1">Manage delivery personnel</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-[#992A16] hover:text-[#7a2112] font-medium">
              View all →
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
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats?.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/admin/orders/${order._id}`}
                        className="text-[#992A16] hover:text-[#7a2112] font-medium"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{order.user.name}</p>
                        <p className="text-sm text-gray-600">{order.user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                      Rs.{order.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusColors[order.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.deliveryPerson ? (
                        <div className="flex items-center gap-1">
                          <Truck className="w-4 h-4" />
                          {order.deliveryPerson.name}
                        </div>
                      ) : (
                        <span className="text-gray-400">Not assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {stats?.recentOrders.length === 0 && (
            <div className="text-center py-12 text-gray-600">No orders yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
