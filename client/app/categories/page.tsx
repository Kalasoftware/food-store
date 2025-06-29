'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Star, Sparkles, Grid3X3, Package, TrendingUp } from 'lucide-react'
import { api } from '@/lib/api'
import { Category } from '@/types'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCategories: 0,
    totalProducts: 0,
    featuredCategories: 0
  })

  useEffect(() => {
    fetchCategories()
    fetchStats()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories')
      setCategories(response.data.categories)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const [categoriesRes, productsRes] = await Promise.all([
        api.get('/categories'),
        api.get('/products?limit=1')
      ])
      
      setStats({
        totalCategories: categoriesRes.data.categories.length,
        totalProducts: productsRes.data.pagination?.totalItems || 0,
        featuredCategories: categoriesRes.data.categories.filter((cat: Category) => cat.name).length
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const categoryIcons = ['🍿', '🥤', '🥛', '🌾', '🌶️', '🍎', '🥖', '🧀', '🥩', '🐟', '🥗', '🍰', '☕', '🍯', '🥜']
  const gradients = [
    'from-coral-400 to-secondary-500',
    'from-blue-400 to-cyan-500',
    'from-amber-400 to-orange-500',
    'from-emerald-400 to-teal-500',
    'from-purple-400 to-pink-500',
    'from-red-400 to-rose-500',
    'from-indigo-400 to-blue-500',
    'from-yellow-400 to-amber-500',
    'from-green-400 to-emerald-500',
    'from-pink-400 to-rose-500',
    'from-teal-400 to-cyan-500',
    'from-orange-400 to-red-500',
    'from-violet-400 to-purple-500',
    'from-lime-400 to-green-500',
    'from-sky-400 to-blue-500'
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-coral-50/30">
        <div className="container-custom py-20">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="card p-8 text-center animate-pulse">
                <div className="w-20 h-20 bg-neutral-200 rounded-3xl mx-auto mb-6"></div>
                <div className="h-6 bg-neutral-200 rounded mb-3"></div>
                <div className="h-4 bg-neutral-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-coral-50/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-coral-500 to-secondary-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-coral-600/90"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-coral-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative container-custom py-24 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
            <Grid3X3 className="w-5 h-5" />
            <span className="font-semibold">Food Categories</span>
          </div>
          
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Explore Our
            <span className="block bg-gradient-to-r from-white to-coral-100 bg-clip-text text-transparent">
              Food Universe
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed">
            Discover premium food categories crafted for every taste and occasion. From fresh produce to gourmet specialties.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
                <Package className="w-8 h-8" />
              </div>
              <div className="text-3xl font-bold mb-2">{stats.totalCategories}+</div>
              <div className="text-white/80">Categories</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div className="text-3xl font-bold mb-2">{stats.totalProducts}+</div>
              <div className="text-white/80">Products</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
                <Star className="w-8 h-8" />
              </div>
              <div className="text-3xl font-bold mb-2">Premium</div>
              <div className="text-white/80">Quality</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-coral-100 to-primary-100 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-coral-600" />
              <span className="text-sm font-semibold text-coral-700">Browse Categories</span>
            </div>
            <h2 className="heading-2 mb-6 bg-gradient-to-r from-coral-600 to-primary-600 bg-clip-text text-transparent">
              Choose Your Favorite Category
            </h2>
            <p className="text-body max-w-3xl mx-auto text-lg">
              Each category is carefully curated with the finest products to meet your culinary needs and preferences
            </p>
          </div>

          {categories.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-br from-coral-100 to-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-12 h-12 text-coral-600" />
              </div>
              <h3 className="text-2xl font-semibold text-neutral-800 mb-4">No Categories Available</h3>
              <p className="text-muted max-w-md mx-auto">
                We're working on adding amazing food categories. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {categories.map((category, index) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.id}`}
                  className="card card-interactive p-8 text-center group hover:shadow-coral transform hover:-translate-y-2 transition-all duration-500"
                >
                  <div className={`w-24 h-24 bg-gradient-to-br ${gradients[index % gradients.length]} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-500 shadow-medium`}>
                    <span className="text-4xl">{categoryIcons[index % categoryIcons.length]}</span>
                  </div>
                  
                  <h3 className="font-display font-semibold text-neutral-800 mb-3 text-xl group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                  
                  {category.description && (
                    <p className="text-muted text-center leading-relaxed mb-4 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  
                  <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <span className="inline-flex items-center text-primary-600 font-semibold">
                      <span>Explore Products</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-gradient-to-br from-primary-600 via-coral-500 to-secondary-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-coral-600/90"></div>
        
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-coral-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative container-custom text-center">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
            <Star className="w-5 h-5" />
            <span className="font-semibold">Premium Quality</span>
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Can't Find What You're Looking For?
          </h2>
          
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-12">
            Browse all our products or contact us for special requests. We're here to help you find exactly what you need.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="btn btn-secondary btn-lg group"
            >
              <span>Browse All Products</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/contact"
              className="btn btn-outline-white btn-lg group"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
