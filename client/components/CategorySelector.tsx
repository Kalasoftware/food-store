'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, Plus, Search } from 'lucide-react'
import { api } from '@/lib/api'
import { Category } from '@/types'

interface CategorySelectorProps {
  value?: number | null
  onChange: (categoryId: number | null) => void
  placeholder?: string
  required?: boolean
  allowCreate?: boolean
  onCreateCategory?: (category: Category) => void
}

export default function CategorySelector({
  value,
  onChange,
  placeholder = "Select a category",
  required = false,
  allowCreate = false,
  onCreateCategory
}: CategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    filterCategories()
  }, [categories, searchTerm])

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

  const filterCategories = () => {
    if (!searchTerm) {
      setFilteredCategories(categories)
    } else {
      const filtered = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredCategories(filtered)
    }
  }

  const selectedCategory = categories.find(cat => cat.id === value)

  const handleSelect = (categoryId: number | null) => {
    onChange(categoryId)
    setIsOpen(false)
    setSearchTerm('')
  }

  const categoryIcons = ['🍿', '🥤', '🥛', '🌾', '🌶️', '🍎', '🥖', '🧀', '🥩', '🐟', '🥗', '🍰', '☕', '🍯', '🥜']

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-left flex items-center justify-between ${
          !selectedCategory && required ? 'border-red-300' : ''
        }`}
      >
        <div className="flex items-center space-x-2">
          {selectedCategory ? (
            <>
              <span className="text-lg">
                {selectedCategory.image ? (
                  <img 
                    src={selectedCategory.image} 
                    alt={selectedCategory.name}
                    className="w-5 h-5 object-cover rounded"
                  />
                ) : (
                  categoryIcons[selectedCategory.id % categoryIcons.length]
                )}
              </span>
              <span className="text-gray-900">{selectedCategory.name}</span>
            </>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Categories List */}
          <div className="max-h-40 overflow-y-auto">
            {loading ? (
              <div className="p-3 text-center text-gray-500">Loading...</div>
            ) : filteredCategories.length === 0 ? (
              <div className="p-3 text-center text-gray-500">
                {searchTerm ? 'No categories found' : 'No categories available'}
              </div>
            ) : (
              <>
                {/* Clear selection option */}
                <button
                  type="button"
                  onClick={() => handleSelect(null)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-gray-500"
                >
                  <span>Clear selection</span>
                </button>
                
                {filteredCategories.map((category, index) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleSelect(category.id)}
                    className={`w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 ${
                      value === category.id ? 'bg-indigo-50 text-indigo-600' : 'text-gray-900'
                    }`}
                  >
                    <span className="text-lg">
                      {category.image ? (
                        <img 
                          src={category.image} 
                          alt={category.name}
                          className="w-5 h-5 object-cover rounded"
                        />
                      ) : (
                        categoryIcons[index % categoryIcons.length]
                      )}
                    </span>
                    <div>
                      <div className="font-medium">{category.name}</div>
                      {category.description && (
                        <div className="text-xs text-gray-500 truncate">
                          {category.description}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </>
            )}
          </div>

          {/* Create new category option */}
          {allowCreate && (
            <div className="border-t border-gray-200 p-2">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  // This would trigger a modal to create a new category
                  // For now, we'll just show a placeholder
                  console.log('Create new category')
                }}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-indigo-600"
              >
                <Plus className="w-4 h-4" />
                <span>Create new category</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
