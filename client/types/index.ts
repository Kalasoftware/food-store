export interface User {
  id: number
  name: string
  email: string
  phone?: string
  address?: string
  role: 'customer' | 'admin'
  created_at: string
}

export interface Category {
  id: number
  name: string
  description?: string
  image?: string
  created_at: string
}

export interface Product {
  id: number
  name: string
  description?: string
  price: number
  category_id: number
  category_name?: string
  stock_quantity: number
  image?: string
  weight?: string
  expiry_date?: string
  brand?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: number
  user_id: number
  product_id: number
  quantity: number
  name: string
  price: number
  image?: string
  stock_quantity: number
  total_price: number
  created_at: string
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price: number
  name: string
  image?: string
}

export interface Order {
  id: number
  user_id: number
  total_amount: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: 'pending' | 'completed' | 'failed'
  payment_method: string
  delivery_address: string
  phone: string
  notes?: string
  qr_code?: string
  items?: OrderItem[]
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  created_at: string
  updated_at: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage?: number
  }
}

export interface AuthResponse {
  message: string
  token: string
  user: User
}

export interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  totalProducts: number
  totalCustomers: number
  recentOrders: Order[]
  lowStockProducts: Product[]
}
