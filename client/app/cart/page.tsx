'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, ShoppingBag, AlertCircle, TrendingUp } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import QuantitySelector from '@/components/QuantitySelector'

export default function CartPage() {
  const [loading, setLoading] = useState(true)
  const [deliveryFee, setDeliveryFee] = useState(50)
  const [finalTotal, setFinalTotal] = useState(0)
  const router = useRouter()
  
  const { items, totalAmount, fetchCart, updateQuantity, removeFromCart, clearCart, updatingItems } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }
    
    const loadCart = async () => {
      await fetchCart()
      setLoading(false)
    }
    
    loadCart()
  }, [isAuthenticated, fetchCart, router])

  // Calculate delivery fee and final total
  useEffect(() => {
    const newDeliveryFee = totalAmount >= 500 ? 0 : 50
    setDeliveryFee(newDeliveryFee)
    setFinalTotal(totalAmount + newDeliveryFee)
  }, [totalAmount])

  const handleQuantityChange = async (cartId: number, newQuantity: number) => {
    if (newQuantity < 1) return
    await updateQuantity(cartId, newQuantity)
  }

  const handleRemoveItem = async (cartId: number) => {
    if (window.confirm('Remove this item from your cart?')) {
      await removeFromCart(cartId)
    }
  }

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart()
    }
  }

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-6 mb-4">
              <div className="flex space-x-4">
                <div className="w-20 h-20 bg-gray-300 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="text-6xl mb-6">🛒</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link href="/products" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-1">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
        </div>
        <button
          onClick={handleClearCart}
          className="text-red-600 hover:text-red-700 font-medium hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => {
              const isUpdating = updatingItems.has(item.id)
              
              return (
                <div key={item.id} className={`card p-6 transition-all ${isUpdating ? 'opacity-75' : ''}`}>
                  <div className="flex items-start space-x-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <Image
                          src={`http://localhost:5000${item.image}`}
                          alt={item.name}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <span className="text-gray-400 text-2xl">📦</span>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-2 text-lg">{item.name}</h3>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        {/* Quantity Selector */}
                        <div className="flex-shrink-0">
                          <QuantitySelector
                            quantity={item.quantity}
                            maxQuantity={item.stock_quantity}
                            price={item.price}
                            onQuantityChange={(newQuantity) => handleQuantityChange(item.id, newQuantity)}
                            size="md"
                            showTotal={true}
                            showPrice={true}
                            loading={isUpdating}
                          />
                        </div>

                        {/* Remove Button */}
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">
                              ₹{(item.quantity * item.price).toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-500">
                              Item Total
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      {/* Stock Warning */}
                      {item.quantity >= item.stock_quantity && (
                        <div className="mt-2 flex items-center space-x-2 text-amber-600">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm">Maximum quantity reached</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            {/* Live Calculation Display */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})</span>
                <span className="font-medium">₹{totalAmount.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span className={`font-medium ${deliveryFee === 0 ? 'text-green-600' : ''}`}>
                  {deliveryFee === 0 ? 'Free' : `₹${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              
              <hr className="border-gray-200" />
              
              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Total</span>
                <span className="text-primary-600">₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Free Delivery Progress */}
            {totalAmount < 500 && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">
                    Almost there!
                  </span>
                </div>
                <p className="text-sm text-yellow-700 mb-3">
                  Add ₹{(500 - totalAmount).toFixed(2)} more for free delivery
                </p>
                <div className="w-full bg-yellow-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((totalAmount / 500) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Free Delivery Achieved */}
            {deliveryFee === 0 && totalAmount >= 500 && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <span className="text-sm font-medium text-green-800">
                    🎉 You've qualified for free delivery!
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href="/checkout"
                className="btn-primary w-full flex items-center justify-center space-x-2 py-3"
              >
                <ShoppingBag className="h-5 w-5" />
                <span>Proceed to Checkout</span>
              </Link>

              <Link
                href="/products"
                className="btn-secondary w-full text-center block py-3"
              >
                Continue Shopping
              </Link>
            </div>

            {/* Security Badge */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center space-x-2 text-xs text-gray-500">
                <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-xs">🔒</span>
                </div>
                <span>Secure checkout guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
