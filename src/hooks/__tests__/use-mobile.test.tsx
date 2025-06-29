import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDeviceDetection, useIsMobile, useOrientation, useViewport } from '../use-mobile'

// Mock do window
const mockWindow = {
  innerWidth: 1920,
  innerHeight: 1080,
  devicePixelRatio: 1,
  matchMedia: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn()
}

// Mock do navigator
const mockNavigator = {
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  maxTouchPoints: 0
}

// Mock do matchMedia
const createMockMatchMedia = (matches: boolean = false) => ({
  matches,
  media: '',
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
})

describe('use-mobile hooks', () => {
  beforeEach(() => {
    // Reset window properties safely
    if (typeof window !== 'undefined') {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      })
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 1080,
      })
      Object.defineProperty(window, 'devicePixelRatio', {
        writable: true,
        configurable: true,
        value: 1,
      })
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        configurable: true,
        value: vi.fn().mockImplementation(() => createMockMatchMedia()),
      })

      // Reset navigator
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        configurable: true,
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      })
      Object.defineProperty(navigator, 'maxTouchPoints', {
        writable: true,
        configurable: true,
        value: 0,
      })
    }

    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('useIsMobile', () => {
    it('should return false for desktop screen size', () => {
      window.innerWidth = 1920
      window.matchMedia = vi.fn().mockImplementation((query) => 
        createMockMatchMedia(false) // Desktop size
      )

      const { result } = renderHook(() => useIsMobile())
      
      expect(result.current).toBe(false)
    })

    it('should return true for mobile screen size', () => {
      window.innerWidth = 375
      window.matchMedia = vi.fn().mockImplementation((query) => 
        createMockMatchMedia(true) // Mobile size
      )

      const { result } = renderHook(() => useIsMobile())
      
      expect(result.current).toBe(true)
    })
  })

  describe('useDeviceDetection', () => {
    it('should detect desktop device correctly', () => {
      window.innerWidth = 1920
      window.innerHeight = 1080

      const { result } = renderHook(() => useDeviceDetection())
      
      expect(result.current.type).toBe('desktop')
      expect(result.current.width).toBe(1920)
      expect(result.current.height).toBe(1080)
      expect(result.current.isDesktop).toBe(true)
      expect(result.current.isMobile).toBe(false)
      expect(result.current.isTablet).toBe(false)
    })

    it('should detect mobile device by screen size', () => {
      window.innerWidth = 375
      window.innerHeight = 667

      const { result } = renderHook(() => useDeviceDetection())
      
      expect(result.current.type).toBe('mobile-sm')
      expect(result.current.width).toBe(375)
      expect(result.current.height).toBe(667)
      expect(result.current.isMobile).toBe(true)
      expect(result.current.isDesktop).toBe(false)
      expect(result.current.isTablet).toBe(false)
    })

    it('should detect high DPI screens', () => {
      window.devicePixelRatio = 2

      const { result } = renderHook(() => useDeviceDetection())
      
      expect(result.current.isHighDPI).toBe(true)
    })

    it('should calculate scale correctly', () => {
      const { result } = renderHook(() => useDeviceDetection())
      
      expect(typeof result.current.scale).toBe('number')
      expect(result.current.scale).toBeGreaterThan(0)
    })
  })

  describe('useOrientation', () => {
    it('should detect portrait orientation', () => {
      window.innerWidth = 375
      window.innerHeight = 667

      const { result } = renderHook(() => useOrientation())
      
      expect(result.current).toBe('portrait')
    })

    it('should detect landscape orientation', () => {
      window.innerWidth = 667
      window.innerHeight = 375

      const { result } = renderHook(() => useOrientation())
      
      expect(result.current).toBe('landscape')
    })
  })

  describe('useViewport', () => {
    it('should return current viewport dimensions', () => {
      window.innerWidth = 1920
      window.innerHeight = 1080

      const { result } = renderHook(() => useViewport())
      
      expect(result.current.width).toBe(1920)
      expect(result.current.height).toBe(1080)
    })
  })
}) 