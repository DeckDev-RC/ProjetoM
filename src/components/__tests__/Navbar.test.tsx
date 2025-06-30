import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Navbar from '../Navbar'

// Mock dos hooks
vi.mock('@/hooks/use-mobile', () => ({
  useDeviceDetection: () => ({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: 1920,
    screenHeight: 1080,
  }),
  useOrientation: () => 'landscape'
}))

vi.mock('@/hooks/useResponsiveUtils', () => ({
  useResponsiveValue: (values: any, defaultValue: any) => defaultValue
}))

// Wrapper com Router
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Navbar Component', () => {
  beforeEach(() => {
    // Mock window.scrollTo
    Object.defineProperty(window, 'scrollTo', {
      value: vi.fn(),
      writable: true
    })
  })

  it('should render the logo', () => {
    renderWithRouter(<Navbar />)
    
    const logo = screen.getByAltText('Mind AI Logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', '/logo.svg')
  })

  it('should render navigation links for desktop', () => {
    renderWithRouter(<Navbar />)
    
    // Usar getAllByText para lidar com elementos duplicados
    const homeLinks = screen.getAllByText('Home')
    const recursosLinks = screen.getAllByText('Recursos')
    const estrategiaLinks = screen.getAllByText('Estratégia')
    const faqLinks = screen.getAllByText('FAQ')
    const contatoLinks = screen.getAllByText('Contato')
    
    // Verificar que existem pelo menos os links (desktop + mobile)
    expect(homeLinks.length).toBeGreaterThanOrEqual(1)
    expect(recursosLinks.length).toBeGreaterThanOrEqual(1)
    expect(estrategiaLinks.length).toBeGreaterThanOrEqual(1)
    expect(faqLinks.length).toBeGreaterThanOrEqual(1)
    expect(contatoLinks.length).toBeGreaterThanOrEqual(1)
  })

  it('should scroll to top when logo is clicked', () => {
    renderWithRouter(<Navbar />)
    
    const logo = screen.getByAltText('Mind AI Logo').closest('a')
    fireEvent.click(logo!)
    
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth'
    })
  })

  it('should have correct navigation styling', () => {
    renderWithRouter(<Navbar />)
    
    const nav = screen.getByRole('navigation')
    // Verificar style inline em vez de CSS computado
    expect(nav).toHaveAttribute('style', expect.stringContaining('margin-left: 350px'))
    expect(nav).toHaveClass('max-w-md', 'justify-between')
  })

  it('should apply scroll effect when page is scrolled', () => {
    renderWithRouter(<Navbar />)
    
    // Simular scroll
    Object.defineProperty(window, 'scrollY', {
      value: 100,
      writable: true
    })
    
    fireEvent.scroll(window)
    
    const header = screen.getByRole('banner')
    expect(header).toHaveClass('bg-gray-900/80', 'backdrop-blur-md')
  })

  it('should have proper logo size classes', () => {
    renderWithRouter(<Navbar />)
    
    const logo = screen.getByAltText('Mind AI Logo')
    expect(logo).toHaveClass('w-72', 'h-auto', 'max-w-72')
  })
}) 