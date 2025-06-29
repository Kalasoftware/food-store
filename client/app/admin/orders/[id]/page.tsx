'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, Truck, MapPin, Phone, CreditCard, User, Mail } from 'lucide-react'
import { api } from '@/lib/api'
import { Order } from '@/types'
import toast from 'react-hot-toast'

const statusIcons = {
  pending: Clock,
  confirmed: CheckCircle,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle
}

const statusColors = {
  pending: 'text-yellow-600 bg-yellow-100',
  confirmed: 'text-blue-600 bg-blue-100',
  processing: 'text-purple-600 bg-purple-100',
  shipped: 'text-indigo-600 bg-indigo-100',
  delivered: 'text-green-600 bg-green-100',
  cancelled: 'text-red-600 bg-red-100'
}

export default function AdminOrderDetailsPage() {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    if (params.id) {
      fetchOrderDetails(params.id as string)
    }
  }, [params.id])

  const fetchOrderDetails = async (orderId: string) => {
    try {
      setLoading(true)
      const response = await api.get(`/admin/orders/${orderId}`)
      setOrder(response.data.order)
    } catch (error) {
      console.error('Error fetching order details:', error)
      toast.error('Failed to fetch order details')
      router.push('/admin/orders')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (status: string) => {
    if (!order) return

    try {
      setUpdatingStatus(true)
      await api.put(`/admin/orders/${order.id}/status`, { status })
      toast.success('Order status updated successfully')
      fetchOrderDetails(order.id.toString())
    } catch (error) {
      console.error('Error updating order status:', error)
      toast.error('Failed to update order status')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const updatePaymentStatus = async (paymentStatus: string) => {
    if (!order) return

    try {
      await api.put(`/orders/${order.id}/payment-status`, { paymentStatus })
      toast.success('Payment status updated successfully')
      fetchOrderDetails(order.id.toString())
    } catch (error) {
      console.error('Error updating payment status:', error)
      toast.error('Failed to update payment status')
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-300 rounded w-1/4 mb-8"></div>
        <div className="card p-6 mb-6">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h1>
        <button onClick={() => router.back()} className="btn-primary">
          Go Back
        </button>
      </div>
    )
  }

  const StatusIcon = statusIcons[order.status as keyof typeof statusIcons]
  const statusColorClass = statusColors[order.status as keyof typeof statusColors]

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Orders</span>
      </button>

      {/* Order Header */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order #{order.id}
            </h1>
            <p className="text-gray-600">
              Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium ${statusColorClass}`}>
              <StatusIcon className="w-4 h-4" />
              <span className="capitalize">{order.status}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mb-6">
          <select
            value={order.status}
            onChange={(e) => updateOrderStatus(e.target.value)}
            disabled={updatingStatus}
            className="form-input"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={order.payment_status}
            onChange={(e) => updatePaymentStatus(e.target.value)}
            className="form-input"
          >
            <option value="pending">Payment Pending</option>
            <option value="completed">Payment Completed</option>
            <option value="failed">Payment Failed</option>
          </select>
        </div>

        {/* Order Status Timeline */}
        <div className="border-t pt-6">
          <h3 className="font-semibold text-gray-900 mb-4">Order Progress</h3>
          <div className="flex items-center justify-between">
            {['pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((status, index) => {
              const isActive = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'].indexOf(order.status) >= index
              const isCurrentStatus = order.status === status
              
              return (
                <div key={status} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isActive 
                      ? isCurrentStatus 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    {isActive && !isCurrentStatus ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <div className="w-3 h-3 bg-current rounded-full"></div>
                    )}
                  </div>
                  <span className={`text-xs mt-2 capitalize ${
                    isActive ? 'text-gray-900 font-medium' : 'text-gray-400'
                  }`}>
                    {status}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
            
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <Image
                        src={`http://localhost:5000${item.image}`}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-2xl">🍽️</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-gray-600">₹{item.price.toFixed(2)} each</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ₹{(item.quantity * item.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              )) || (
                <p className="text-gray-500 text-center py-4">No items found</p>
              )}
            </div>
          </div>
        </div>

        {/* Order Details Sidebar */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">{order.customer_name}</p>
                  <p className="text-sm text-gray-600">Customer</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">{order.customer_email}</p>
                  <p className="text-sm text-gray-600">Email</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">{order.phone}</p>
                  <p className="text-sm text-gray-600">Phone</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{order.total_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>₹{order.total_amount.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center space-x-2 mb-2">
                <CreditCard className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Payment Status</span>
              </div>
              <p className={`font-medium ${
                order.payment_status === 'completed' 
                  ? 'text-green-600' 
                  : order.payment_status === 'failed'
                  ? 'text-red-600'
                  : 'text-yellow-600'
              }`}>
                {order.payment_status === 'completed' ? 'Paid' : 
                 order.payment_status === 'failed' ? 'Failed' : 'Pending'}
              </p>
            </div>

            {/* QR Code for pending payments */}
            {order.payment_status === 'pending' && order.qr_code && (
              <div className="mt-4 pt-4 border-t text-center">
                <h3 className="font-medium text-gray-900 mb-2">Payment QR Code</h3>
                <div className="bg-white p-4 rounded-lg border inline-block">
                  <Image
                    src={order.qr_code}
                    alt="Payment QR Code"
                    width={150}
                    height={150}
                    className="mx-auto"
                  />
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Customer can scan to pay
                </p>
              </div>
            )}
          </div>

          {/* Delivery Information */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Delivery Address</p>
                  <p className="text-gray-600">{order.delivery_address}</p>
                </div>
              </div>
              
              {order.notes && (
                <div className="flex items-start space-x-3">
                  <Package className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Special Instructions</p>
                    <p className="text-gray-600">{order.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
