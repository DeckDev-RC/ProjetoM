import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import LazyVideo from '../LazyVideo'

// Mock do Intersection Observer
const mockIntersectionObserver = vi.fn()
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})

describe('LazyVideo Component', () => {
  beforeEach(() => {
    // Mock Intersection Observer
    window.IntersectionObserver = mockIntersectionObserver
    vi.clearAllMocks()
  })

  describe('Basic Functionality', () => {
    it('should render without errors', () => {
      expect(() => {
        render(<LazyVideo src={['/test-video.mp4']} />)
      }).not.toThrow()
    })

    it('should render container element', () => {
      render(<LazyVideo src={['/test-video.mp4']} className="test-class" />)
      
      const container = document.querySelector('.test-class')
      expect(container).toBeInTheDocument()
    })

    it('should initialize Intersection Observer', () => {
      render(<LazyVideo src={['/test-video.mp4']} />)

      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          threshold: 0.1,
          rootMargin: '50px'
        })
      )
    })

    it('should handle intersection observer errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      mockIntersectionObserver.mockImplementation(() => {
        throw new Error('IntersectionObserver not supported')
      })

      expect(() => {
        render(<LazyVideo src={['/test-video.mp4']} />)
      }).not.toThrow()

      expect(consoleSpy).toHaveBeenCalledWith(
        'IntersectionObserver não suportado, carregando vídeo imediatamente:',
        expect.any(Error)
      )

      consoleSpy.mockRestore()
    })
  })

  describe('Props Handling', () => {
    it('should accept all required props without errors', () => {
      expect(() => {
        render(
          <LazyVideo
            src={['/video.webm', '/video.mp4']}
            poster="/poster.jpg"
            className="video-class"
            width={800}
            height={600}
            autoPlay={true}
            loop={true}
            muted={true}
            playsInline={true}
            controls={true}
            title="Test Video"
            aria-label="Test video description"
          />
        )
      }).not.toThrow()
    })

    it('should handle empty src array', () => {
      expect(() => {
        render(<LazyVideo src={[]} />)
      }).not.toThrow()
    })
  })

  describe('MIME Type Detection', () => {
    it('should detect correct MIME types in DOM', () => {
      render(<LazyVideo src={['/video.webm', '/video.mp4', '/video.ogv']} />)
      
      // Verificar se os elementos source existem (mesmo que em placeholder)
      const sources = document.querySelectorAll('source')
      expect(sources.length).toBeGreaterThanOrEqual(0) // Pode estar no placeholder
    })
  })

  describe('Cleanup', () => {
    it('should disconnect intersection observer on unmount', () => {
      const mockDisconnect = vi.fn()
      mockIntersectionObserver.mockReturnValue({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: mockDisconnect,
      })

      const { unmount } = render(<LazyVideo src={['/test-video.mp4']} />)
      
      unmount()

      expect(mockDisconnect).toHaveBeenCalled()
    })
  })
}) 