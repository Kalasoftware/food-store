'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Package, Clock, CheckCircle, XCircle, Truck, Eye } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { api } from '@/lib/api'
import { Order } from '@/types'

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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }

    fetchOrders()
  }, [isAuthenticated, currentPage, router])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/orders/my-orders?page=${currentPage}&limit=10`)
      setOrders(response.data.orders)
      setTotalPages(response.data.pagination.totalPages)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelOrder = async (orderId: number) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return
    }

    try {
      await api.put(`/orders/${orderId}/cancel`)
      fetchOrders()
    } catch (error: any) {
      console.error('Error cancelling order:', error)
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
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="text-6xl mb-6">📦</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">No orders yet</h1>
          <p className="text-gray-600 mb-8">
            You haven't placed any orders yet. Start shopping to see your orders here.
          </p>
          <Link href="/products" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <Link href="/products" className="btn-secondary">
          Continue Shopping
        </Link>
      </div>

      <div className="space-y-6">
        {orders.map((order) => {
          const StatusIcon = statusIcons[order.status as keyof typeof statusIcons]
          const statusColorClass = statusColors[order.status as keyof typeof statusColors]

          return (
            <div key={order.id} className="card p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900">
                      Order #{order.id}
                    </span>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${statusColorClass}`}>
                      <StatusIcon className="w-3 h-3" />
                      <span className="capitalize">{order.status}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Link
                    href={`/orders/${order.id}`}
                    className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </Link>
                  
                  {(order.status === 'pending' || order.status === 'confirmed') && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Order Date</p>
                  <p className="font-medium">
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600">Total Amount</p>
                  <p className="font-medium text-lg">₹{order.total_amount.toFixed(2)}</p>
                </div>

                <div>
                  <p className="text-gray-600">Payment Status</p>
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
              </div>

              {order.items && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-gray-600 text-sm mb-2">Items:</p>
                  <p className="text-gray-900">{order.items}</p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Delivery Address</p>
                    <p className="text-gray-900">{order.delivery_address}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p className="text-gray-900">{order.phone}</p>
                  </div>
                </div>
                
                {order.notes && (
                  <div className="mt-2">
                    <p className="text-gray-600">Notes</p>
                    <p className="text-gray-900">{order.notes}</p>
                  </div>
                )}
              </div>

              {/* Order Status Timeline */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  {['pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((status, index) => {
                    const isActive = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'].indexOf(order.status) >= index
                    const isCurrentStatus = order.status === status
                    
                    return (
                      <div key={status} className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isActive 
                            ? isCurrentStatus 
                              ? 'bg-primary-600 text-white' 
                              : 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-400'
                        }`}>
                          {isActive && !isCurrentStatus ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <div className="w-2 h-2 bg-current rounded-full"></div>
                          )}
                        </div>
                        <span className={`text-xs mt-1 capitalize ${
                          isActive ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {status}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 border rounded-lg ${
                  currentPage === i + 1
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
