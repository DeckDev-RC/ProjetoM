/**
 * Configuração Centralizada de Responsividade
 * 
 * Este arquivo centraliza todas as configurações de breakpoints, escalas,
 * margens e ajustes para diferentes dispositivos e orientações.
 * 
 * Facilita a manutenção e permite ajustes rápidos em todo o projeto.
 */

// Tipos de dispositivos baseados em breakpoints reais
export type DeviceType = 
  | 'mobile-xs'   // iPhone SE, Galaxy Fold
  | 'mobile-sm'   // iPhone 12/13/14, iPhone 12 Pro  
  | 'mobile-md'   // iPhone 12/13/14 Pro Max, Pixel 6
  | 'tablet-sm'   // iPad Mini, tablets pequenos
  | 'tablet-md'   // iPad, tablets médios
  | 'tablet-lg'   // iPad Pro, tablets grandes
  | 'desktop'     // Desktop

export type OrientationType = 'portrait' | 'landscape'

// Breakpoints baseados em dispositivos reais
export const DEVICE_BREAKPOINTS = {
  'mobile-xs': { min: 0, max: 374, name: 'iPhone SE, Galaxy Fold' },
  'mobile-sm': { min: 375, max: 414, name: 'iPhone 12/13/14, iPhone 12 Pro' },
  'mobile-md': { min: 415, max: 480, name: 'iPhone Pro Max, Pixel 6' },
  'tablet-sm': { min: 481, max: 768, name: 'iPad Mini, tablets pequenos' },
  'tablet-md': { min: 769, max: 1024, name: 'iPad, tablets médios' },
  'tablet-lg': { min: 1025, max: 1200, name: 'iPad Pro, tablets grandes' },
  'desktop': { min: 1201, max: Infinity, name: 'Desktop' }
} as const

// Configurações de escala para cada tipo de dispositivo
export const DEVICE_SCALES = {
  'mobile-xs': 0.35,
  'mobile-sm': 0.4,
  'mobile-md': 0.45,
  'tablet-sm': 0.55,
  'tablet-md': 0.7,
  'tablet-lg': 0.85,
  'desktop': 1.0
} as const

// Margens de segurança para cada tipo de dispositivo
export const DEVICE_MARGINS = {
  'mobile-xs': 10,
  'mobile-sm': 15,
  'mobile-md': 20,
  'tablet-sm': 25,
  'tablet-md': 30,
  'tablet-lg': 35,
  'desktop': 40
} as const

// Configurações específicas para orientação landscape
export const LANDSCAPE_ADJUSTMENTS = {
  scaleMultiplier: 1.1,        // Multiplicador da escala em landscape
  heightReduction: 0.8,        // Redução de altura em landscape
  marginReduction: 0.9,        // Redução de margens em landscape
  minHeightThreshold: 450      // Altura mínima para aplicar ajustes especiais
} as const

// Configurações para alta densidade de pixels (Retina, etc.)
export const HIGH_DPI_ADJUSTMENTS = {
  scaleMultiplier: 1.05,       // Multiplicador para telas de alta densidade
  minDevicePixelRatio: 2       // Ratio mínimo para considerar alta densidade
} as const

// Configurações para telas ultra-wide
export const ULTRA_WIDE_ADJUSTMENTS = {
  scaleMultiplier: 1.1,        // Multiplicador para telas ultra-wide
  minAspectRatio: 21/9         // Aspect ratio mínimo para considerar ultra-wide
} as const

// Configurações de animação e transição
export const ANIMATION_CONFIG = {
  transitionDuration: '0.3s',
  transitionEasing: 'ease-in-out',
  animationDelay: {
    base: 0,
    increment: 150             // ms entre animações sequenciais
  }
} as const

// Configurações específicas para componentes
export const COMPONENT_CONFIG = {
  processOptimization: {
    baseHeight: 980,
    containerMaxHeight: 1100,
    containerMinHeight: 400,
    cardWidth: 300,
    cardHeight: 380,
    svgViewBox: '0 0 1200 980',
    heightAdjustments: {
      'mobile-xs': 0.7,
      'mobile-sm': 0.75,
      'mobile-md': 0.8,
      'tablet-sm': 0.85,
      'tablet-md': 0.9,
      'tablet-lg': 0.95,
      'desktop': 1.0
    }
  },
  hero: {
    padding: {
      mobile: '100px 12px 40px',
      desktop: '120px 20px 60px'
    },
    videoScale: 12,
    videoTranslate: { x: 65, y: 23 }
  },
  navbar: {
    mobileMenuWidth: '75%',
    mobileMenuMaxWidth: '400px',
    scrollThreshold: 10
  }
} as const

// Utilitário para obter configurações específicas de um dispositivo
export function getDeviceConfig(deviceType: DeviceType) {
  return {
    type: deviceType,
    breakpoint: DEVICE_BREAKPOINTS[deviceType],
    scale: DEVICE_SCALES[deviceType],
    margin: DEVICE_MARGINS[deviceType],
    isMobile: ['mobile-xs', 'mobile-sm', 'mobile-md'].includes(deviceType),
    isTablet: ['tablet-sm', 'tablet-md', 'tablet-lg'].includes(deviceType),
    isDesktop: deviceType === 'desktop'
  }
}

// Utilitário para calcular escala final considerando todos os ajustes
export function calculateFinalScale(
  deviceType: DeviceType,
  orientation: OrientationType,
  isHighDPI: boolean = false,
  isUltraWide: boolean = false
): number {
  let scale: number = DEVICE_SCALES[deviceType]
  
  // Ajuste para orientação landscape
  if (orientation === 'landscape') {
    scale *= LANDSCAPE_ADJUSTMENTS.scaleMultiplier
  }
  
  // Ajuste para alta densidade de pixels
  if (isHighDPI) {
    scale *= HIGH_DPI_ADJUSTMENTS.scaleMultiplier
  }
  
  // Ajuste para telas ultra-wide
  if (isUltraWide) {
    scale *= ULTRA_WIDE_ADJUSTMENTS.scaleMultiplier
  }
  
  // Para desktop, calcular escala baseada na largura
  if (deviceType === 'desktop' && typeof window !== 'undefined') {
    const dynamicScale = Math.min(1.0, Math.max(0.8, window.innerWidth / 1200))
    scale = dynamicScale
  }
  
  return Math.max(0.2, Math.min(2.0, scale)) // Limitar entre 0.2 e 2.0
}

// Utilitário para obter classes CSS responsivas
export function getResponsiveClasses(deviceType: DeviceType): string {
  const config = getDeviceConfig(deviceType)
  
  const classes = []
  
  if (config.isMobile) {
    classes.push('is-mobile')
  }
  
  if (config.isTablet) {
    classes.push('is-tablet')
  }
  
  if (config.isDesktop) {
    classes.push('is-desktop')
  }
  
  classes.push(`device-${deviceType}`)
  
  return classes.join(' ')
}

// Configuração padrão para o hook useDeviceDetection
export const DEFAULT_DEVICE_CONFIG = {
  type: 'desktop' as DeviceType,
  width: 1200,
  height: 800,
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  scale: 1,
  orientation: 'landscape' as OrientationType,
  isHighDPI: false,
  isUltraWide: false,
  margin: DEVICE_MARGINS.desktop
}

export type DeviceInfo = {
  type: DeviceType;
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  scale: number;
  orientation: OrientationType;
  isHighDPI: boolean;
  isUltraWide: boolean;
  margin: number; // Permitir qualquer número, não apenas 40
} 