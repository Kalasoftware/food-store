'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCart, User, Menu, X, Search, LogOut, Settings, Bell } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { items, fetchCart } = useCartStore()

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart()
    }
  }, [isAuthenticated, fetchCart])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
    setIsUserMenuOpen(false)
  }

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-xl shadow-large border-b border-primary-100/50' : 'bg-white/90 backdrop-blur-md'
    }`}>
      <div className="container-custom">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-coral rounded-3xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-medium hover:shadow-coral">
              <span className="text-white font-bold text-2xl">🍽️</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-display text-2xl font-bold bg-gradient-to-r from-primary-600 to-coral-600 bg-clip-text text-transparent">FoodStore</span>
              <div className="text-xs text-primary-500 font-semibold">Fresh & Premium</div>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search for delicious products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-gradient-to-r from-neutral-50 to-primary-50/30 border border-primary-200/50 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 focus:bg-white transition-all duration-300 placeholder-neutral-400 text-neutral-700"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <kbd className="px-2 py-1 text-xs font-semibold text-neutral-500 bg-neutral-200 border border-neutral-300 rounded">⌘K</kbd>
                </div>
              </div>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            <Link href="/products" className="px-5 py-3 text-neutral-700 hover:text-primary-600 font-semibold rounded-2xl hover:bg-primary-50 transition-all duration-300">
              Products
            </Link>
            <Link href="/categories" className="px-5 py-3 text-neutral-700 hover:text-primary-600 font-semibold rounded-2xl hover:bg-primary-50 transition-all duration-300">
              Categories
            </Link>
            
            {/* Cart */}
            <Link href="/cart" className="relative p-4 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 rounded-2xl transition-all duration-300 group">
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-coral text-white text-xs rounded-full h-7 w-7 flex items-center justify-center font-bold shadow-coral animate-pulse-soft">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 p-3 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 rounded-2xl transition-all duration-300"
                >
                  <div className="w-10 h-10 bg-gradient-coral rounded-2xl flex items-center justify-center shadow-soft">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-semibold">{user?.name}</span>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-72 bg-white rounded-3xl shadow-large border border-primary-100/50 py-3 animate-slide-up backdrop-blur-xl">
                    <div className="px-6 py-4 border-b border-primary-100/50">
                      <p className="font-semibold text-neutral-900">{user?.name}</p>
                      <p className="text-sm text-neutral-500">{user?.email}</p>
                    </div>
                    
                    <Link
                      href="/profile"
                      className="flex items-center px-6 py-4 text-neutral-700 hover:bg-primary-50 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="h-5 w-5 mr-3 text-primary-500" />
                      Profile Settings
                    </Link>
                    
                    <Link
                      href="/orders"
                      className="flex items-center px-6 py-4 text-neutral-700 hover:bg-primary-50 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <ShoppingCart className="h-5 w-5 mr-3 text-primary-500" />
                      My Orders
                    </Link>
                    
                    {user?.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="flex items-center px-6 py-4 text-neutral-700 hover:bg-primary-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="h-5 w-5 mr-3 text-primary-500" />
                        Admin Panel
                      </Link>
                    )}
                    
                    <hr className="my-2 border-primary-100/50" />
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-6 py-4 text-coral-600 hover:bg-coral-50 transition-colors"
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/login" className="px-5 py-3 text-neutral-700 hover:text-primary-600 font-semibold rounded-2xl hover:bg-primary-50 transition-all duration-300">
                  Sign In
                </Link>
                <Link href="/auth/register" className="btn-coral">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-neutral-100 py-4 animate-slide-up">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-6 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200"
              />
            </form>

            <div className="space-y-2">
              <Link
                href="/products"
                className="block px-4 py-3 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 font-semibold rounded-xl transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/categories"
                className="block px-4 py-3 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 font-semibold rounded-xl transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/cart"
                className="flex items-center justify-between px-4 py-3 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 font-semibold rounded-xl transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-3" />
                  Shopping Cart
                </span>
                {cartItemsCount > 0 && (
                  <span className="bg-primary-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-semibold">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <>
                  <div className="px-4 py-3 border-t border-neutral-100 mt-4">
                    <p className="font-semibold text-neutral-900">{user?.name}</p>
                    <p className="text-sm text-neutral-500">{user?.email}</p>
                  </div>
                  
                  <Link
                    href="/profile"
                    className="block px-4 py-3 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 font-semibold rounded-xl transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile Settings
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-4 py-3 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 font-semibold rounded-xl transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="block px-4 py-3 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 font-semibold rounded-xl transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="block w-full text-left px-4 py-3 text-accent-600 hover:bg-accent-50 font-semibold rounded-xl transition-all duration-200"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="block px-4 py-3 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 font-semibold rounded-xl transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block px-4 py-3 text-center btn-primary mx-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
