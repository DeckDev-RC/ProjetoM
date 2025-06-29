import { describe, it, expect } from 'vitest'
import { cn } from '../utils'

describe('utils', () => {
  describe('cn function', () => {
    it('should combine class names correctly', () => {
      const result = cn('class1', 'class2')
      expect(result).toBe('class1 class2')
    })

    it('should handle conditional classes', () => {
      const result = cn('base', true && 'conditional', false && 'hidden')
      expect(result).toBe('base conditional')
    })

    it('should handle undefined and null values', () => {
      const result = cn('base', undefined, null, 'valid')
      expect(result).toBe('base valid')
    })

    it('should handle empty string', () => {
      const result = cn('base', '', 'valid')
      expect(result).toBe('base valid')
    })

    it('should handle array of classes', () => {
      const result = cn(['class1', 'class2'], 'class3')
      expect(result).toBe('class1 class2 class3')
    })

    it('should handle object with boolean values', () => {
      const result = cn({
        'active': true,
        'disabled': false,
        'visible': true
      })
      expect(result).toBe('active visible')
    })

    it('should handle complex combinations', () => {
      const isActive = true
      const isDisabled = false
      
      const result = cn(
        'btn',
        'btn-primary',
        {
          'btn-active': isActive,
          'btn-disabled': isDisabled
        },
        isActive && 'state-active'
      )
      
      expect(result).toBe('btn btn-primary btn-active state-active')
    })

    it('should return empty string for no arguments', () => {
      const result = cn()
      expect(result).toBe('')
    })

    it('should handle Tailwind CSS classes correctly', () => {
      const result = cn(
        'bg-blue-500',
        'hover:bg-blue-600',
        'text-white',
        'px-4 py-2',
        'rounded-md'
      )
      expect(result).toBe('bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md')
    })
  })
}) 