import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Footer from '../Footer'

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

// Wrapper com Router
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Footer Component', () => {
  it('should render the footer', () => {
    renderWithRouter(<Footer />)
    
    // Verificar se o footer está presente
    const footer = document.querySelector('footer')
    expect(footer).toBeInTheDocument()
  })

  it('should render company logo or name', () => {
    renderWithRouter(<Footer />)
    
    // Procurar por logo ou nome da empresa
    expect(
      screen.getByAltText(/logo/i) || 
      screen.getByText(/mind ai/i) || 
      screen.getByText(/agregar/i)
    ).toBeInTheDocument()
  })

  it('should render navigation links', () => {
    renderWithRouter(<Footer />)
    
    // Verificar se há links de navegação
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
  })

  it('should render copyright or legal information', () => {
    renderWithRouter(<Footer />)
    
    // Procurar por informações de copyright
    expect(
      screen.getByText(/©/i) || 
      screen.getByText(/copyright/i) || 
      screen.getByText(/direitos reservados/i) ||
      screen.getByText(/2024/i)
    ).toBeInTheDocument()
  })

  it('should render contact information or social links', () => {
    renderWithRouter(<Footer />)
    
    // Verificar se há informações de contato ou redes sociais
    const socialLinks = document.querySelectorAll('[href*="linkedin"], [href*="facebook"], [href*="twitter"], [href*="instagram"]')
    const contactInfo = screen.queryAllByText(/contato/i).length > 0 || screen.queryByText(/email/i) || screen.queryByText(/telefone/i)
    
    expect(socialLinks.length > 0 || contactInfo).toBeTruthy()
  })

  it('should have proper footer structure', () => {
    renderWithRouter(<Footer />)
    
    const footer = document.querySelector('footer')
    expect(footer).toBeInTheDocument()
    expect(footer).toHaveClass('bg-gray-900/95') // Classe CSS correta baseada no HTML
  })

  it('should render legal pages links', () => {
    renderWithRouter(<Footer />)
    
    // Procurar por links para páginas legais
    const legalLinks = [
      screen.queryByText(/política de privacidade/i),
      screen.queryByText(/termos de uso/i),
      screen.queryByText(/cookies/i),
      screen.queryByText(/privacy/i),
      screen.queryByText(/terms/i)
    ].filter(Boolean)
    
    expect(legalLinks.length).toBeGreaterThan(0)
  })

  it('should render without errors', () => {
    expect(() => {
      renderWithRouter(<Footer />)
    }).not.toThrow()
  })
}) 