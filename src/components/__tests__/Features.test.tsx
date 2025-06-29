import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Features from '../Features'

// Mock dos hooks
vi.mock('@/hooks/use-mobile', () => ({
  useDeviceDetection: () => ({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: 1920,
    screenHeight: 1080,
  })
}))

vi.mock('@/hooks/useResponsiveUtils', () => ({
  useResponsivePadding: () => '2rem',
  useResponsiveValue: (values: any, defaultValue: any) => defaultValue,
  useResponsiveAnimation: () => ({
    duration: '0.3s',
    easing: 'ease-in-out',
    delay: 150,
    shouldAnimate: true
  })
}))

describe('Features Component', () => {
  it('should render the features section', () => {
    render(<Features />)
    
    // Verificar se a seção está presente
    const section = document.querySelector('#features')
    expect(section).toBeInTheDocument()
  })

  it('should render section title', () => {
    render(<Features />)
    
    // Procurar por texto relacionado a recursos/funcionalidades
    expect(screen.getByText(/recursos/i) || screen.getByText(/funcionalidades/i) || screen.getByText(/features/i)).toBeInTheDocument()
  })

  it('should render feature cards', () => {
    render(<Features />)
    
    // Verificar se há múltiplos cards/elementos de feature
    const cards = document.querySelectorAll('[class*="card"], [class*="feature"], .bg-gradient-to-r')
    expect(cards.length).toBeGreaterThan(0)
  })

  it('should have proper section structure', () => {
    render(<Features />)
    
    const section = document.querySelector('#features')
    expect(section).toBeInTheDocument()
    expect(section).toHaveClass('relative')
  })

  it('should render without errors', () => {
    expect(() => {
      render(<Features />)
    }).not.toThrow()
  })
}) 