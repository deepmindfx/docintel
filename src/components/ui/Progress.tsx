import React from 'react'
import { cn } from '../../lib/utils'

interface ProgressProps {
  value: number
  max: number
  className?: string
  showLabel?: boolean
  variant?: 'default' | 'success' | 'warning' | 'danger'
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max,
  className,
  showLabel = false,
  variant = 'default'
}) => {
  const percentage = Math.min((value / max) * 100, 100)
  
  const variants = {
    default: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600'
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="flex justify-between items-center mb-1">
        {showLabel && (
          <span className="text-sm font-medium text-gray-700">
            {value.toLocaleString()} / {max.toLocaleString()}
          </span>
        )}
        <span className="text-sm text-gray-500">{percentage.toFixed(0)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={cn('h-2 rounded-full transition-all duration-300', variants[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}