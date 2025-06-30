import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Contact from '../Contact'

// Mock do toast
const mockToast = vi.fn()
vi.mock('../ui/use-toast', () => ({
  useToast: () => ({
    toast: mockToast
  })
}))

describe('Contact Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render contact section with correct structure', () => {
      render(<Contact />)
      
      expect(screen.getByText('Vamos construir sua solução de')).toBeInTheDocument()
      expect(screen.getByText('IA personalizada.')).toBeInTheDocument()
      expect(screen.getByText('Preencha seus dados e fale com nossos especialistas.')).toBeInTheDocument()
    })

    it('should render all form fields', () => {
      render(<Contact />)
      
      expect(screen.getByPlaceholderText('Nome*')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Email*')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Número de Telefone*')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Nome da Empresa')).toBeInTheDocument()
    })

    it('should render submit button', () => {
      render(<Contact />)
      
      const submitButton = screen.getByRole('button', { name: /solicitar proposta/i })
      expect(submitButton).toBeInTheDocument()
      expect(submitButton).not.toBeDisabled()
    })

    it('should have correct section id for navigation', () => {
      render(<Contact />)
      
      const section = document.querySelector('#contact')
      expect(section).toBeInTheDocument()
    })
  })

  describe('Form Interaction', () => {
    it('should allow typing in form fields', async () => {
      const user = userEvent.setup()
      render(<Contact />)
      
      const nomeInput = screen.getByPlaceholderText('Nome*')
      const emailInput = screen.getByPlaceholderText('Email*')
      const telefoneInput = screen.getByPlaceholderText('Número de Telefone*')
      const empresaInput = screen.getByPlaceholderText('Nome da Empresa')
      
      await user.type(nomeInput, 'João Silva')
      await user.type(emailInput, 'joao@exemplo.com')
      await user.type(telefoneInput, '11999999999')
      await user.type(empresaInput, 'Empresa Teste')
      
      expect(nomeInput).toHaveValue('João Silva')
      expect(emailInput).toHaveValue('joao@exemplo.com')
      expect(telefoneInput).toHaveValue('11999999999')
      expect(empresaInput).toHaveValue('Empresa Teste')
    })

    it('should show toast on form submission', async () => {
      const user = userEvent.setup()
      render(<Contact />)
      
      // Preencher campos obrigatórios
      const nomeInput = screen.getByPlaceholderText('Nome*')
      const emailInput = screen.getByPlaceholderText('Email*')
      const telefoneInput = screen.getByPlaceholderText('Número de Telefone*')
      
      await user.type(nomeInput, 'João Silva')
      await user.type(emailInput, 'joao@exemplo.com')
      await user.type(telefoneInput, '11999999999')
      
      const submitButton = screen.getByRole('button', { name: /solicitar proposta/i })
      await user.click(submitButton)
      
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Proposta enviada!',
        description: 'Entraremos em contato em breve.',
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper form structure', () => {
      render(<Contact />)
      
      const form = document.querySelector('form')
      expect(form).toBeInTheDocument()
    })

    it('should have required fields marked', () => {
      render(<Contact />)
      
      const nomeInput = screen.getByPlaceholderText('Nome*')
      const emailInput = screen.getByPlaceholderText('Email*')
      const telefoneInput = screen.getByPlaceholderText('Número de Telefone*')
      const empresaInput = screen.getByPlaceholderText('Nome da Empresa')
      
      expect(nomeInput).toHaveAttribute('required')
      expect(emailInput).toHaveAttribute('required')
      expect(telefoneInput).toHaveAttribute('required')
      expect(empresaInput).not.toHaveAttribute('required')
    })
  })

  describe('Visual Effects', () => {
    it('should render without errors', () => {
      expect(() => {
        render(<Contact />)
      }).not.toThrow()
    })
  })
})
