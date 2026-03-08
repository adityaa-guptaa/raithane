import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API_ENDPOINTS, apiRequest } from '../../config/api';
import { Save, X } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
}

interface ProductForm {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  brand: string;
  specifications: { key: string; value: string }[];
  images: File[];
  existingImages: string[];
  isActive: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isOnSale: boolean;
  isOrganic: boolean;
}

export default function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id && id !== 'new';

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    brand: '',
    specifications: [{ key: '', value: '' }],
    images: [],
    existingImages: [],
    isActive: true,
    isFeatured: false,
    isTrending: false,
    isNewArrival: false,
    isBestSeller: false,
    isOnSale: false,
    isOrganic: false,
  });

  useEffect(() => {
    fetchCategories();
    if (isEditMode) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await apiRequest(API_ENDPOINTS.CATEGORIES.GET_ALL);
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await apiRequest(API_ENDPOINTS.PRODUCTS.GET_PRODUCT(id!));
      const product = response.data;
      
      // Convert specifications Map to array
      let specsArray = [{ key: '', value: '' }];
      if (product.specifications) {
        if (typeof product.specifications === 'object' && !(product.specifications instanceof Array)) {
          specsArray = Object.entries(product.specifications).map(([key, value]) => ({ key, value: String(value) }));
        } else if (Array.isArray(product.specifications)) {
          specsArray = product.specifications;
        }
        if (specsArray.length === 0) {
          specsArray = [{ key: '', value: '' }];
        }
      }
      
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        stock: product.stock.toString(),
        category: product.category._id,
        brand: product.brand || '',
        specifications: specsArray,
        images: [],
        existingImages: Array.isArray(product.images) ? product.images.map((img: any) => img.secure_url).filter(Boolean) : [],
        isActive: product.isActive,
        isFeatured: product.isFeatured || false,
        isTrending: product.isTrending || false,
        isNewArrival: product.isNewArrival || false,
        isBestSeller: product.isBestSeller || false,
        isOnSale: product.isOnSale || false,
        isOrganic: product.isOrganic || false,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch product');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSpecificationChange = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index][field] = value;
    setFormData({ ...formData, specifications: newSpecs });
  };

  const addSpecification = () => {
    setFormData({
      ...formData,
      specifications: [...formData.specifications, { key: '', value: '' }],
    });
  };

  const removeSpecification = (index: number) => {
    const newSpecs = formData.specifications.filter((_, i) => i !== index);
    setFormData({ ...formData, specifications: newSpecs });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData({ ...formData, images: [...formData.images, ...files] });
  };

  const removeNewImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const removeExistingImage = (index: number) => {
    const newExistingImages = formData.existingImages.filter((_, i) => i !== index);
    setFormData({ ...formData, existingImages: newExistingImages });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Convert new images to base64
      const uploadedImages = [];
      for (const file of formData.images) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
        });
        uploadedImages.push(base64);
      }

      // Combine existing images with newly uploaded ones
      const existingImagesFormatted = formData.existingImages.map(url => {
        // Extract public_id from existing images if possible, or leave empty
        return { secure_url: url, public_id: '' };
      });

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category,
        brand: formData.brand,
        specifications: formData.specifications.filter(spec => spec.key && spec.value),
        // Only include images if we're not in edit mode or if there are NO existing images
        // In edit mode, images are handled separately via the /images endpoint
        ...(isEditMode ? {} : { images: existingImagesFormatted }),
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        isTrending: formData.isTrending,
        isNewArrival: formData.isNewArrival,
        isBestSeller: formData.isBestSeller,
        isOnSale: formData.isOnSale,
        isOrganic: formData.isOrganic,
      };

      let savedProduct;
      if (isEditMode) {
        const response = await apiRequest(API_ENDPOINTS.ADMIN.UPDATE_PRODUCT(id!), {
          method: 'PUT',
          body: JSON.stringify(productData),
        });
        savedProduct = response.data;
      } else {
        const response = await apiRequest(API_ENDPOINTS.ADMIN.CREATE_PRODUCT, {
          method: 'POST',
          body: JSON.stringify(productData),
        });
        savedProduct = response.data;
      }

      // Upload new images if any
      if (uploadedImages.length > 0) {
        await apiRequest(API_ENDPOINTS.ADMIN.PRODUCT_IMAGES(savedProduct._id), {
          method: 'POST',
          body: JSON.stringify({ images: uploadedImages }),
        });
      }

      toast.success(isEditMode ? 'Product updated successfully!' : 'Product added successfully!');
      navigate('/admin/products');
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
      toast.error(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </h1>
          <button
            onClick={() => navigate('/admin/products')}
            className="text-gray-600 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#992A16] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#992A16] focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (Rs.) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#992A16] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#992A16] focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#992A16] focus:border-transparent"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#992A16] focus:border-transparent"
              />
            </div>
          </div>

          {/* Specifications */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Specifications
              </label>
              <button
                type="button"
                onClick={addSpecification}
                className="text-[#992A16] hover:text-[#7a2112] text-sm font-medium"
              >
                + Add
              </button>
            </div>
            <div className="space-y-2">
              {formData.specifications.map((spec, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Key (e.g., Weight)"
                    value={spec.key}
                    onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#992A16] focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g., 500g)"
                    value={spec.value}
                    onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#992A16] focus:border-transparent"
                  />
                  {formData.specifications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSpecification(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#992A16] focus:border-transparent"
            />
            
            {/* Existing Images */}
            {formData.existingImages.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Existing Images:</p>
                <div className="grid grid-cols-3 gap-4">
                  {formData.existingImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img src={image} alt={`Product ${index + 1}`} className="w-full h-32 object-cover rounded-md" />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* New Images Preview */}
            {formData.images.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">New Images to Upload:</p>
                <div className="grid grid-cols-3 gap-4">
                  {formData.images.map((file, index) => (
                    <div key={index} className="relative">
                      <img src={URL.createObjectURL(file)} alt={`New ${index + 1}`} className="w-full h-32 object-cover rounded-md" />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Type Checkboxes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Product Categories
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 text-[#992A16] rounded focus:ring-2 focus:ring-[#992A16]"
                />
                <span className="text-sm text-gray-700">All Products</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isTrending}
                  onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                  className="w-4 h-4 text-[#992A16] rounded focus:ring-2 focus:ring-[#992A16]"
                />
                <span className="text-sm text-gray-700">Trending Products</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isNewArrival}
                  onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                  className="w-4 h-4 text-[#992A16] rounded focus:ring-2 focus:ring-[#992A16]"
                />
                <span className="text-sm text-gray-700">New Arrivals</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isBestSeller}
                  onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                  className="w-4 h-4 text-[#992A16] rounded focus:ring-2 focus:ring-[#992A16]"
                />
                <span className="text-sm text-gray-700">Best Sellers</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isOnSale}
                  onChange={(e) => setFormData({ ...formData, isOnSale: e.target.checked })}
                  className="w-4 h-4 text-[#992A16] rounded focus:ring-2 focus:ring-[#992A16]"
                />
                <span className="text-sm text-gray-700">On Sale</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isOrganic}
                  onChange={(e) => setFormData({ ...formData, isOrganic: e.target.checked })}
                  className="w-4 h-4 text-[#992A16] rounded focus:ring-2 focus:ring-[#992A16]"
                />
                <span className="text-sm text-gray-700">Organic Products</span>
              </label>
            </div>
          </div>

          {/* Active Status */}
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-[#992A16] rounded focus:ring-2 focus:ring-[#992A16]"
              />
              <span className="text-sm font-medium text-gray-700">Active (Visible to customers)</span>
            </label>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#992A16] text-white py-3 rounded-md hover:bg-[#7a2112] font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
