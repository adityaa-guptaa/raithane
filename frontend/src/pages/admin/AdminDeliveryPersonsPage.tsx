import { useEffect, useState } from 'react';
import { API_ENDPOINTS, apiRequest } from '../../config/api';
import { User, Mail, Phone, Calendar, Plus, Check, X, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface DeliveryPerson {
  _id: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminDeliveryPersonsPage() {
  const [deliveryPersons, setDeliveryPersons] = useState<DeliveryPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  useEffect(() => {
    fetchDeliveryPersons();
  }, []);

  const fetchDeliveryPersons = async () => {
    try {
      const response = await apiRequest(API_ENDPOINTS.ADMIN.DELIVERY_PERSONS);
      setDeliveryPersons(response.data);
    } catch (err) {
      console.error('Failed to fetch delivery persons:', err);
      toast.error('Failed to load delivery persons');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDeliveryPerson = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setCreating(true);
    const toastId = toast.loading('Creating delivery person...');

    try {
      const response = await apiRequest(API_ENDPOINTS.ADMIN.CREATE_DELIVERY_PERSON, {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      toast.success(response.message || 'Delivery person created successfully', { id: toastId });
      setDeliveryPersons([response.data, ...deliveryPersons]);
      setShowCreateModal(false);
      setFormData({ name: '', email: '', phone: '', password: '' });
    } catch (err: any) {
      toast.error(err.message || 'Failed to create delivery person', { id: toastId });
    } finally {
      setCreating(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const toastId = toast.loading(`${currentStatus ? 'Deactivating' : 'Activating'} delivery person...`);

    try {
      const response = await apiRequest(API_ENDPOINTS.ADMIN.TOGGLE_DELIVERY_STATUS(id), {
        method: 'PATCH',
      });

      toast.success(response.message || 'Status updated successfully', { id: toastId });
      
      setDeliveryPersons(deliveryPersons.map(dp => 
        dp._id === id ? { ...dp, isActive: !currentStatus } : dp
      ));
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status', { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#992A16]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Truck className="w-8 h-8 text-[#992A16]" />
              Delivery Personnel
            </h1>
            <p className="text-gray-600 mt-2">Manage delivery team members</p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#992A16] hover:bg-[#7a2112] text-white"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Delivery Person
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Delivery Staff</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{deliveryPersons.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <User className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {deliveryPersons.filter(dp => dp.isActive).length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Check className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Inactive</p>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  {deliveryPersons.filter(dp => !dp.isActive).length}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <X className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Persons List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deliveryPersons.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      <Truck className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p className="text-lg">No delivery personnel yet</p>
                      <p className="text-sm mt-1">Click "Add Delivery Person" to create one</p>
                    </td>
                  </tr>
                ) : (
                  deliveryPersons.map((person) => (
                    <tr key={person._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-[#992A16] rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {person.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{person.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-900">
                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                            {person.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                            {person.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          person.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {person.isActive ? (
                            <>
                              <Check className="w-4 h-4 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <X className="w-4 h-4 mr-1" />
                              Inactive
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {new Date(person.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Button
                          onClick={() => handleToggleStatus(person._id, person.isActive)}
                          variant="outline"
                          size="sm"
                          className={person.isActive ? 'border-red-300 text-red-600 hover:bg-red-50' : 'border-green-300 text-green-600 hover:bg-green-50'}
                        >
                          {person.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Delivery Person Modal */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="sm:max-w-md">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Add Delivery Person
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Create a new delivery team member account
            </DialogDescription>

            <form onSubmit={handleCreateDeliveryPerson} className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <Input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-12"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <Input
                  type="email"
                  placeholder="e.g. john.doe@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-12"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <Input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="h-12"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <Input
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  className="h-12"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 6 characters. Share this with the delivery person securely.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ name: '', email: '', phone: '', password: '' });
                  }}
                  className="flex-1"
                  disabled={creating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={creating}
                  className="flex-1 bg-[#992A16] hover:bg-[#7a2112]"
                >
                  {creating ? 'Creating...' : 'Create Delivery Person'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
