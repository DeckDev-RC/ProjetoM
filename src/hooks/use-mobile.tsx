import * as React from "react"
import { 
  DeviceType, 
  OrientationType,
  DeviceInfo,
  DEVICE_BREAKPOINTS,
  DEFAULT_DEVICE_CONFIG,
  getDeviceConfig,
  calculateFinalScale,
  getResponsiveClasses,
  HIGH_DPI_ADJUSTMENTS,
  ULTRA_WIDE_ADJUSTMENTS
} from "@/lib/responsive-config"

// Hook simples para compatibilidade com código existente
const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

// Hook principal para detecção avançada de dispositivos
export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = React.useState<DeviceInfo>(DEFAULT_DEVICE_CONFIG)

  React.useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      // Determinar tipo de dispositivo
      let deviceType: DeviceType = 'desktop'
      for (const [type, breakpoint] of Object.entries(DEVICE_BREAKPOINTS)) {
        if (width >= breakpoint.min && width <= breakpoint.max) {
          deviceType = type as DeviceType
          break
        }
      }

      // Determinar orientação
      const orientation: OrientationType = width > height ? 'landscape' : 'portrait'
      
      // Detectar alta densidade de pixels
      const isHighDPI = window.devicePixelRatio >= HIGH_DPI_ADJUSTMENTS.minDevicePixelRatio
      
      // Detectar telas ultra-wide
      const aspectRatio = width / height
      const isUltraWide = aspectRatio >= ULTRA_WIDE_ADJUSTMENTS.minAspectRatio
      
      // Calcular escala final
      const scale = calculateFinalScale(deviceType, orientation, isHighDPI, isUltraWide)
      
      // Obter configurações do dispositivo
      const config = getDeviceConfig(deviceType)

      setDeviceInfo({
        type: deviceType,
        width,
        height,
        isMobile: config.isMobile,
        isTablet: config.isTablet,
        isDesktop: config.isDesktop,
        scale,
        orientation,
        isHighDPI,
        isUltraWide,
        margin: config.margin
      })
    }

    // Usar matchMedia para cada breakpoint para melhor performance
    const mediaQueries = Object.entries(DEVICE_BREAKPOINTS).map(([type, breakpoint]) => {
      const query = breakpoint.max === Infinity 
        ? `(min-width: ${breakpoint.min}px)`
        : `(min-width: ${breakpoint.min}px) and (max-width: ${breakpoint.max}px)`
      
      const mql = window.matchMedia(query)
      mql.addEventListener('change', updateDeviceInfo)
      return { mql, type }
    })

    // Listener para mudanças de orientação
    const orientationMql = window.matchMedia('(orientation: landscape)')
    orientationMql.addEventListener('change', updateDeviceInfo)

    // Listener para mudanças de densidade de pixels (zoom)
    window.addEventListener('resize', updateDeviceInfo)

    // Inicializar
    updateDeviceInfo()

    // Cleanup
    return () => {
      mediaQueries.forEach(({ mql }) => {
        mql.removeEventListener('change', updateDeviceInfo)
      })
      orientationMql.removeEventListener('change', updateDeviceInfo)
      window.removeEventListener('resize', updateDeviceInfo)
    }
  }, [])

  return deviceInfo
}

// Hook para obter classes CSS responsivas
export function useResponsiveClasses() {
  const deviceInfo = useDeviceDetection()
  
  return React.useMemo(() => {
    const classes = getResponsiveClasses(deviceInfo.type)
    const orientationClass = `orientation-${deviceInfo.orientation}`
    const dpiClass = deviceInfo.isHighDPI ? 'high-dpi' : 'standard-dpi'
    const aspectClass = deviceInfo.isUltraWide ? 'ultra-wide' : 'standard-aspect'
    
    return `${classes} ${orientationClass} ${dpiClass} ${aspectClass}`
  }, [deviceInfo])
}

// Hook para detecção de orientação
export function useOrientation(): OrientationType {
  const [orientation, setOrientation] = React.useState<OrientationType>('portrait')

  React.useEffect(() => {
    const updateOrientation = () => {
      setOrientation(window.innerWidth > window.innerHeight ? 'landscape' : 'portrait')
    }

    updateOrientation()
    
    const mql = window.matchMedia('(orientation: landscape)')
    mql.addEventListener('change', updateOrientation)
    window.addEventListener('resize', updateOrientation)

    return () => {
      mql.removeEventListener('change', updateOrientation)
      window.removeEventListener('resize', updateOrientation)
    }
  }, [])

  return orientation
}

// Hook para viewport dimensions com debounce
export function useViewport() {
  const [viewport, setViewport] = React.useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  })

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const updateViewport = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setViewport({
          width: window.innerWidth,
          height: window.innerHeight
        })
      }, 100) // Debounce de 100ms
    }

    window.addEventListener('resize', updateViewport)
    window.addEventListener('orientationchange', updateViewport)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', updateViewport)
      window.removeEventListener('orientationchange', updateViewport)
    }
  }, [])

  return viewport
}

// Hook para breakpoint específico
export function useBreakpoint(breakpoint: DeviceType): boolean {
  const deviceInfo = useDeviceDetection()
  return deviceInfo.type === breakpoint
}

// Hook para múltiplos breakpoints
export function useBreakpoints(breakpoints: DeviceType[]): boolean {
  const deviceInfo = useDeviceDetection()
  return breakpoints.includes(deviceInfo.type)
}

// Hook para media query customizada
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false)

  React.useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    
    setMatches(mql.matches)
    mql.addEventListener('change', onChange)
    
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

// Hook para detectar se está em modo touch
export function useTouchDevice(): boolean {
  const [isTouch, setIsTouch] = React.useState(false)

  React.useEffect(() => {
    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }
    
    checkTouch()
    
    // Verificar novamente após um pequeno delay para garantir precisão
    const timeoutId = setTimeout(checkTouch, 100)
    
    return () => clearTimeout(timeoutId)
  }, [])

  return isTouch
}

// Hook para detectar se o usuário prefere movimento reduzido
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

// Hook para detectar tema preferido do sistema - DESABILITADO para evitar interferência
// export function usePrefersColorScheme(): 'light' | 'dark' | null {
//   const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
//   const prefersLight = useMediaQuery('(prefers-color-scheme: light)')
//   
//   if (prefersDark) return 'dark'
//   if (prefersLight) return 'light'
//   return null
// }

// Hook combinado para todas as informações de ambiente
export function useEnvironment() {
  const deviceInfo = useDeviceDetection()
  const viewport = useViewport()
  const isTouch = useTouchDevice()
  const prefersReducedMotion = usePrefersReducedMotion()
  // const preferredColorScheme = usePrefersColorScheme() // DESABILITADO
  const responsiveClasses = useResponsiveClasses()

  return {
    device: deviceInfo,
    viewport,
    isTouch,
    prefersReducedMotion,
    // preferredColorScheme, // REMOVIDO para evitar interferência do tema do sistema
    responsiveClasses
  }
}
