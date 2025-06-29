'use client'

import { useState, useEffect } from 'react'
import { Filter, X } from 'lucide-react'
import { api } from '@/lib/api'
import { Category } from '@/types'

interface CategoryFilterProps {
  selectedCategory?: number | null
  onCategoryChange: (categoryId: number | null) => void
  showAll?: boolean
}

export default function CategoryFilter({
  selectedCategory,
  onCategoryChange,
  showAll = true
}: CategoryFilterProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
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

  const categoryIcons = ['🍿', '🥤', '🥛', '🌾', '🌶️', '🍎', '🥖', '🧀', '🥩', '🐟', '🥗', '🍰', '☕', '🍯', '🥜']
  const categoryColors = [
    'from-red-100 to-red-200 hover:from-red-200 hover:to-red-300',
    'from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300',
    'from-yellow-100 to-yellow-200 hover:from-yellow-200 hover:to-yellow-300',
    'from-green-100 to-green-200 hover:from-green-200 hover:to-green-300',
    'from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300',
    'from-pink-100 to-pink-200 hover:from-pink-200 hover:to-pink-300',
    'from-indigo-100 to-indigo-200 hover:from-indigo-200 hover:to-indigo-300',
    'from-orange-100 to-orange-200 hover:from-orange-200 hover:to-orange-300',
    'from-teal-100 to-teal-200 hover:from-teal-200 hover:to-teal-300',
    'from-cyan-100 to-cyan-200 hover:from-cyan-200 hover:to-cyan-300'
  ]

  if (loading) {
    return (
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <span className="text-gray-600">Categories:</span>
        </div>
        <div className="flex space-x-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-20 h-8 bg-gray-200 rounded-full animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mb-6">
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="text-gray-700 font-medium">Filter by Category:</span>
        </div>
        {selectedCategory && (
          <button
            onClick={() => onCategoryChange(null)}
            className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
            <span>Clear filter</span>
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {showAll && (
          <button
            onClick={() => onCategoryChange(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              !selectedCategory
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Categories
          </button>
        )}

        {categories.map((category, index) => {
          const isSelected = selectedCategory === category.id
          const productCount = (category as any).product_count || 0

          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isSelected
                  ? 'bg-gradient-to-r from-coral-500 to-primary-600 text-white shadow-md transform scale-105'
                  : `bg-gradient-to-r ${categoryColors[index % categoryColors.length]} text-gray-700 hover:shadow-md hover:transform hover:scale-105`
              }`}
            >
              <span className="text-base">
                {category.image ? (
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-4 h-4 object-cover rounded"
                  />
                ) : (
                  categoryIcons[index % categoryIcons.length]
                )}
              </span>
              <span>{category.name}</span>
              {productCount > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  isSelected 
                    ? 'bg-white/20 text-white' 
                    : 'bg-white/60 text-gray-600'
                }`}>
                  {productCount}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No categories available</p>
        </div>
      )}
    </div>
  )
}
