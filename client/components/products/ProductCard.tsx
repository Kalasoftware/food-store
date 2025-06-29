'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Plus, Minus, Heart, Star, Eye } from 'lucide-react'
import { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  
  const { addToCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }

    setLoading(true)
    try {
      await addToCart(product.id, quantity)
      setQuantity(1)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const incrementQuantity = () => {
    if (quantity < product.stock_quantity) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
  }

  const isOutOfStock = product.stock_quantity === 0

  return (
    <div className="card card-interactive group overflow-hidden">
      {/* Product Image */}
      <div className="relative h-56 bg-gradient-to-br from-neutral-100 to-neutral-200 overflow-hidden">
        {product.image ? (
          <Image
            src={`http://localhost:5000${product.image}`}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200">
            <div className="text-center">
              <div className="text-5xl mb-3 opacity-60">🍽️</div>
              <span className="text-neutral-500 text-sm font-medium">No Image</span>
            </div>
          </div>
        )}
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 flex space-x-2">
            <Link
              href={`/products/${product.id}`}
              className="bg-white/90 backdrop-blur-sm text-neutral-800 p-3 rounded-xl hover:bg-white transition-all duration-200 shadow-soft"
            >
              <Eye className="w-4 h-4" />
            </Link>
            <button
              onClick={toggleWishlist}
              className={`p-3 rounded-xl transition-all duration-200 shadow-soft ${
                isWishlisted 
                  ? 'bg-accent-500 text-white' 
                  : 'bg-white/90 backdrop-blur-sm text-neutral-800 hover:bg-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
        
        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {isOutOfStock && (
            <span className="badge bg-accent-500 text-white shadow-soft">
              Out of Stock
            </span>
          )}
          
          {!isOutOfStock && product.stock_quantity <= 10 && (
            <span className="badge bg-yellow-500 text-white shadow-soft">
              Only {product.stock_quantity} left
            </span>
          )}
        </div>

        {/* Category Badge */}
        {product.category_name && (
          <div className="absolute top-3 right-3">
            <span className="badge bg-white/90 backdrop-blur-sm text-neutral-700 shadow-soft">
              {product.category_name}
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6">
        {/* Brand */}
        {product.brand && (
          <div className="mb-2">
            <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">
              {product.brand}
            </span>
          </div>
        )}
        
        {/* Product Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-display font-semibold text-neutral-900 mb-2 hover:text-primary-600 transition-colors line-clamp-2 min-h-[3rem] group-hover:text-primary-600">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        {product.description && (
          <p className="text-neutral-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
            {product.description}
          </p>
        )}

        {/* Rating (Mock) */}
        <div className="flex items-center space-x-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-neutral-300'}`} />
          ))}
          <span className="text-sm text-neutral-500 ml-2">(4.0)</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-price">
              ₹{product.price.toFixed(2)}
            </span>
            {product.weight && (
              <span className="text-sm text-neutral-500 ml-2 font-medium">
                per {product.weight}
              </span>
            )}
          </div>
        </div>

        {/* Stock Status */}
        <div className="flex items-center mb-6">
          {isOutOfStock ? (
            <div className="flex items-center text-accent-600">
              <div className="status-dot status-danger"></div>
              <span className="text-sm font-medium">Out of Stock</span>
            </div>
          ) : (
            <div className="flex items-center text-secondary-600">
              <div className="status-dot status-success"></div>
              <span className="text-sm font-medium">{product.stock_quantity} in stock</span>
            </div>
          )}
        </div>

        {/* Add to Cart Section */}
        {!isOutOfStock && (
          <div className="space-y-4">
            {/* Quantity Selector */}
            <div className="flex items-center justify-center">
              <div className="flex items-center bg-neutral-50 border border-neutral-200 rounded-xl overflow-hidden">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="p-3 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-6 py-3 font-semibold text-lg bg-white border-x border-neutral-200 min-w-[4rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock_quantity}
                  className="p-3 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={loading || isOutOfStock}
              className="btn-coral w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                <ShoppingCart className="h-5 w-5" />
              )}
              <span className="font-semibold">
                {loading ? 'Adding...' : 'Add to Cart'}
              </span>
            </button>
          </div>
        )}

        {/* Out of Stock Button */}
        {isOutOfStock && (
          <button
            disabled
            className="w-full bg-neutral-200 text-neutral-500 py-3 rounded-xl font-semibold cursor-not-allowed"
          >
            Out of Stock
          </button>
        )}
      </div>
    </div>
  )
}
