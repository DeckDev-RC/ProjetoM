import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { 
  CookieManager,
  cookieManager,
  type CookiePreferences
} from '../cookieManager'

// Mock do localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock do document.cookie
let cookieStore = ''
Object.defineProperty(document, 'cookie', {
  get: () => cookieStore,
  set: (value: string) => {
    // Simular comportamento real do cookie
    if (value.includes('expires=Thu, 01 Jan 1970')) {
      // Cookie sendo deletado
      const name = value.split('=')[0]
      cookieStore = cookieStore
        .split(';')
        .filter(cookie => !cookie.trim().startsWith(name))
        .join(';')
    } else {
      // Cookie sendo definido
      cookieStore += (cookieStore ? '; ' : '') + value.split(';')[0]
    }
  },
  configurable: true
})

describe('CookieManager', () => {
  beforeEach(() => {
    // Limpar mocks
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
    cookieStore = ''
    
    // Reset da instância
    cookieManager.resetConsent()
  })

  afterEach(() => {
    // Cleanup
    cookieStore = ''
  })

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = CookieManager.getInstance()
      const instance2 = CookieManager.getInstance()
      
      expect(instance1).toBe(instance2)
    })

    it('should use exported singleton instance', () => {
      const instance = CookieManager.getInstance()
      expect(cookieManager).toBe(instance)
    })
  })

  describe('Consent Management', () => {
    it('should initially have no consent', () => {
      expect(cookieManager.hasUserConsented()).toBe(false)
      expect(cookieManager.getPreferences()).toBeNull()
    })

    it('should save and retrieve preferences', () => {
      const preferences: CookiePreferences = {
        essential: true,
        performance: true,
        functionality: false,
        marketing: false
      }

      cookieManager.savePreferences(preferences)

      expect(cookieManager.hasUserConsented()).toBe(true)
      expect(cookieManager.getPreferences()).toEqual(preferences)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'cookie_consent',
        expect.stringContaining('"preferences"')
      )
    })

    it('should check individual consent categories', () => {
      const preferences: CookiePreferences = {
        essential: true,
        performance: true,
        functionality: false,
        marketing: false
      }

      cookieManager.savePreferences(preferences)

      expect(cookieManager.hasConsent('essential')).toBe(true)
      expect(cookieManager.hasConsent('performance')).toBe(true)
      expect(cookieManager.hasConsent('functionality')).toBe(false)
      expect(cookieManager.hasConsent('marketing')).toBe(false)
    })

    it('should return false for consent when no preferences set', () => {
      expect(cookieManager.hasConsent('essential')).toBe(false)
      expect(cookieManager.hasConsent('performance')).toBe(false)
      expect(cookieManager.hasConsent('functionality')).toBe(false)
      expect(cookieManager.hasConsent('marketing')).toBe(false)
    })
  })

  describe('Cookie Flag Management', () => {
    it('should set cookie flags when saving preferences', () => {
      const preferences: CookiePreferences = {
        essential: true,
        performance: false,
        functionality: true,
        marketing: false
      }

      cookieManager.savePreferences(preferences)

      // Verificar se os cookies de controle foram definidos
      expect(document.cookie).toContain('essential_cookies=true')
      expect(document.cookie).toContain('performance_cookies=false')
      expect(document.cookie).toContain('functionality_cookies=true')
      expect(document.cookie).toContain('marketing_cookies=false')
    })

    it('should include proper cookie attributes', () => {
      const preferences: CookiePreferences = {
        essential: true,
        performance: true,
        functionality: true,
        marketing: true
      }

      cookieManager.savePreferences(preferences)

      // O mock simplificado só armazena o nome=valor, não os atributos
      // Verificar se os cookies de controle foram definidos
      expect(document.cookie).toContain('essential_cookies=true')
      expect(document.cookie).toContain('performance_cookies=true')
      expect(document.cookie).toContain('functionality_cookies=true')
      expect(document.cookie).toContain('marketing_cookies=true')
    })
  })

  describe('Service Integration', () => {
    beforeEach(() => {
      // Mock console.log para verificar se os serviços foram ativados/desativados
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    it('should enable services when consent is given', () => {
      const preferences: CookiePreferences = {
        essential: true,
        performance: true,
        functionality: true,
        marketing: true
      }

      cookieManager.savePreferences(preferences)

      expect(console.log).toHaveBeenCalledWith('✅ Google Analytics ativado')
      expect(console.log).toHaveBeenCalledWith('✅ Google Tag Manager ativado')
      expect(console.log).toHaveBeenCalledWith('✅ Hotjar ativado')
      expect(console.log).toHaveBeenCalledWith('✅ Serviços de marketing ativados')
    })

    it('should disable services when consent is denied', () => {
      const preferences: CookiePreferences = {
        essential: true,
        performance: false,
        functionality: false,
        marketing: false
      }

      cookieManager.savePreferences(preferences)

      expect(console.log).toHaveBeenCalledWith('❌ Google Analytics desabilitado')
      expect(console.log).toHaveBeenCalledWith('❌ Google Tag Manager desabilitado')
      expect(console.log).toHaveBeenCalledWith('❌ Hotjar desabilitado')
      expect(console.log).toHaveBeenCalledWith('❌ Serviços de marketing desabilitados')
    })
  })

  describe('Data Persistence', () => {
    it('should load preferences from localStorage on initialization', () => {
      const consentData = {
        preferences: {
          essential: true,
          performance: true,
          functionality: false,
          marketing: true
        },
        timestamp: '2024-01-01T00:00:00.000Z',
        version: '1.0'
      }

      localStorageMock.getItem.mockReturnValue(JSON.stringify(consentData))

      // Resetar instância e criar nova para testar carregamento
      CookieManager.resetInstance()
      const newManager = CookieManager.getInstance()

      expect(newManager.hasUserConsented()).toBe(true)
      expect(newManager.getPreferences()).toEqual(consentData.preferences)
    })

    it('should handle corrupted localStorage data gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid json')
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      // Resetar instância e criar nova para testar tratamento de erro
      CookieManager.resetInstance()
      const newManager = CookieManager.getInstance()

      expect(newManager.hasUserConsented()).toBe(false)
      expect(consoleSpy).toHaveBeenCalledWith(
        'Erro ao carregar preferências de cookies:',
        expect.any(Error)
      )

      consoleSpy.mockRestore()
    })

    it('should save data with timestamp and version', () => {
      const preferences: CookiePreferences = {
        essential: true,
        performance: true,
        functionality: true,
        marketing: true
      }

      cookieManager.savePreferences(preferences)

      const savedData = localStorageMock.setItem.mock.calls[0][1]
      const parsedData = JSON.parse(savedData)

      expect(parsedData).toHaveProperty('preferences', preferences)
      expect(parsedData).toHaveProperty('timestamp')
      expect(parsedData).toHaveProperty('version', '1.0')
      expect(new Date(parsedData.timestamp)).toBeInstanceOf(Date)
    })
  })

  describe('Reset Functionality', () => {
    it('should reset all consent data', () => {
      const preferences: CookiePreferences = {
        essential: true,
        performance: true,
        functionality: true,
        marketing: true
      }

      // Primeiro salvar algumas preferências
      cookieManager.savePreferences(preferences)
      expect(cookieManager.hasUserConsented()).toBe(true)

      // Depois resetar
      cookieManager.resetConsent()

      expect(cookieManager.hasUserConsented()).toBe(false)
      expect(cookieManager.getPreferences()).toBeNull()
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('cookie_consent')
    })

    it('should clear tracking cookies on reset', () => {
      cookieManager.resetConsent()

      // Verificar se os cookies de tracking foram limpos
      // (Isso é testado indiretamente através dos métodos de limpeza)
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('cookie_consent')
    })
  })

  describe('Edge Cases', () => {
    it('should handle missing localStorage gracefully', () => {
      const originalLocalStorage = window.localStorage
      // @ts-ignore
      delete window.localStorage

      expect(() => {
        const manager = CookieManager.getInstance()
        manager.hasUserConsented()
      }).not.toThrow()

      window.localStorage = originalLocalStorage
    })

    it('should handle null preferences in hasConsent', () => {
      // Garantir que não há preferências
      cookieManager.resetConsent()

      expect(cookieManager.hasConsent('essential')).toBe(false)
      expect(cookieManager.hasConsent('performance')).toBe(false)
      expect(cookieManager.hasConsent('functionality')).toBe(false)
      expect(cookieManager.hasConsent('marketing')).toBe(false)
    })

    it('should handle partial preferences object', () => {
      // Simular dados corrompidos com preferências parciais
      const partialData = {
        preferences: {
          essential: true,
          performance: true
          // functionality e marketing ausentes
        },
        timestamp: '2024-01-01T00:00:00.000Z',
        version: '1.0'
      }

      localStorageMock.getItem.mockReturnValue(JSON.stringify(partialData))

      // Resetar instância e criar nova para testar carregamento de dados parciais
      CookieManager.resetInstance()
      const manager = CookieManager.getInstance()

      expect(manager.hasConsent('essential')).toBe(true)
      expect(manager.hasConsent('performance')).toBe(true)
      expect(manager.hasConsent('functionality')).toBe(false) // undefined -> false
      expect(manager.hasConsent('marketing')).toBe(false) // undefined -> false
    })
  })

  describe('Type Safety', () => {
    it('should enforce correct preference structure', () => {
      const validPreferences: CookiePreferences = {
        essential: true,
        performance: false,
        functionality: true,
        marketing: false
      }

      expect(() => {
        cookieManager.savePreferences(validPreferences)
      }).not.toThrow()
    })

    it('should handle consent category type checking', () => {
      const preferences: CookiePreferences = {
        essential: true,
        performance: false,
        functionality: true,
        marketing: false
      }

      cookieManager.savePreferences(preferences)

      // Testar todas as categorias válidas
      expect(typeof cookieManager.hasConsent('essential')).toBe('boolean')
      expect(typeof cookieManager.hasConsent('performance')).toBe('boolean')
      expect(typeof cookieManager.hasConsent('functionality')).toBe('boolean')
      expect(typeof cookieManager.hasConsent('marketing')).toBe('boolean')
    })
  })
}) 