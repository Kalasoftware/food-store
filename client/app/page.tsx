'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Star, Truck, Shield, Clock, ArrowRight, Sparkles, Heart } from 'lucide-react'
import ProductCard from '@/components/products/ProductCard'
import { api } from '@/lib/api'
import { Product, Category } from '@/types'

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products?limit=8'),
          api.get('/products/categories/all')
        ])
        
        setFeaturedProducts(productsRes.data.products)
        setCategories(categoriesRes.data.categories)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-coral-500 to-secondary-500 text-white min-h-screen flex items-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 text-8xl animate-bounce-gentle">🍓</div>
          <div className="absolute top-32 right-20 text-6xl animate-bounce-gentle" style={{animationDelay: '0.5s'}}>🥑</div>
          <div className="absolute bottom-32 left-20 text-7xl animate-bounce-gentle" style={{animationDelay: '1s'}}>🍑</div>
          <div className="absolute bottom-20 right-10 text-5xl animate-bounce-gentle" style={{animationDelay: '1.5s'}}>🍊</div>
          <div className="absolute top-1/2 left-1/3 text-6xl animate-bounce-gentle" style={{animationDelay: '2s'}}>🥭</div>
          <div className="absolute top-1/4 right-1/3 text-4xl animate-bounce-gentle" style={{animationDelay: '2.5s'}}>🍒</div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>

        <div className="container-custom relative z-10 py-20">
          <div className="max-w-5xl mx-auto text-center">
            {/* Premium Badge */}
            <div className="inline-flex items-center space-x-3 glass-coral rounded-full px-6 py-3 mb-8 animate-fade-in">
              <Sparkles className="w-5 h-5 text-coral-300" />
              <span className="text-sm font-semibold text-white">Premium Quality • Fresh Delivery</span>
            </div>

            {/* Main Heading */}
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 animate-slide-up leading-tight">
              Delicious Food
              <span className="block bg-gradient-to-r from-coral-200 to-primary-200 bg-clip-text text-transparent">
                Delivered Fresh
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{animationDelay: '0.2s'}}>
              Experience the finest selection of premium packaged foods, carefully curated and delivered fresh to your doorstep with love and care.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up" style={{animationDelay: '0.4s'}}>
              <Link href="/products" className="group bg-white text-primary-600 hover:bg-coral-50 font-bold py-5 px-10 rounded-3xl shadow-large hover:shadow-coral transition-all duration-300 transform hover:scale-105">
                <span className="flex items-center justify-center space-x-3 text-lg">
                  <ShoppingCart className="w-6 h-6" />
                  <span>Start Shopping</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </span>
              </Link>
              <Link href="/products" className="group glass text-white hover:bg-white/30 font-semibold py-5 px-10 rounded-3xl transition-all duration-300 border border-white/30">
                <span className="flex items-center justify-center space-x-3 text-lg">
                  <span>Explore Menu</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 animate-fade-in" style={{animationDelay: '0.6s'}}>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">500+</div>
                <div className="text-white/80 text-sm">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">50+</div>
                <div className="text-white/80 text-sm">Premium Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
                <div className="text-white/80 text-sm">Fresh Delivery</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Wave Bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="url(#gradient)" />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fafafa" />
                <stop offset="100%" stopColor="#f5f5f5" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-gradient-to-b from-neutral-50 to-white">
        <div className="container-custom">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-100 to-coral-100 rounded-full px-4 py-2 mb-6">
              <Heart className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-semibold text-primary-700">Why Choose FoodStore</span>
            </div>
            <h2 className="heading-2 mb-6 bg-gradient-to-r from-primary-600 to-coral-600 bg-clip-text text-transparent">
              Experience Excellence
            </h2>
            <p className="text-body max-w-3xl mx-auto text-lg">
              We're committed to providing you with the finest food products and exceptional service that exceeds your expectations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-coral-500 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-500 shadow-large hover:shadow-coral">
                  <Truck className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-coral-400 to-secondary-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>
              <h3 className="heading-4 mb-4 text-neutral-900">Lightning Fast Delivery</h3>
              <p className="text-body leading-relaxed">
                Free same-day delivery on orders above ₹500. Track your order in real-time and get fresh products delivered within hours.
              </p>
              <div className="mt-6 inline-flex items-center text-primary-600 font-semibold text-sm">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-500 shadow-large hover:shadow-emerald-500/30">
                  <Shield className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-coral-400 to-secondary-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">★</span>
                </div>
              </div>
              <h3 className="heading-4 mb-4 text-neutral-900">Premium Quality</h3>
              <p className="text-body leading-relaxed">
                100% authentic products with quality guarantee. We source directly from trusted suppliers and maintain strict quality standards.
              </p>
              <div className="mt-6 inline-flex items-center text-emerald-600 font-semibold text-sm">
                <span>Our promise</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-500 shadow-large hover:shadow-amber-500/30">
                  <Clock className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-coral-400 to-secondary-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">24</span>
                </div>
              </div>
              <h3 className="heading-4 mb-4 text-neutral-900">24/7 Support</h3>
              <p className="text-body leading-relaxed">
                Round-the-clock customer support and flexible delivery slots. Order anytime and get assistance whenever you need it.
              </p>
              <div className="mt-6 inline-flex items-center text-amber-600 font-semibold text-sm">
                <span>Contact us</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-20 pt-16 border-t border-neutral-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral-700 mb-1">500+</div>
                <div className="text-sm text-neutral-500">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral-700 mb-1">50+</div>
                <div className="text-sm text-neutral-500">Premium Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral-700 mb-1">99%</div>
                <div className="text-sm text-neutral-500">Satisfaction Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral-700 mb-1">24/7</div>
                <div className="text-sm text-neutral-500">Support Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-padding bg-gradient-to-br from-white via-primary-50/30 to-coral-50/30">
        <div className="container-custom">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-coral-100 to-primary-100 rounded-full px-4 py-2 mb-6">
              <Star className="w-4 h-4 text-coral-600" />
              <span className="text-sm font-semibold text-coral-700">Explore Categories</span>
            </div>
            <h2 className="heading-2 mb-6 bg-gradient-to-r from-coral-600 to-primary-600 bg-clip-text text-transparent">
              Shop by Category
            </h2>
            <p className="text-body max-w-3xl mx-auto text-lg">
              Discover our carefully curated selection of premium food categories, each offering the finest quality products for your kitchen
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="card p-8 text-center animate-pulse">
                  <div className="w-20 h-20 bg-neutral-200 rounded-3xl mx-auto mb-6"></div>
                  <div className="h-5 bg-neutral-200 rounded mb-3"></div>
                  <div className="h-4 bg-neutral-200 rounded w-3/4 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {categories.map((category, index) => {
                const categoryIcons = ['🍿', '🥤', '🥛', '🌾', '🌶️'];
                const gradients = [
                  'from-coral-400 to-secondary-500',
                  'from-blue-400 to-cyan-500',
                  'from-amber-400 to-orange-500',
                  'from-emerald-400 to-teal-500',
                  'from-purple-400 to-pink-500'
                ];
                
                return (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.id}`}
                    className="card card-interactive p-8 text-center group hover:shadow-coral"
                  >
                    <div className={`w-20 h-20 bg-gradient-to-br ${gradients[index % gradients.length]} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-500 shadow-medium`}>
                      <span className="text-3xl">{categoryIcons[index % categoryIcons.length]}</span>
                    </div>
                    <h3 className="font-display font-semibold text-neutral-800 mb-3 text-lg group-hover:text-primary-600 transition-colors">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-muted text-center leading-relaxed">{category.description}</p>
                    )}
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="inline-flex items-center text-primary-600 font-semibold text-sm">
                        <span>Explore</span>
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section-padding bg-gradient-to-b from-neutral-50 to-white">
        <div className="container-custom">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-100 to-coral-100 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-semibold text-primary-700">Handpicked Selection</span>
            </div>
            <h2 className="heading-2 mb-6 bg-gradient-to-r from-primary-600 to-coral-600 bg-clip-text text-transparent">
              Featured Products
            </h2>
            <p className="text-body max-w-3xl mx-auto text-lg">
              Discover our most popular and highly-rated food products, carefully selected for exceptional quality and taste
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="w-full h-56 bg-neutral-200 rounded-2xl mb-6"></div>
                  <div className="h-5 bg-neutral-200 rounded mb-3"></div>
                  <div className="h-4 bg-neutral-200 rounded w-2/3 mb-3"></div>
                  <div className="h-6 bg-neutral-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-16">
            <Link href="/products" className="btn-coral inline-flex items-center space-x-3 text-lg px-8 py-4">
              <span>View All Products</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section-padding bg-gradient-to-br from-primary-500 via-coral-500 to-secondary-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 text-6xl animate-bounce-gentle">📧</div>
          <div className="absolute bottom-10 left-10 text-5xl animate-bounce-gentle" style={{animationDelay: '1s'}}>🔔</div>
          <div className="absolute top-1/2 left-1/4 text-4xl animate-bounce-gentle" style={{animationDelay: '2s'}}>✨</div>
        </div>
        
        <div className="container-custom text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 glass-coral rounded-full px-4 py-2 mb-8">
              <Heart className="w-4 h-4 text-coral-300" />
              <span className="text-sm font-semibold text-white">Join Our Community</span>
            </div>
            
            <h2 className="heading-2 text-white mb-6">
              Stay in the Loop
            </h2>
            <p className="text-xl text-white/90 mb-12 leading-relaxed">
              Get exclusive access to new products, special offers, seasonal recipes, and insider tips delivered straight to your inbox
            </p>
            
            <div className="max-w-lg mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white/20 backdrop-blur-md rounded-3xl border border-white/30">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 bg-transparent text-white placeholder-white/70 focus:outline-none text-lg"
                />
                <button className="bg-white text-primary-600 hover:bg-coral-50 font-semibold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-medium">
                  Subscribe Now
                </button>
              </div>
              <p className="text-white/80 text-sm mt-4 flex items-center justify-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>No spam, unsubscribe anytime • 10,000+ subscribers</span>
              </p>
            </div>

            {/* Social Proof */}
            <div className="mt-16 grid grid-cols-3 gap-8 opacity-80">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">10K+</div>
                <div className="text-white/80 text-sm">Newsletter Subscribers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">Weekly</div>
                <div className="text-white/80 text-sm">Recipe Updates</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">Exclusive</div>
                <div className="text-white/80 text-sm">Member Offers</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
