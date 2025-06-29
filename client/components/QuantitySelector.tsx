'use client'

import { useState, useEffect } from 'react'
import { Minus, Plus } from 'lucide-react'

interface QuantitySelectorProps {
  quantity: number
  maxQuantity: number
  price: number
  onQuantityChange: (quantity: number) => void
  onTotalChange?: (total: number) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  showTotal?: boolean
  showPrice?: boolean
  loading?: boolean
}

export default function QuantitySelector({
  quantity,
  maxQuantity,
  price,
  onQuantityChange,
  onTotalChange,
  disabled = false,
  size = 'md',
  showTotal = true,
  showPrice = false,
  loading = false
}: QuantitySelectorProps) {
  const [localQuantity, setLocalQuantity] = useState(quantity)
  const [total, setTotal] = useState(quantity * price)

  // Update local state when props change
  useEffect(() => {
    setLocalQuantity(quantity)
    const newTotal = quantity * price
    setTotal(newTotal)
    if (onTotalChange) {
      onTotalChange(newTotal)
    }
  }, [quantity, price, onTotalChange])

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > maxQuantity || disabled || loading) return
    
    setLocalQuantity(newQuantity)
    const newTotal = newQuantity * price
    setTotal(newTotal)
    
    // Call the parent callback
    onQuantityChange(newQuantity)
    if (onTotalChange) {
      onTotalChange(newTotal)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1
    handleQuantityChange(Math.min(Math.max(value, 1), maxQuantity))
  }

  const sizeClasses = {
    sm: {
      button: 'p-1.5',
      input: 'px-2 py-1 text-sm w-12',
      icon: 'h-3 w-3'
    },
    md: {
      button: 'p-2',
      input: 'px-3 py-2 w-16',
      icon: 'h-4 w-4'
    },
    lg: {
      button: 'p-3',
      input: 'px-4 py-3 text-lg w-20',
      icon: 'h-5 w-5'
    }
  }

  const classes = sizeClasses[size]

  return (
    <div className="space-y-2">
      {/* Quantity Controls */}
      <div className="flex items-center">
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => handleQuantityChange(localQuantity - 1)}
            disabled={localQuantity <= 1 || disabled || loading}
            className={`${classes.button} hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
              loading ? 'cursor-wait' : ''
            }`}
          >
            <Minus className={classes.icon} />
          </button>
          
          <input
            type="number"
            value={localQuantity}
            onChange={handleInputChange}
            min={1}
            max={maxQuantity}
            disabled={disabled || loading}
            className={`${classes.input} text-center border-0 focus:outline-none focus:ring-0 disabled:bg-gray-50 disabled:cursor-not-allowed ${
              loading ? 'cursor-wait' : ''
            }`}
          />
          
          <button
            type="button"
            onClick={() => handleQuantityChange(localQuantity + 1)}
            disabled={localQuantity >= maxQuantity || disabled || loading}
            className={`${classes.button} hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
              loading ? 'cursor-wait' : ''
            }`}
          >
            <Plus className={classes.icon} />
          </button>
        </div>

        {loading && (
          <div className="ml-2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Price and Total Display */}
      <div className="text-sm space-y-1">
        {showPrice && (
          <div className="text-gray-600">
            ₹{price.toFixed(2)} each
          </div>
        )}
        
        {showTotal && (
          <div className="font-semibold text-gray-900">
            Total: ₹{total.toFixed(2)}
          </div>
        )}
        
        {maxQuantity > 0 && (
          <div className="text-xs text-gray-500">
            {maxQuantity - localQuantity} left in stock
          </div>
        )}
        
        {localQuantity >= maxQuantity && (
          <div className="text-xs text-red-600">
            Maximum quantity reached
          </div>
        )}
      </div>
    </div>
  )
}
