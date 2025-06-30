import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FAQ from '../FAQ'

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
  useResponsiveValue: (values: any, defaultValue: any) => defaultValue
}))

describe('FAQ Component', () => {
  it('should render the FAQ section', () => {
    render(<FAQ />)
    
    // Verificar se a seção está presente
    const section = document.querySelector('#faq')
    expect(section).toBeInTheDocument()
  })

  it('should render FAQ title', () => {
    render(<FAQ />)
    
    // Procurar por texto relacionado a FAQ/perguntas frequentes
    expect(
      screen.getByText(/mais frequentes/i) || 
      screen.getByText(/confira as perguntas/i) ||
      screen.getByText(/faq/i) || 
      screen.getByText(/dúvidas/i)
    ).toBeInTheDocument()
  })

  it('should render FAQ items', () => {
    render(<FAQ />)
    
    // Verificar se há elementos de accordion/perguntas
    const faqItems = document.querySelectorAll('[data-state], [class*="accordion"], button')
    expect(faqItems.length).toBeGreaterThan(0)
  })

  it('should handle accordion interactions', () => {
    render(<FAQ />)
    
    // Procurar por botões clicáveis (accordion triggers)
    const buttons = screen.getAllByRole('button')
    
    if (buttons.length > 0) {
      const firstButton = buttons[0]
      
      expect(() => {
        fireEvent.click(firstButton)
      }).not.toThrow()
    }
  })

  it('should have proper section structure', () => {
    render(<FAQ />)
    
    const section = document.querySelector('#faq')
    expect(section).toBeInTheDocument()
  })

  it('should render without errors', () => {
    expect(() => {
      render(<FAQ />)
    }).not.toThrow()
  })
}) 