import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Hero from '../Hero'

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

// Mock do LazyVideo
vi.mock('@/components/LazyVideo', () => ({
  default: ({ src, className }: { src: string[]; className: string }) => (
    <div data-testid="lazy-video" className={className}>
      Mock Video: {src[0]}
    </div>
  )
}))

// Wrapper com Router
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Hero Component', () => {
  beforeEach(() => {
    // Mock HTMLVideoElement
    Object.defineProperty(HTMLVideoElement.prototype, 'play', {
      writable: true,
      value: vi.fn().mockResolvedValue(undefined),
    })
  })

  it('should render the main heading', () => {
    renderWithRouter(<Hero />)
    
    expect(screen.getByText('Automatize tudo')).toBeInTheDocument()
    expect(screen.getByText('Expanda sem limites')).toBeInTheDocument()
  })

  it('should render the description text', () => {
    renderWithRouter(<Hero />)
    
    const description = screen.getByText(/Somos especialistas em Inteligência Artificial/)
    expect(description).toBeInTheDocument()
  })

  it('should render the CTA button', () => {
    renderWithRouter(<Hero />)
    
    const ctaButton = screen.getByText('Começar Agora')
    expect(ctaButton).toBeInTheDocument()
    expect(ctaButton.closest('a')).toHaveAttribute('href', '#contact')
  })

  it('should render the presentation badge', () => {
    renderWithRouter(<Hero />)
    
    expect(screen.getByText('01')).toBeInTheDocument()
    expect(screen.getByText('Apresentação')).toBeInTheDocument()
  })

  it('should render the video component', () => {
    renderWithRouter(<Hero />)
    
    const video = screen.getByTestId('lazy-video')
    expect(video).toBeInTheDocument()
    expect(video).toHaveTextContent('Mock Video: /webm/0617.webm')
  })

  it('should have proper styling classes', () => {
    renderWithRouter(<Hero />)
    
    const section = document.querySelector('#hero')
    expect(section).toHaveClass('bg-gray-950')
    expect(section).toHaveAttribute('id', 'hero')
  })

  it('should render background video', () => {
    renderWithRouter(<Hero />)
    
    const backgroundVideo = document.querySelector('video')
    expect(backgroundVideo).toBeInTheDocument()
    expect(backgroundVideo).toHaveAttribute('autoplay')
    expect(backgroundVideo).toHaveAttribute('loop')
    expect(backgroundVideo).toHaveAttribute('playsinline')
  })

  it('should have gradient text animation', () => {
    renderWithRouter(<Hero />)
    
    const gradientText = screen.getByText('Expanda sem limites')
    expect(gradientText).toHaveClass('bg-clip-text', 'text-transparent')
  })

  it('should have proper card structure', () => {
    renderWithRouter(<Hero />)
    
    const videoContainer = screen.getByTestId('lazy-video')
    const cardWrapper = videoContainer.closest('div[class*="max-w-md"]')
    expect(cardWrapper).toBeInTheDocument()
    
    const maxWidthElement = document.querySelector('.max-w-md')
    expect(maxWidthElement).toBeInTheDocument()
  })
}) 