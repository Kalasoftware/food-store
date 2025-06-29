'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import Image from 'next/image'
import { MapPin, Phone, CreditCard, QrCode, Calculator, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { api } from '@/lib/api'
import QuantitySelector from '@/components/QuantitySelector'

interface CheckoutForm {
  deliveryAddress: string
  phone: string
  notes?: string
}

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false)
  const [orderCreated, setOrderCreated] = useState(false)
  const [qrCode, setQrCode] = useState('')
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [deliveryFee, setDeliveryFee] = useState(50)
  const [finalTotal, setFinalTotal] = useState(0)
  
  const router = useRouter()
  const { items, totalAmount, fetchCart, clearCart, updateQuantity, updatingItems } = useCartStore()
  const { user, isAuthenticated } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<CheckoutForm>()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }

    fetchCart()

    // Pre-fill form with user data
    if (user?.address) {
      setValue('deliveryAddress', user.address)
    }
    if (user?.phone) {
      setValue('phone', user.phone)
    }
  }, [isAuthenticated, user, fetchCart, router, setValue])

  useEffect(() => {
    if (items.length === 0 && !orderCreated) {
      router.push('/cart')
    }
  }, [items, orderCreated, router])

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

  const onSubmit = async (data: CheckoutForm) => {
    setLoading(true)
    try {
      const response = await api.post('/orders/create', data)
      const { order } = response.data

      setOrderDetails(order)
      setQrCode(order.qrCode)
      setOrderCreated(true)
      
      toast.success('Order created successfully!')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create order'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  if (orderCreated && qrCode) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
            <p className="text-gray-600">
              Order ID: #{orderDetails?.id}
            </p>
          </div>

          <div className="card p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Scan QR Code to Pay</h2>
            <p className="text-gray-600 mb-6">
              Scan the QR code below with any UPI app to complete your payment
            </p>
            
            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <Image
                  src={qrCode}
                  alt="Payment QR Code"
                  width={200}
                  height={200}
                  className="mx-auto"
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Total Amount:</span>
                <span className="text-2xl font-bold text-primary-600">
                  ₹{finalTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="text-sm text-gray-600 mb-6">
              <p>• Open any UPI app (PhonePe, Google Pay, Paytm, etc.)</p>
              <p>• Scan the QR code above</p>
              <p>• Complete the payment</p>
              <p>• Your order will be confirmed automatically</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push('/orders')}
                className="btn-primary flex-1"
              >
                View My Orders
              </button>
              <button
                onClick={() => router.push('/')}
                className="btn-secondary flex-1"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Delivery Address */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Delivery Address
              </h2>
              
              <div>
                <label className="form-label">
                  Full Address *
                </label>
                <textarea
                  {...register('deliveryAddress', {
                    required: 'Delivery address is required'
                  })}
                  className="form-input min-h-[100px] resize-none"
                  placeholder="Enter your complete delivery address..."
                />
                {errors.deliveryAddress && (
                  <p className="form-error">{errors.deliveryAddress.message}</p>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                Contact Information
              </h2>
              
              <div>
                <label className="form-label">
                  Phone Number *
                </label>
                <input
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Please enter a valid 10-digit phone number'
                    }
                  })}
                  type="tel"
                  className="form-input"
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="form-error">{errors.phone.message}</p>
                )}
              </div>
            </div>

            {/* Order Notes */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Order Notes (Optional)
              </h2>
              
              <div>
                <textarea
                  {...register('notes')}
                  className="form-input min-h-[80px] resize-none"
                  placeholder="Any special instructions for delivery..."
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Method
              </h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <QrCode className="w-6 h-6 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-blue-900">UPI Payment</p>
                    <p className="text-sm text-blue-700">
                      Pay securely using any UPI app via QR code
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner mr-2"></div>
                  Creating Order...
                </div>
              ) : (
                `Place Order - ₹${finalTotal.toFixed(2)}`
              )}
            </button>
          </form>
        </div>

        {/* Order Summary with Live Updates */}
        <div>
          <div className="card p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Calculator className="w-5 h-5 mr-2" />
              Order Summary
            </h2>
            
            {/* Items with Quantity Controls */}
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {items.map((item) => {
                const isUpdating = updatingItems.has(item.id)
                
                return (
                  <div key={item.id} className={`border border-gray-200 rounded-lg p-4 transition-all ${isUpdating ? 'opacity-75' : ''}`}>
                    <div className="flex items-start space-x-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <Image
                            src={`http://localhost:5000${item.image}`}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <span className="text-gray-400 text-lg">📦</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm mb-2 truncate">{item.name}</h4>
                        
                        <div className="space-y-2">
                          <QuantitySelector
                            quantity={item.quantity}
                            maxQuantity={item.stock_quantity}
                            price={item.price}
                            onQuantityChange={(newQuantity) => handleQuantityChange(item.id, newQuantity)}
                            size="sm"
                            showTotal={true}
                            showPrice={false}
                            loading={isUpdating}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <hr className="mb-6" />

            {/* Live Totals */}
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
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
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
          </div>
        </div>
      </div>
    </div>
  )
}
