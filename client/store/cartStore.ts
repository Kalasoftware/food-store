import { create } from 'zustand'
import { CartItem } from '@/types'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

interface CartState {
  items: CartItem[]
  totalAmount: number
  loading: boolean
  updatingItems: Set<number> // Track which items are being updated
  fetchCart: () => Promise<void>
  addToCart: (productId: number, quantity?: number) => Promise<void>
  updateQuantity: (cartId: number, quantity: number) => Promise<void>
  updateQuantityOptimistic: (cartId: number, quantity: number) => void
  removeFromCart: (cartId: number) => Promise<void>
  clearCart: () => Promise<void>
  calculateTotals: () => void
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  totalAmount: 0,
  loading: false,
  updatingItems: new Set(),

  calculateTotals: () => {
    const { items } = get()
    const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
    set({ totalAmount })
  },

  fetchCart: async () => {
    try {
      set({ loading: true })
      const response = await api.get('/products/cart/items')
      set({ 
        items: response.data.items,
        totalAmount: response.data.totalAmount,
        loading: false
      })
    } catch (error) {
      console.error('Error fetching cart:', error)
      set({ loading: false })
    }
  },

  addToCart: async (productId: number, quantity = 1) => {
    try {
      await api.post('/products/cart/add', { productId, quantity })
      toast.success('Item added to cart')
      get().fetchCart()
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to add item to cart'
      toast.error(message)
    }
  },

  updateQuantityOptimistic: (cartId: number, quantity: number) => {
    const { items } = get()
    const updatedItems = items.map(item => {
      if (item.id === cartId) {
        return {
          ...item,
          quantity,
          total_price: quantity * item.price
        }
      }
      return item
    })
    
    set({ items: updatedItems })
    get().calculateTotals()
  },

  updateQuantity: async (cartId: number, quantity: number) => {
    const { updatingItems } = get()
    
    // Prevent multiple simultaneous updates for the same item
    if (updatingItems.has(cartId)) return
    
    try {
      // Add to updating set
      set({ updatingItems: new Set([...updatingItems, cartId]) })
      
      // Optimistic update
      get().updateQuantityOptimistic(cartId, quantity)
      
      // API call
      await api.put(`/products/cart/${cartId}`, { quantity })
      
      // Remove from updating set
      const newUpdatingItems = new Set(updatingItems)
      newUpdatingItems.delete(cartId)
      set({ updatingItems: newUpdatingItems })
      
    } catch (error: any) {
      // Revert optimistic update on error
      get().fetchCart()
      
      const message = error.response?.data?.message || 'Failed to update quantity'
      toast.error(message)
      
      // Remove from updating set
      const newUpdatingItems = new Set(updatingItems)
      newUpdatingItems.delete(cartId)
      set({ updatingItems: newUpdatingItems })
    }
  },

  removeFromCart: async (cartId: number) => {
    try {
      // Optimistic update
      const { items } = get()
      const updatedItems = items.filter(item => item.id !== cartId)
      set({ items: updatedItems })
      get().calculateTotals()
      
      await api.delete(`/products/cart/${cartId}`)
      toast.success('Item removed from cart')
    } catch (error: any) {
      // Revert on error
      get().fetchCart()
      const message = error.response?.data?.message || 'Failed to remove item'
      toast.error(message)
    }
  },

  clearCart: async () => {
    try {
      await api.delete('/products/cart/clear/all')
      set({ items: [], totalAmount: 0 })
      toast.success('Cart cleared')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to clear cart'
      toast.error(message)
    }
  },
}))
