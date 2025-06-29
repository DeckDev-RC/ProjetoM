/**
 * Hooks Utilitários para Responsividade
 * 
 * Este arquivo contém hooks específicos para facilitar o uso da
 * responsividade em componentes, especialmente para cálculos
 * complexos como alturas, escalas e posicionamento.
 */

import { useMemo } from 'react'
import { useDeviceDetection, useOrientation } from './use-mobile'
import { 
  COMPONENT_CONFIG, 
  LANDSCAPE_ADJUSTMENTS,
  DeviceType 
} from '@/lib/responsive-config'

// Hook para cálculos de altura de container baseado no dispositivo
export function useResponsiveHeight(
  baseHeight: number = 980,
  componentKey?: keyof typeof COMPONENT_CONFIG
) {
  const deviceInfo = useDeviceDetection()
  const orientation = useOrientation()

  return useMemo(() => {
    let height = baseHeight * deviceInfo.scale + deviceInfo.margin
    
    // Usar configurações específicas do componente se fornecidas
    if (componentKey && COMPONENT_CONFIG[componentKey]) {
      const config = COMPONENT_CONFIG[componentKey] as any
      if (config.heightAdjustments && config.heightAdjustments[deviceInfo.type]) {
        height = height * config.heightAdjustments[deviceInfo.type]
      }
      
      // Aplicar limites do componente
      if (config.containerMaxHeight) {
        height = Math.min(height, config.containerMaxHeight)
      }
      if (config.containerMinHeight) {
        height = Math.max(height, config.containerMinHeight)
      }
    }
    
    // Ajustes para orientação landscape
    if (orientation === 'landscape' && (deviceInfo.isTablet || deviceInfo.isMobile)) {
      height = height * LANDSCAPE_ADJUSTMENTS.heightReduction
    }
    
    // Ajuste especial para telas muito baixas em landscape
    if (orientation === 'landscape' && deviceInfo.height < LANDSCAPE_ADJUSTMENTS.minHeightThreshold) {
      height = height * 0.6
    }
    
    return Math.round(height)
  }, [baseHeight, componentKey, deviceInfo, orientation])
}

// Hook para obter estilos de container responsivo
export function useResponsiveContainer(componentKey?: keyof typeof COMPONENT_CONFIG) {
  const deviceInfo = useDeviceDetection()
  const height = useResponsiveHeight(
    componentKey ? (COMPONENT_CONFIG[componentKey] as any)?.baseHeight : undefined,
    componentKey
  )

  return useMemo(() => {
    const containerStyles: React.CSSProperties = {
      height: `${height}px`,
      overflow: 'visible',
      transform: deviceInfo.isMobile ? `scale(${deviceInfo.scale * 0.9})` : 'scale(1)',
      transformOrigin: 'center top',
      containerType: 'inline-size' as any
    }

    const containerClasses = [
      'relative w-full',
      deviceInfo.isMobile ? 'mt-20 mx-5 px-8' : 'px-2 sm:px-4 lg:px-0 mt-0'
    ].join(' ')

    return {
      styles: containerStyles,
      classes: containerClasses,
      height
    }
  }, [deviceInfo, height])
}

// Hook para escala de componentes internos
export function useResponsiveInnerScale(
  baseWidth: number = 1200,
  baseHeight: number = 980
) {
  const deviceInfo = useDeviceDetection()

  return useMemo(() => {
    const innerStyles: React.CSSProperties = {
      transform: `translateX(-50%) scale(${deviceInfo.scale})`,
      width: `${baseWidth}px`,
      height: `${baseHeight}px`,
      transformOrigin: 'top center',
      padding: '20px'
    }

    const innerClasses = 'absolute left-1/2 transform-gpu'

    return {
      styles: innerStyles,
      classes: innerClasses,
      scale: deviceInfo.scale
    }
  }, [deviceInfo.scale, baseWidth, baseHeight])
}

// Hook para padding responsivo
export function useResponsivePadding(componentKey?: keyof typeof COMPONENT_CONFIG) {
  const deviceInfo = useDeviceDetection()

  return useMemo(() => {
    if (componentKey && COMPONENT_CONFIG[componentKey]) {
      const config = COMPONENT_CONFIG[componentKey] as any
      if (config.padding) {
        return deviceInfo.isMobile ? config.padding.mobile : config.padding.desktop
      }
    }

    // Padding padrão baseado no tipo de dispositivo
    const basePadding = deviceInfo.margin
    
    if (deviceInfo.isMobile) {
      return `${basePadding * 2}px ${basePadding}px`
    } else if (deviceInfo.isTablet) {
      return `${basePadding * 1.5}px ${basePadding * 1.2}px`
    } else {
      return `${basePadding}px ${basePadding * 1.5}px`
    }
  }, [deviceInfo, componentKey])
}

// Hook para animações responsivas
export function useResponsiveAnimation() {
  const deviceInfo = useDeviceDetection()

  return useMemo(() => {
    // Reduzir animações em dispositivos móveis ou quando o usuário prefere movimento reduzido
    const shouldReduceMotion = deviceInfo.isMobile
    
    return {
      duration: shouldReduceMotion ? '0.2s' : '0.3s',
      easing: 'ease-in-out',
      delay: shouldReduceMotion ? 50 : 150,
      shouldAnimate: !shouldReduceMotion
    }
  }, [deviceInfo.isMobile])
}

// Hook para breakpoints condicionais
export function useResponsiveValue<T>(values: Partial<Record<DeviceType, T>>, fallback: T): T {
  const deviceInfo = useDeviceDetection()
  
  return useMemo(() => {
    return values[deviceInfo.type] ?? fallback
  }, [values, fallback, deviceInfo.type])
}

// Hook para classes CSS condicionais baseadas no dispositivo
export function useResponsiveClassNames(
  classes: Partial<Record<DeviceType | 'mobile' | 'tablet' | 'desktop', string>>
): string {
  const deviceInfo = useDeviceDetection()
  
  return useMemo(() => {
    const classNames: string[] = []
    
    // Adicionar classe específica do tipo de dispositivo
    if (classes[deviceInfo.type]) {
      classNames.push(classes[deviceInfo.type]!)
    }
    
    // Adicionar classes por categoria
    if (deviceInfo.isMobile && classes.mobile) {
      classNames.push(classes.mobile)
    }
    
    if (deviceInfo.isTablet && classes.tablet) {
      classNames.push(classes.tablet)
    }
    
    if (deviceInfo.isDesktop && classes.desktop) {
      classNames.push(classes.desktop)
    }
    
    return classNames.join(' ')
  }, [classes, deviceInfo])
}

// Hook para gerenciar visibilidade baseada no dispositivo
export function useResponsiveVisibility(
  config: {
    hideOnMobile?: boolean
    hideOnTablet?: boolean
    hideOnDesktop?: boolean
    showOnlyOn?: DeviceType[]
  }
): boolean {
  const deviceInfo = useDeviceDetection()
  
  return useMemo(() => {
    // Se especificado showOnlyOn, mostrar apenas nesses dispositivos
    if (config.showOnlyOn) {
      return config.showOnlyOn.includes(deviceInfo.type)
    }
    
    // Verificar se deve esconder no dispositivo atual
    if (config.hideOnMobile && deviceInfo.isMobile) return false
    if (config.hideOnTablet && deviceInfo.isTablet) return false
    if (config.hideOnDesktop && deviceInfo.isDesktop) return false
    
    return true
  }, [config, deviceInfo])
}

// Hook para cálculos de grid responsivo
export function useResponsiveGrid(
  columns: Partial<Record<DeviceType, number>>,
  gap: Partial<Record<DeviceType, string>> = {}
) {
  const deviceInfo = useDeviceDetection()
  
  return useMemo(() => {
    const columnCount = columns[deviceInfo.type] ?? columns.desktop ?? 1
    const gridGap = gap[deviceInfo.type] ?? gap.desktop ?? '1rem'
    
    return {
      gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
      gap: gridGap,
      columnCount
    }
  }, [columns, gap, deviceInfo.type])
}

// Hook para font sizes responsivos
export function useResponsiveFontSize(
  sizes: Partial<Record<DeviceType | 'mobile' | 'tablet' | 'desktop', string>>,
  fallback: string = '1rem'
): string {
  const deviceInfo = useDeviceDetection()
  
  return useMemo(() => {
    // Tentar tamanho específico do dispositivo primeiro
    if (sizes[deviceInfo.type]) {
      return sizes[deviceInfo.type]!
    }
    
    // Tentar por categoria
    if (deviceInfo.isMobile && sizes.mobile) {
      return sizes.mobile
    }
    
    if (deviceInfo.isTablet && sizes.tablet) {
      return sizes.tablet
    }
    
    if (deviceInfo.isDesktop && sizes.desktop) {
      return sizes.desktop
    }
    
    return fallback
  }, [sizes, fallback, deviceInfo])
}

// Hook para gerenciar interações touch vs mouse
export function useResponsiveInteraction() {
  const deviceInfo = useDeviceDetection()
  
  return useMemo(() => {
    const isTouchDevice = deviceInfo.isMobile || deviceInfo.isTablet
    
    return {
      isTouchDevice,
      hoverEnabled: !isTouchDevice,
      tapTarget: isTouchDevice ? '44px' : '32px', // Tamanho mínimo recomendado para toque
      interactionDelay: isTouchDevice ? 0 : 200 // Delay para hover em desktop
    }
  }, [deviceInfo])
} 