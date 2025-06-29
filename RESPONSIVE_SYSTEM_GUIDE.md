# 📱 Sistema de Responsividade Centralizado

Este projeto implementa um sistema de responsividade avançado e centralizado que facilita a criação de interfaces adaptáveis para todos os dispositivos.

## 🎯 Visão Geral

O sistema é composto por três camadas principais:

1. **Configuração Centralizada** (`src/lib/responsive-config.ts`)
2. **Hooks de Detecção** (`src/hooks/use-mobile.tsx`)
3. **Hooks Utilitários** (`src/hooks/useResponsiveUtils.ts`)

## 🔧 Configuração Centralizada

### Breakpoints de Dispositivos

```typescript
// Todos os breakpoints são baseados em dispositivos reais
export const DEVICE_BREAKPOINTS = {
  'mobile-xs': { min: 0, max: 374 },      // iPhone SE, Galaxy Fold
  'mobile-sm': { min: 375, max: 414 },    // iPhone 12/13/14
  'mobile-md': { min: 415, max: 480 },    // iPhone Pro Max, Pixel 6
  'tablet-sm': { min: 481, max: 768 },    // iPad Mini
  'tablet-md': { min: 769, max: 1024 },   // iPad
  'tablet-lg': { min: 1025, max: 1200 },  // iPad Pro
  'desktop': { min: 1201, max: Infinity } // Desktop
}
```

### Escalas por Dispositivo

```typescript
export const DEVICE_SCALES = {
  'mobile-xs': 0.35,
  'mobile-sm': 0.4,
  'mobile-md': 0.45,
  'tablet-sm': 0.55,
  'tablet-md': 0.7,
  'tablet-lg': 0.85,
  'desktop': 1.0
}
```

### Configurações por Componente

```typescript
export const COMPONENT_CONFIG = {
  processOptimization: {
    baseHeight: 980,
    containerMaxHeight: 1100,
    containerMinHeight: 400,
    // ... outras configurações
  },
  hero: {
    padding: {
      mobile: '100px 12px 40px',
      desktop: '120px 20px 60px'
    },
    // ... outras configurações
  }
}
```

## 🎣 Hooks de Detecção

### `useDeviceDetection()`

Hook principal que retorna informações completas sobre o dispositivo:

```typescript
const deviceInfo = useDeviceDetection();

// deviceInfo contém:
{
  type: 'mobile-sm',        // Tipo do dispositivo
  width: 375,               // Largura da tela
  height: 812,              // Altura da tela
  isMobile: true,           // É mobile?
  isTablet: false,          // É tablet?
  isDesktop: false,         // É desktop?
  scale: 0.4,               // Escala calculada
  orientation: 'portrait',   // Orientação
  isHighDPI: true,          // Alta densidade de pixels?
  isUltraWide: false,       // Tela ultra-wide?
  margin: 15                // Margem de segurança
}
```

### Outros Hooks de Detecção

```typescript
// Orientação
const orientation = useOrientation(); // 'portrait' | 'landscape'

// Viewport com debounce
const { width, height } = useViewport();

// Breakpoint específico
const isMobileXS = useBreakpoint('mobile-xs');

// Múltiplos breakpoints
const isMobile = useBreakpoints(['mobile-xs', 'mobile-sm', 'mobile-md']);

// Media query customizada
const isLandscape = useMediaQuery('(orientation: landscape)');

// Dispositivo touch
const isTouch = useTouchDevice();

// Preferências do usuário
const prefersReducedMotion = usePrefersReducedMotion();
const colorScheme = usePrefersColorScheme(); // 'light' | 'dark' | null
```

## 🛠️ Hooks Utilitários

### `useResponsiveContainer()`

Para containers que precisam de altura e escala responsivas:

```typescript
const container = useResponsiveContainer('processOptimization');

return (
  <div 
    className={container.classes}
    style={container.styles}
  >
    {/* Conteúdo */}
  </div>
);
```

### `useResponsiveInnerScale()`

Para elementos internos que precisam de escala:

```typescript
const innerScale = useResponsiveInnerScale(1200, 980);

return (
  <div 
    className={innerScale.classes}
    style={innerScale.styles}
  >
    {/* Conteúdo escalado */}
  </div>
);
```

### `useResponsiveValue()`

Para valores condicionais baseados no dispositivo:

```typescript
const fontSize = useResponsiveValue({
  'mobile-xs': '14px',
  'mobile-sm': '16px',
  'tablet-md': '18px',
  'desktop': '20px'
}, '16px');

const videoSettings = useResponsiveValue({
  'mobile-xs': { scale: 8, translateX: 50 },
  'mobile-sm': { scale: 9, translateX: 55 },
  'desktop': { scale: 12, translateX: 65 }
}, { scale: 12, translateX: 65 });
```

### `useResponsiveClassNames()`

Para classes CSS condicionais:

```typescript
const classes = useResponsiveClassNames({
  'mobile-xs': 'text-sm p-2',
  'mobile-sm': 'text-base p-3',
  'tablet-md': 'text-lg p-4',
  'desktop': 'text-xl p-6',
  mobile: 'flex-col',
  tablet: 'flex-row',
  desktop: 'grid grid-cols-3'
});
```

### `useResponsiveVisibility()`

Para controlar visibilidade por dispositivo:

```typescript
const isVisible = useResponsiveVisibility({
  hideOnMobile: true,
  showOnlyOn: ['tablet-md', 'tablet-lg', 'desktop']
});

if (!isVisible) return null;
```

### `useResponsiveGrid()`

Para grids responsivos:

```typescript
const grid = useResponsiveGrid(
  {
    'mobile-xs': 1,
    'mobile-sm': 1,
    'tablet-md': 2,
    'desktop': 3
  },
  {
    'mobile-xs': '1rem',
    'tablet-md': '1.5rem',
    'desktop': '2rem'
  }
);

return (
  <div style={grid}>
    {/* Items do grid */}
  </div>
);
```

## 📝 Como Usar em Componentes

### Exemplo Básico

```typescript
import { useDeviceDetection } from '@/hooks/use-mobile';
import { useResponsiveValue, useResponsivePadding } from '@/hooks/useResponsiveUtils';

const MyComponent = () => {
  const deviceInfo = useDeviceDetection();
  const padding = useResponsivePadding();
  
  const buttonSize = useResponsiveValue({
    'mobile-xs': 'small',
    'mobile-sm': 'medium',
    'desktop': 'large'
  }, 'medium');

  return (
    <div style={{ padding }}>
      <h1>Dispositivo: {deviceInfo.type}</h1>
      <button className={`btn btn-${buttonSize}`}>
        Clique aqui
      </button>
    </div>
  );
};
```

### Exemplo Avançado

```typescript
import { 
  useDeviceDetection,
  useResponsiveContainer,
  useResponsiveInnerScale,
  useResponsiveAnimation,
  useResponsiveValue
} from '@/hooks/useResponsiveUtils';

const AdvancedComponent = () => {
  const deviceInfo = useDeviceDetection();
  const container = useResponsiveContainer('customComponent');
  const innerScale = useResponsiveInnerScale();
  const animation = useResponsiveAnimation();
  
  const cardConfig = useResponsiveValue({
    'mobile-xs': { columns: 1, gap: '1rem' },
    'mobile-sm': { columns: 1, gap: '1.5rem' },
    'tablet-md': { columns: 2, gap: '2rem' },
    'desktop': { columns: 3, gap: '2.5rem' }
  }, { columns: 1, gap: '1rem' });

  return (
    <section className="responsive-section">
      <div 
        className={container.classes}
        style={container.styles}
      >
        <div 
          className={innerScale.classes}
          style={innerScale.styles}
        >
          <div 
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${cardConfig.columns}, 1fr)`,
              gap: cardConfig.gap,
              transition: `all ${animation.duration} ${animation.easing}`
            }}
          >
            {/* Cards */}
          </div>
        </div>
      </div>
    </section>
  );
};
```

## ⚙️ Configuração Fácil

### Ajustar Breakpoints

Para modificar os breakpoints, edite `src/lib/responsive-config.ts`:

```typescript
// Exemplo: Adicionar breakpoint para tablets grandes
export const DEVICE_BREAKPOINTS = {
  // ... outros breakpoints
  'tablet-xl': { min: 1201, max: 1440, name: 'Tablets Extra Large' },
  'desktop': { min: 1441, max: Infinity, name: 'Desktop' }
}

// Adicionar escala correspondente
export const DEVICE_SCALES = {
  // ... outras escalas
  'tablet-xl': 0.9,
  'desktop': 1.0
}
```

### Adicionar Configuração de Componente

```typescript
export const COMPONENT_CONFIG = {
  // ... outros componentes
  myNewComponent: {
    baseHeight: 600,
    containerMaxHeight: 800,
    containerMinHeight: 300,
    padding: {
      mobile: '20px 10px',
      desktop: '40px 20px'
    },
    heightAdjustments: {
      'mobile-xs': 0.8,
      'mobile-sm': 0.85,
      'mobile-md': 0.9,
      'desktop': 1.0
    }
  }
}
```

### Ajustar Escalas

```typescript
// Para fazer elementos menores em mobile
export const DEVICE_SCALES = {
  'mobile-xs': 0.25,  // Era 0.35, agora menor
  'mobile-sm': 0.3,   // Era 0.4, agora menor
  // ... outros
}

// Para ajustar orientação landscape
export const LANDSCAPE_ADJUSTMENTS = {
  scaleMultiplier: 1.2,     // Era 1.1, agora maior
  heightReduction: 0.7,     // Era 0.8, agora menor
  marginReduction: 0.8,     // Era 0.9, agora menor
}
```

## 🎨 Classes CSS Automáticas

O sistema gera automaticamente classes CSS que você pode usar:

```css
/* Classes de dispositivo */
.is-mobile { /* Estilos para mobile */ }
.is-tablet { /* Estilos para tablet */ }
.is-desktop { /* Estilos para desktop */ }

/* Classes específicas */
.device-mobile-xs { /* iPhone SE */ }
.device-mobile-sm { /* iPhone 12 */ }
.device-tablet-md { /* iPad */ }

/* Classes de orientação */
.orientation-portrait { /* Orientação retrato */ }
.orientation-landscape { /* Orientação paisagem */ }

/* Classes de densidade */
.high-dpi { /* Telas de alta densidade */ }
.standard-dpi { /* Telas padrão */ }

/* Classes de aspecto */
.ultra-wide { /* Telas ultra-wide */ }
.standard-aspect { /* Telas padrão */ }
```

## 🚀 Benefícios

1. **Centralizado**: Todas as configurações em um lugar
2. **Flexível**: Fácil de ajustar e personalizar
3. **Performático**: Usa `matchMedia` para detecção eficiente
4. **TypeScript**: Totalmente tipado para melhor DX
5. **Reutilizável**: Hooks podem ser usados em qualquer componente
6. **Manutenível**: Código limpo e bem organizado

## 🔄 Migração de Componentes Existentes

### Antes (código manual):

```typescript
const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };
  checkMobile();
  window.addEventListener('resize', checkMobile);
  return () => window.removeEventListener('resize', checkMobile);
}, []);

const padding = isMobile ? '20px 10px' : '40px 20px';
```

### Depois (usando o sistema):

```typescript
const deviceInfo = useDeviceDetection();
const padding = useResponsivePadding();
```

## 📋 Checklist de Implementação

- [x] ✅ Configuração centralizada criada
- [x] ✅ Hooks de detecção implementados
- [x] ✅ Hooks utilitários criados
- [x] ✅ ProcessOptimizationSection refatorado
- [x] ✅ Hero refatorado
- [x] ✅ Navbar refatorado
- [ ] 🔄 Features refatorado
- [ ] 🔄 Footer refatorado
- [ ] 🔄 Outros componentes

## 💡 Próximos Passos

1. Refatorar componentes restantes
2. Adicionar testes unitários
3. Criar Storybook para documentação visual
4. Adicionar suporte a temas responsivos
5. Implementar lazy loading responsivo

---

**Desenvolvido com ❤️ para facilitar o desenvolvimento responsivo!** 