import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { apiRequest, API_ENDPOINTS } from '../../config/api';
import { ArrowLeft, Upload, X } from 'lucide-react';

interface CategoryForm {
  name: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
}

export default function AdminCategoryFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = id && id !== 'new';

  const [formData, setFormData] = useState<CategoryForm>({
    name: '',
    description: '',
    sortOrder: 0,
    isActive: true,
  });

  const [image, setImage] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchingCategory, setFetchingCategory] = useState(!!isEditMode);

  useEffect(() => {
    if (isEditMode && id) {
      fetchCategory(id);
    }
  }, [id, isEditMode]);

  const fetchCategory = async (categoryId: string) => {
    try {
      setFetchingCategory(true);
      const response = await apiRequest(API_ENDPOINTS.ADMIN.CATEGORY(categoryId));
      const category = response.data;
      setFormData({
        name: category.name,
        description: category.description || '',
        sortOrder: category.sortOrder || 0,
        isActive: category.isActive,
      });
      if (category.image?.secure_url) {
        setImagePreview(category.image.secure_url);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch category');
    } finally {
      setFetchingCategory(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImage(base64String);
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let categoryId = id;

      // Create or update category
      if (isEditMode) {
        await apiRequest(API_ENDPOINTS.ADMIN.CATEGORY(id!), {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
      } else {
        const response = await apiRequest(API_ENDPOINTS.ADMIN.CATEGORIES, {
          method: 'POST',
          body: JSON.stringify(formData),
        });
        categoryId = response.data._id;
      }

      // Upload image if provided
      if (image && categoryId) {
        await apiRequest(API_ENDPOINTS.ADMIN.CATEGORY_IMAGE(categoryId), {
          method: 'POST',
          body: JSON.stringify({ image }),
        });
      }

      toast.success(`Category ${isEditMode ? 'updated' : 'created'} successfully!`);
      navigate('/admin/categories');
    } catch (err: any) {
      setError(err.message || `Failed to ${isEditMode ? 'update' : 'create'} category`);
      toast.error(err.message || `Failed to ${isEditMode ? 'update' : 'create'} category`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  if (fetchingCategory) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#992A16] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading category...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/categories')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Categories
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Edit Category' : 'Create New Category'}
          </h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Category Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#992A16] focus:border-transparent"
              placeholder="e.g., Fruits & Vegetables"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#992A16] focus:border-transparent"
              placeholder="Brief description of the category"
            />
          </div>

          {/* Sort Order */}
          <div>
            <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-2">
              Sort Order
            </label>
            <input
              type="number"
              id="sortOrder"
              name="sortOrder"
              value={formData.sortOrder}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#992A16] focus:border-transparent"
              placeholder="0"
            />
            <p className="mt-1 text-sm text-gray-500">Lower numbers appear first</p>
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-[#992A16] focus:ring-[#992A16] border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
              Active (visible to customers)
            </label>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category Image</label>
            
            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Category preview"
                  className="w-48 h-48 object-cover rounded-lg border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage('');
                    setImagePreview('');
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <label
                  htmlFor="image"
                  className="cursor-pointer text-[#992A16] hover:text-[#7a2112] font-medium"
                >
                  Click to upload
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 5MB</p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#992A16] text-white px-6 py-3 rounded-lg hover:bg-[#7a2112] disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Saving...' : isEditMode ? 'Update Category' : 'Create Category'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/categories')}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
