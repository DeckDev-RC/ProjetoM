# 🍪 Setup do Sistema de Cookies - Mind AI

## 📋 **Status Atual**

### ✅ **100% Funcional**
- Banner de consentimento interativo
- Persistência de preferências (localStorage + cookies)
- Interface granular por categoria
- Página de política completa (`/cookies`)
- Hook React para uso em componentes (`useCookieConsent`)
- Painel de debug (desenvolvimento)

### ⚙️ **Configuração Necessária**
- IDs dos serviços de terceiros (Google Analytics, GTM, Hotjar, etc.)
- Configuração de domínios para cookies
- Personalização por ambiente

## 🔧 **Configuração para Produção**

### 1. **Google Analytics**
```typescript
// Em src/utils/cookieManager.ts, linha 87
const GA_ID = 'G-XXXXXXXXXX'; // ← Substituir pelo seu ID real

// Também na linha 111
(window as any)['ga-disable-G-XXXXXXXXXX'] = true; // ← Mesmo ID
```

**Como obter:**
1. Acesse [Google Analytics](https://analytics.google.com)
2. Crie uma propriedade GA4
3. Copie o Measurement ID (formato: `G-XXXXXXXXXX`)

### 2. **Google Tag Manager**
```typescript
// Em src/utils/cookieManager.ts, linha 118
const GTM_ID = 'GTM-XXXXXXX'; // ← Substituir pelo seu ID real
```

**Como obter:**
1. Acesse [Google Tag Manager](https://tagmanager.google.com)
2. Crie um container
3. Copie o Container ID (formato: `GTM-XXXXXXX`)

### 3. **Hotjar**
```typescript
// Em src/utils/cookieManager.ts, linha 143
const HOTJAR_ID = 1234567; // ← Substituir pelo seu ID real
```

**Como obter:**
1. Acesse [Hotjar](https://www.hotjar.com)
2. Crie um site
3. Copie o Site ID (apenas números)

### 4. **Facebook Pixel**
```typescript
// Em src/utils/cookieManager.ts, linha 185
const FB_PIXEL_ID = '1234567890123456'; // ← Substituir pelo seu ID real
```

**Como obter:**
1. Acesse [Facebook Business](https://business.facebook.com)
2. Vá em Events Manager
3. Crie um pixel e copie o ID

### 5. **LinkedIn Insight Tag**
```typescript
// Em src/utils/cookieManager.ts, linha 203
const LINKEDIN_ID = '1234567'; // ← Substituir pelo seu ID real
```

**Como obter:**
1. Acesse [LinkedIn Campaign Manager](https://www.linkedin.com/campaignmanager)
2. Vá em Account Assets → Insight Tag
3. Copie o Partner ID

## 🌍 **Configuração por Ambiente**

### Opção 1: Variáveis de Ambiente
```typescript
// .env.local
VITE_GA_ID=G-XXXXXXXXXX
VITE_GTM_ID=GTM-XXXXXXX
VITE_HOTJAR_ID=1234567
VITE_FB_PIXEL_ID=1234567890123456
VITE_LINKEDIN_ID=1234567

// .env.production
VITE_GA_ID=G-YYYYYYYYYY
VITE_GTM_ID=GTM-YYYYYYY
# ... etc
```

```typescript
// Em cookieManager.ts
const GA_ID = import.meta.env.VITE_GA_ID || 'G-XXXXXXXXXX';
const GTM_ID = import.meta.env.VITE_GTM_ID || 'GTM-XXXXXXX';
// ... etc
```

### Opção 2: Arquivo de Configuração
```typescript
// src/config/tracking.ts
interface TrackingConfig {
  googleAnalytics: string;
  googleTagManager: string;
  hotjar: number;
  facebookPixel: string;
  linkedIn: string;
}

const configs: Record<string, TrackingConfig> = {
  development: {
    googleAnalytics: 'G-DEV-ID',
    googleTagManager: 'GTM-DEV-ID',
    hotjar: 0, // Desabilitado em dev
    facebookPixel: '',
    linkedIn: ''
  },
  production: {
    googleAnalytics: 'G-PROD-ID',
    googleTagManager: 'GTM-PROD-ID',
    hotjar: 1234567,
    facebookPixel: '1234567890123456',
    linkedIn: '1234567'
  }
};

export const trackingConfig = configs[import.meta.env.MODE] || configs.development;
```

## 🧪 **Testando o Sistema**

### 1. **Painel de Debug**
- Aparece no canto superior direito (apenas desenvolvimento)
- Mostra status de cada categoria de cookie
- Botão para resetar consentimento
- Logs no console do DevTools

### 2. **Verificação Manual**
```javascript
// No DevTools Console
localStorage.getItem('cookie_consent'); // Ver preferências salvas
document.cookie; // Ver cookies definidos

// Usando o hook
import { useCookieConsent } from '@/hooks/useCookieConsent';
const { canUseAnalytics, canUseMarketing } = useCookieConsent();
```

### 3. **Testes Automatizados**
```typescript
// Exemplo de teste com Jest
import { cookieManager } from '@/utils/cookieManager';

describe('Cookie Manager', () => {
  beforeEach(() => {
    cookieManager.resetConsent();
  });

  test('should save preferences correctly', () => {
    const prefs = {
      essential: true,
      performance: true,
      functionality: false,
      marketing: false
    };
    
    cookieManager.savePreferences(prefs);
    
    expect(cookieManager.hasConsent('performance')).toBe(true);
    expect(cookieManager.hasConsent('marketing')).toBe(false);
  });
});
```

## 🚀 **Deploy em Produção**

### 1. **Debug Panel Removido**
✅ O painel de debug já foi removido da versão de produção.

### 2. **Configurar IDs Reais**
- Substituir todos os placeholders pelos IDs reais
- Configurar variáveis de ambiente
- Testar em ambiente de staging primeiro

### 3. **Verificar Conformidade**
- ✅ Banner aparece na primeira visita
- ✅ Preferências são persistidas
- ✅ Serviços respeitam consentimento
- ✅ Cookies são removidos quando rejeitados
- ✅ Página de política acessível

## 📊 **Monitoramento**

### Analytics Condicionais
```typescript
// Exemplo: só enviar eventos se aceito
const { canUseAnalytics } = useCookieConsent();

const trackEvent = (event: string, data: any) => {
  if (canUseAnalytics && window.gtag) {
    window.gtag('event', event, data);
  }
};
```

### Relatórios de Consentimento
```typescript
// Enviar estatísticas de consentimento
const reportConsentStats = () => {
  const prefs = cookieManager.getPreferences();
  if (prefs && canUseAnalytics) {
    gtag('event', 'cookie_consent', {
      essential: prefs.essential,
      performance: prefs.performance,
      functionality: prefs.functionality,
      marketing: prefs.marketing
    });
  }
};
```

## 🔒 **Conformidade Legal**

### LGPD/GDPR Checklist
- ✅ Consentimento explícito para cookies não essenciais
- ✅ Granularidade por categoria
- ✅ Fácil retirada de consentimento
- ✅ Informações claras sobre uso
- ✅ Base legal documentada
- ✅ Política de cookies acessível
- ✅ Cookies removidos quando rejeitados

### Auditoria
```bash
# Verificar cookies definidos
curl -I https://seusite.com | grep -i set-cookie

# Verificar scripts carregados
# DevTools → Network → JS → filtrar por "analytics", "gtag", etc.
```

## 📞 **Suporte**

Para dúvidas sobre implementação:
1. Verificar logs no console do navegador
2. Usar o painel de debug em desenvolvimento
3. Consultar documentação dos serviços terceiros
4. Testar com diferentes combinações de consentimento

---

**Resultado:** Sistema de cookies 100% funcional e em conformidade com LGPD/GDPR, pronto para produção após configuração dos IDs reais. 