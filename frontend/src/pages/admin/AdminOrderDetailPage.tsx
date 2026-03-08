import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, apiRequest } from '../../config/api';

interface Order {
  _id: string;
  orderNumber: string;
  user: {
    _id: string;
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
  status: string;
  paymentStatus: string;
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
    _id: string;
    name: string;
    phone: string;
  };
  createdAt: string;
}

interface DeliveryPerson {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [deliveryPersons, setDeliveryPersons] = useState<DeliveryPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDelivery, setSelectedDelivery] = useState('');

  useEffect(() => {
    if (id) {
      fetchOrder();
      fetchDeliveryPersons();
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await apiRequest(API_ENDPOINTS.ADMIN.GET_ORDER(id!));
      setOrder(response.data);
      setSelectedStatus(response.data.status);
      setSelectedDelivery(response.data.deliveryPerson?._id || '');
    } catch (err) {
      console.error('Failed to fetch order:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveryPersons = async () => {
    try {
      const response = await apiRequest(API_ENDPOINTS.ADMIN.GET_DELIVERY_PERSONS);
      setDeliveryPersons(response.data);
    } catch (err) {
      console.error('Failed to fetch delivery persons:', err);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      await apiRequest(API_ENDPOINTS.ADMIN.UPDATE_ORDER_STATUS(id!), {
        method: 'PUT',
        body: JSON.stringify({ status: selectedStatus }),
      });
      alert('Order status updated successfully');
      fetchOrder();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleAssignDelivery = async () => {
    if (!selectedDelivery) {
      alert('Please select a delivery person');
      return;
    }
    try {
      await apiRequest(API_ENDPOINTS.ADMIN.ASSIGN_DELIVERY(id!), {
        method: 'PUT',
        body: JSON.stringify({ deliveryPersonId: selectedDelivery }),
      });
      alert('Delivery person assigned successfully');
      fetchOrder();
    } catch (err: any) {
      alert(err.message || 'Failed to assign delivery person');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#992A16]"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
          <button
            onClick={() => navigate('/admin/orders')}
            className="bg-[#992A16] text-white px-6 py-2 rounded-md hover:bg-[#7a2112]"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/admin/orders')}
          className="text-[#992A16] hover:text-[#7a2112] mb-6 flex items-center gap-2"
        >
          ← Back to Orders
        </button>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order #{order.orderNumber}</h1>
          <p className="text-gray-600">
            Placed on {new Date(order.createdAt).toLocaleString('en-IN')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
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

            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Information</h2>
              <div className="space-y-2">
                <p className="text-gray-900"><span className="font-medium">Name:</span> {order.user.name}</p>
                <p className="text-gray-900"><span className="font-medium">Email:</span> {order.user.email}</p>
                <p className="text-gray-900"><span className="font-medium">Phone:</span> {order.user.phone}</p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Address</h2>
              <div className="text-gray-700 space-y-1">
                <p className="font-medium">{order.shippingAddress.name}</p>
                <p className="text-sm">{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items Price</span>
                  <span className="font-medium text-gray-900">Rs.{order.itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-gray-900">
                    {order.shippingPrice === 0 ? 'FREE' : `Rs.${order.shippingPrice.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (18%)</span>
                  <span className="font-medium text-gray-900">Rs.{order.taxPrice.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="text-gray-600 font-semibold">Total Amount</span>
                  <span className="font-bold text-gray-900 text-lg">Rs.{order.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status</span>
                  <span className={`font-medium ${
                    order.paymentStatus === 'paid' ? 'text-green-600' :
                    order.paymentStatus === 'failed' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="text-gray-900">{order.paymentMethod.toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Update Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Update Status</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="picked_up">Picked Up</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <button
                  onClick={handleUpdateStatus}
                  className="w-full bg-[#992A16] text-white py-2 rounded-md hover:bg-[#7a2112]"
                >
                  Update Status
                </button>
              </div>
            </div>

            {/* Assign Delivery */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Assign Delivery</h2>
              {order.deliveryPerson && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm font-medium text-green-800">Currently Assigned:</p>
                  <p className="text-green-900">{order.deliveryPerson.name}</p>
                  <p className="text-sm text-green-700">{order.deliveryPerson.phone}</p>
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Person
                  </label>
                  <select
                    value={selectedDelivery}
                    onChange={(e) => setSelectedDelivery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Delivery Person</option>
                    {deliveryPersons.map((person) => (
                      <option key={person._id} value={person._id}>
                        {person.name} - {person.phone}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleAssignDelivery}
                  className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
