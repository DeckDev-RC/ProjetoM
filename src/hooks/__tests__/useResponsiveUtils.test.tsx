import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useResponsivePadding, useResponsiveValue } from '../useResponsiveUtils'

// Mock do hook use-mobile
vi.mock('../use-mobile', () => ({
  useDeviceDetection: vi.fn(() => ({
    type: 'desktop',
    width: 1920,
    height: 1080,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    scale: 1,
    orientation: 'landscape',
    isHighDPI: false,
    isUltraWide: false,
    margin: 40
  }))
}))

import { useDeviceDetection } from '../use-mobile'
const mockUseDeviceDetection = vi.mocked(useDeviceDetection)

describe.skip('useResponsiveUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useResponsivePadding', () => {
    it('should return mobile padding for mobile devices', () => {
      mockUseDeviceDetection.mockReturnValue({
        type: 'mobile-sm',
        width: 375,
        height: 667,
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        scale: 1,
        orientation: 'portrait',
        isHighDPI: false,
        isUltraWide: false,
        margin: '1rem'
      })

      const { result } = renderHook(() => useResponsivePadding('hero'))
      
      expect(result.current).toContain('1rem') // Padding mobile
    })

    it('should return tablet padding for tablet devices', () => {
      mockUseDeviceDetection.mockReturnValue({
        isMobile: false,
        isTablet: true,
        isDesktop: false,
        screenWidth: 768,
        screenHeight: 1024
      })

      const { result } = renderHook(() => useResponsivePadding('hero'))
      
      expect(result.current).toContain('1.5rem') // Padding tablet
    })

    it('should return desktop padding for desktop devices', () => {
      mockUseDeviceDetection.mockReturnValue({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        screenWidth: 1920,
        screenHeight: 1080
      })

      const { result } = renderHook(() => useResponsivePadding('hero'))
      
      expect(result.current).toContain('2rem') // Padding desktop
    })

    it('should handle different section types', () => {
      mockUseDeviceDetection.mockReturnValue({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        screenWidth: 1920,
        screenHeight: 1080
      })

      const heroResult = renderHook(() => useResponsivePadding('hero'))
      const featuresResult = renderHook(() => useResponsivePadding('features'))
      const contactResult = renderHook(() => useResponsivePadding('contact'))
      
      expect(heroResult.result.current).toBeDefined()
      expect(featuresResult.result.current).toBeDefined()
      expect(contactResult.result.current).toBeDefined()
    })

    it('should handle undefined section gracefully', () => {
      mockUseDeviceDetection.mockReturnValue({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        screenWidth: 1920,
        screenHeight: 1080
      })

      const { result } = renderHook(() => useResponsivePadding())
      
      expect(result.current).toBeDefined()
      expect(typeof result.current).toBe('string')
    })
  })

  describe('useResponsiveValue', () => {
    it('should return mobile-xs value for very small screens', () => {
      mockUseDeviceDetection.mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        screenWidth: 320,
        screenHeight: 568
      })

      const values = {
        'mobile-xs': 'xs-value',
        'mobile-sm': 'sm-value',
        'desktop': 'desktop-value'
      }

      const { result } = renderHook(() => useResponsiveValue(values, 'default'))
      
      expect(result.current).toBe('xs-value')
    })

    it('should return mobile-sm value for small mobile screens', () => {
      mockUseDeviceDetection.mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        screenWidth: 375,
        screenHeight: 667
      })

      const values = {
        'mobile-xs': 'xs-value',
        'mobile-sm': 'sm-value',
        'mobile-md': 'md-value',
        'desktop': 'desktop-value'
      }

      const { result } = renderHook(() => useResponsiveValue(values, 'default'))
      
      expect(result.current).toBe('sm-value')
    })

    it('should return mobile-md value for medium mobile screens', () => {
      mockUseDeviceDetection.mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        screenWidth: 414,
        screenHeight: 896
      })

      const values = {
        'mobile-xs': 'xs-value',
        'mobile-sm': 'sm-value',
        'mobile-md': 'md-value',
        'desktop': 'desktop-value'
      }

      const { result } = renderHook(() => useResponsiveValue(values, 'default'))
      
      expect(result.current).toBe('md-value')
    })

    it('should return tablet-sm value for small tablets', () => {
      mockUseDeviceDetection.mockReturnValue({
        isMobile: false,
        isTablet: true,
        isDesktop: false,
        screenWidth: 640,
        screenHeight: 960
      })

      const values = {
        'mobile-xs': 'xs-value',
        'tablet-sm': 'tablet-sm-value',
        'tablet-md': 'tablet-md-value',
        'desktop': 'desktop-value'
      }

      const { result } = renderHook(() => useResponsiveValue(values, 'default'))
      
      expect(result.current).toBe('tablet-sm-value')
    })

    it('should return tablet-md value for medium tablets', () => {
      mockUseDeviceDetection.mockReturnValue({
        isMobile: false,
        isTablet: true,
        isDesktop: false,
        screenWidth: 768,
        screenHeight: 1024
      })

      const values = {
        'tablet-sm': 'tablet-sm-value',
        'tablet-md': 'tablet-md-value',
        'tablet-lg': 'tablet-lg-value',
        'desktop': 'desktop-value'
      }

      const { result } = renderHook(() => useResponsiveValue(values, 'default'))
      
      expect(result.current).toBe('tablet-md-value')
    })

    it('should return tablet-lg value for large tablets', () => {
      mockUseDeviceDetection.mockReturnValue({
        isMobile: false,
        isTablet: true,
        isDesktop: false,
        screenWidth: 1024,
        screenHeight: 768
      })

      const values = {
        'tablet-md': 'tablet-md-value',
        'tablet-lg': 'tablet-lg-value',
        'desktop': 'desktop-value'
      }

      const { result } = renderHook(() => useResponsiveValue(values, 'default'))
      
      expect(result.current).toBe('tablet-lg-value')
    })

    it('should return desktop value for desktop screens', () => {
      mockUseDeviceDetection.mockReturnValue({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        screenWidth: 1920,
        screenHeight: 1080
      })

      const values = {
        'mobile-xs': 'xs-value',
        'tablet-md': 'tablet-value',
        'desktop': 'desktop-value'
      }

      const { result } = renderHook(() => useResponsiveValue(values, 'default'))
      
      expect(result.current).toBe('desktop-value')
    })

    it('should return default value when no matching breakpoint', () => {
      mockUseDeviceDetection.mockReturnValue({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        screenWidth: 1920,
        screenHeight: 1080
      })

      const values = {
        'mobile-xs': 'xs-value',
        'mobile-sm': 'sm-value'
      }

      const { result } = renderHook(() => useResponsiveValue(values, 'default-value'))
      
      expect(result.current).toBe('default-value')
    })

    it('should handle empty values object', () => {
      mockUseDeviceDetection.mockReturnValue({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        screenWidth: 1920,
        screenHeight: 1080
      })

      const { result } = renderHook(() => useResponsiveValue({}, 'fallback'))
      
      expect(result.current).toBe('fallback')
    })

    it('should handle complex object values', () => {
      mockUseDeviceDetection.mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        screenWidth: 375,
        screenHeight: 667
      })

      const values = {
        'mobile-sm': { maxWidth: 'max-w-sm', height: 'h-64' },
        'desktop': { maxWidth: 'max-w-lg', height: 'h-96' }
      }

      const { result } = renderHook(() => useResponsiveValue(values, { maxWidth: 'max-w-md', height: 'h-80' }))
      
      expect(result.current).toEqual({ maxWidth: 'max-w-sm', height: 'h-64' })
    })

    it('should handle numeric values', () => {
      mockUseDeviceDetection.mockReturnValue({
        isMobile: false,
        isTablet: true,
        isDesktop: false,
        screenWidth: 768,
        screenHeight: 1024
      })

      const values = {
        'mobile-sm': 12,
        'tablet-md': 16,
        'desktop': 20
      }

      const { result } = renderHook(() => useResponsiveValue(values, 14))
      
      expect(result.current).toBe(16)
    })

    it('should handle boolean values', () => {
      mockUseDeviceDetection.mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        screenWidth: 320,
        screenHeight: 568
      })

      const values = {
        'mobile-xs': true,
        'tablet-md': false,
        'desktop': false
      }

      const { result } = renderHook(() => useResponsiveValue(values, false))
      
      expect(result.current).toBe(true)
    })
  })

  describe('Integration Tests', () => {
    it('should work together for responsive component configuration', () => {
      mockUseDeviceDetection.mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        screenWidth: 375,
        screenHeight: 667
      })

      const paddingResult = renderHook(() => useResponsivePadding('hero'))
      const sizeResult = renderHook(() => useResponsiveValue({
        'mobile-sm': 'text-sm',
        'tablet-md': 'text-base',
        'desktop': 'text-lg'
      }, 'text-base'))

      expect(paddingResult.result.current).toBeDefined()
      expect(sizeResult.result.current).toBe('text-sm')
    })

    it('should handle device type changes', () => {
      // Simular mudança de mobile para desktop
      mockUseDeviceDetection.mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        screenWidth: 375,
        screenHeight: 667
      })

      const { result, rerender } = renderHook(() => useResponsiveValue({
        'mobile-sm': 'mobile-config',
        'desktop': 'desktop-config'
      }, 'default'))

      expect(result.current).toBe('mobile-config')

      // Simular mudança para desktop
      mockUseDeviceDetection.mockReturnValue({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        screenWidth: 1920,
        screenHeight: 1080
      })

      rerender()

      expect(result.current).toBe('desktop-config')
    })
  })
}) 