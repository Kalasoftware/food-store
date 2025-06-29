'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Upload, X } from 'lucide-react'
import Image from 'next/image'
import { api } from '@/lib/api'
import { Category, Product } from '@/types'
import toast from 'react-hot-toast'

interface ProductForm {
  name: string
  description: string
  price: number
  category_id: number
  stock_quantity: number
  weight?: string
  expiry_date?: string
  brand?: string
  is_active: boolean
}

export default function EditProductPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetchingProduct, setFetchingProduct] = useState(true)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  const params = useParams()
  const router = useRouter()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<ProductForm>()

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string)
      fetchCategories()
    }
  }, [params.id])

  const fetchProduct = async (productId: string) => {
    try {
      const response = await api.get(`/products/${productId}`)
      const productData = response.data.product
      setProduct(productData)
      
      // Set form values
      setValue('name', productData.name)
      setValue('description', productData.description || '')
      setValue('price', productData.price)
      setValue('category_id', productData.category_id)
      setValue('stock_quantity', productData.stock_quantity)
      setValue('weight', productData.weight || '')
      setValue('expiry_date', productData.expiry_date ? productData.expiry_date.split('T')[0] : '')
      setValue('brand', productData.brand || '')
      setValue('is_active', productData.is_active)

      if (productData.image) {
        setImagePreview(`http://localhost:5000${productData.image}`)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Failed to fetch product details')
      router.push('/admin/products')
    } finally {
      setFetchingProduct(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await api.get('/admin/categories')
      setCategories(response.data.categories)
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to fetch categories')
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB')
        return
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file')
        return
      }

      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null

    try {
      setUploadingImage(true)
      const formData = new FormData()
      formData.append('image', imageFile)

      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      return response.data.imageUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
      return null
    } finally {
      setUploadingImage(false)
    }
  }

  const onSubmit = async (data: ProductForm) => {
    if (!product) return

    setLoading(true)
    try {
      let imageUrl = product.image
      
      if (imageFile) {
        const newImageUrl = await uploadImage()
        if (newImageUrl) {
          imageUrl = newImageUrl
        } else {
          setLoading(false)
          return
        }
      }

      const productData = {
        ...data,
        image: imageUrl,
        price: parseFloat(data.price.toString()),
        stock_quantity: parseInt(data.stock_quantity.toString()),
        category_id: parseInt(data.category_id.toString())
      }

      await api.put(`/admin/products/${product.id}`, productData)
      toast.success('Product updated successfully!')
      router.push('/admin/products')
    } catch (error: any) {
      console.error('Error updating product:', error)
      const message = error.response?.data?.message || 'Failed to update product'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  if (fetchingProduct) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
              <div className="space-y-4">
                <div className="h-10 bg-gray-300 rounded"></div>
                <div className="h-20 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="card p-6">
              <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
              <div className="h-64 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
        <button onClick={() => router.back()} className="btn-primary">
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600 mt-2">Update product information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Product Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="form-label">Product Name *</label>
                  <input
                    {...register('name', { required: 'Product name is required' })}
                    type="text"
                    className="form-input"
                    placeholder="Enter product name"
                  />
                  {errors.name && (
                    <p className="form-error">{errors.name.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="form-label">Description</label>
                  <textarea
                    {...register('description')}
                    className="form-input min-h-[100px] resize-none"
                    placeholder="Enter product description"
                  />
                </div>

                <div>
                  <label className="form-label">Category *</label>
                  <select
                    {...register('category_id', { required: 'Category is required' })}
                    className="form-input"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && (
                    <p className="form-error">{errors.category_id.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Brand</label>
                  <input
                    {...register('brand')}
                    type="text"
                    className="form-input"
                    placeholder="Enter brand name"
                  />
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Pricing & Inventory</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="form-label">Price (₹) *</label>
                  <input
                    {...register('price', { 
                      required: 'Price is required',
                      min: { value: 0.01, message: 'Price must be greater than 0' }
                    })}
                    type="number"
                    step="0.01"
                    className="form-input"
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <p className="form-error">{errors.price.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Stock Quantity *</label>
                  <input
                    {...register('stock_quantity', { 
                      required: 'Stock quantity is required',
                      min: { value: 0, message: 'Stock cannot be negative' }
                    })}
                    type="number"
                    className="form-input"
                    placeholder="0"
                  />
                  {errors.stock_quantity && (
                    <p className="form-error">{errors.stock_quantity.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Weight/Size</label>
                  <input
                    {...register('weight')}
                    type="text"
                    className="form-input"
                    placeholder="e.g., 500g, 1kg, 250ml"
                  />
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Expiry Date</label>
                  <input
                    {...register('expiry_date')}
                    type="date"
                    className="form-input"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    {...register('is_active')}
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Product is active and visible to customers
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Product Image */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Image</h2>
              
              <div className="space-y-4">
                {imagePreview ? (
                  <div className="relative">
                    <Image
                      src={imagePreview}
                      alt="Product preview"
                      width={300}
                      height={300}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Upload product image</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                
                <label
                  htmlFor="image-upload"
                  className="btn-secondary w-full cursor-pointer text-center"
                >
                  {imagePreview ? 'Change Image' : 'Choose Image'}
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-4">
              <button
                type="submit"
                disabled={loading || uploadingImage}
                className="btn-primary w-full"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="loading-spinner mr-2"></div>
                    {uploadingImage ? 'Uploading Image...' : 'Updating Product...'}
                  </div>
                ) : (
                  'Update Product'
                )}
              </button>
              
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-secondary w-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
