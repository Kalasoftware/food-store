'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, Plus, Minus, Star, Truck, Shield } from 'lucide-react'
import { Product } from '@/types'
import { api } from '@/lib/api'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'

export default function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)

  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string)
    }
  }, [params.id])

  const fetchProduct = async (id: string) => {
    try {
      setLoading(true)
      const response = await api.get(`/products/${id}`)
      setProduct(response.data.product)
    } catch (error) {
      console.error('Error fetching product:', error)
      router.push('/products')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }

    if (!product) return

    setAddingToCart(true)
    try {
      await addToCart(product.id, quantity)
      setQuantity(1)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setAddingToCart(false)
    }
  }

  const incrementQuantity = () => {
    if (product && quantity < product.stock_quantity) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="w-full h-96 bg-gray-300 rounded-lg"></div>
            <div>
              <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="h-6 bg-gray-300 rounded w-1/4 mb-6"></div>
              <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
        <Link href="/products" className="btn-primary">
          Back to Products
        </Link>
      </div>
    )
  }

  const isOutOfStock = product.stock_quantity === 0

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
        <Link href="/" className="hover:text-primary-600">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary-600">Products</Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <button
        onClick={() => router.back()}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="relative">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {product.image ? (
              <Image
                src={`http://localhost:5000${product.image}`}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-400 text-6xl">📦</span>
              </div>
            )}
          </div>

          {/* Stock Badge */}
          {isOutOfStock && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-lg font-medium">
              Out of Stock
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          {/* Category */}
          {product.category_name && (
            <div className="mb-2">
              <Link
                href={`/products?category=${product.category_id}`}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium uppercase tracking-wide"
              >
                {product.category_name}
              </Link>
            </div>
          )}

          {/* Product Name */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

          {/* Brand */}
          {product.brand && (
            <p className="text-gray-600 mb-4">
              Brand: <span className="font-medium">{product.brand}</span>
            </p>
          )}

          {/* Price */}
          <div className="mb-6">
            <span className="text-price text-4xl">
              ₹{product.price.toFixed(2)}
            </span>
            {product.weight && (
              <span className="text-lg text-neutral-600 ml-3 font-medium">/ {product.weight}</span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Stock Status */}
          <div className="mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-gray-700">Availability:</span>
              {isOutOfStock ? (
                <span className="text-red-600 font-medium">Out of Stock</span>
              ) : (
                <span className="text-green-600 font-medium">
                  {product.stock_quantity} in stock
                </span>
              )}
            </div>
          </div>

          {/* Quantity Selector and Add to Cart */}
          {!isOutOfStock && (
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-gray-700 font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-6 py-3 font-medium text-lg">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock_quantity}
                    className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addingToCart || isOutOfStock}
                className="btn-coral w-full py-4 text-lg flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingToCart ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <ShoppingCart className="h-6 w-6" />
                )}
                <span className="font-semibold">
                  {addingToCart ? 'Adding...' : 'Add to Cart'}
                </span>
              </button>
            </div>
          )}

          {/* Features */}
          <div className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Truck className="w-5 h-5 text-primary-600" />
                <span className="text-sm text-gray-700">Free delivery on orders above ₹500</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-primary-600" />
                <span className="text-sm text-gray-700">100% authentic products</span>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          {product.expiry_date && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Expiry Date:</strong> {new Date(product.expiry_date).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
