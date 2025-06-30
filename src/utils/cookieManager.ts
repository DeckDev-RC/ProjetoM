// Utility para gerenciar cookies e integrações de terceiros
export interface CookiePreferences {
  essential: boolean;
  performance: boolean;
  functionality: boolean;
  marketing: boolean;
}

export interface ConsentData {
  preferences: CookiePreferences;
  timestamp: string;
  version: string;
}

export class CookieManager {
  private static instance: CookieManager;
  private preferences: CookiePreferences | null = null;

  private constructor() {
    this.loadPreferences();
  }

  public static getInstance(): CookieManager {
    if (!CookieManager.instance) {
      CookieManager.instance = new CookieManager();
    }
    return CookieManager.instance;
  }

  // Carrega preferências do localStorage
  private loadPreferences(): void {
    try {
      const stored = localStorage.getItem('cookie_consent');
      if (stored) {
        const data: ConsentData = JSON.parse(stored);
        this.preferences = data.preferences;
      }
    } catch (error) {
      console.warn('Erro ao carregar preferências de cookies:', error);
    }
  }

  // Salva preferências e aplica configurações
  public savePreferences(prefs: CookiePreferences): void {
    const consentData: ConsentData = {
      preferences: prefs,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    
    localStorage.setItem('cookie_consent', JSON.stringify(consentData));
    this.preferences = prefs;
    
    // Define cookies individuais
    this.setCookieFlags(prefs);
    
    // Aplica configurações aos serviços
    this.applyToServices(prefs);
  }

  // Define cookies de controle
  private setCookieFlags(prefs: CookiePreferences): void {
    const maxAge = 31536000; // 1 ano
    const cookieOptions = `path=/; max-age=${maxAge}; SameSite=Lax`;
    
    document.cookie = `essential_cookies=${prefs.essential}; ${cookieOptions}`;
    document.cookie = `performance_cookies=${prefs.performance}; ${cookieOptions}`;
    document.cookie = `functionality_cookies=${prefs.functionality}; ${cookieOptions}`;
    document.cookie = `marketing_cookies=${prefs.marketing}; ${cookieOptions}`;
  }

  // Aplica configurações aos serviços reais
  private applyToServices(prefs: CookiePreferences): void {
    // Google Analytics
    if (prefs.performance) {
      this.enableGoogleAnalytics();
    } else {
      this.disableGoogleAnalytics();
    }

    // Google Tag Manager
    if (prefs.marketing) {
      this.enableGoogleTagManager();
    } else {
      this.disableGoogleTagManager();
    }

    // Hotjar
    if (prefs.functionality) {
      this.enableHotjar();
    } else {
      this.disableHotjar();
    }

    // Outros serviços de marketing
    if (prefs.marketing) {
      this.enableMarketingServices();
    } else {
      this.disableMarketingServices();
    }
  }

  // ===== GOOGLE ANALYTICS =====
  private enableGoogleAnalytics(): void {
    // Substitua 'GA_MEASUREMENT_ID' pelo seu ID real
    const GA_ID = 'G-XXXXXXXXXX'; // TODO: Substituir pelo ID real
    
    // Carrega o script do Google Analytics
    if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${GA_ID}"]`)) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(script);
    }

    // Configura o gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(args);
    }
    (window as any).gtag = gtag;

    gtag('js', new Date());
    gtag('config', GA_ID, {
      anonymize_ip: true,
      cookie_flags: 'SameSite=Lax'
    });

    console.log('✅ Google Analytics ativado');
  }

  private disableGoogleAnalytics(): void {
    // Desabilita o Google Analytics
    (window as any)['ga-disable-G-XXXXXXXXXX'] = true; // TODO: Substituir pelo ID real
    
    // Remove cookies do GA
    this.deleteCookies(['_ga', '_ga_*', '_gid', '_gat_gtag_*']);
    
    console.log('❌ Google Analytics desabilitado');
  }

  // ===== GOOGLE TAG MANAGER =====
  private enableGoogleTagManager(): void {
    const GTM_ID = 'GTM-XXXXXXX'; // TODO: Substituir pelo ID real
    
    // Carrega o GTM
    if (!document.querySelector(`script[src*="googletagmanager.com/gtm.js?id=${GTM_ID}"]`)) {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
      });

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
      document.head.appendChild(script);
    }

    console.log('✅ Google Tag Manager ativado');
  }

  private disableGoogleTagManager(): void {
    // Remove cookies do GTM
    this.deleteCookies(['_gtm', '_gtag']);
    
    console.log('❌ Google Tag Manager desabilitado');
  }

  // ===== HOTJAR =====
  private enableHotjar(): void {
    const HOTJAR_ID = 1234567; // TODO: Substituir pelo ID real
    
    if (!(window as any).hj) {
      (window as any).hj = (window as any).hj || function(...args: any[]) {
        ((window as any).hj.q = (window as any).hj.q || []).push(args);
      };
      (window as any)._hjSettings = { hjid: HOTJAR_ID, hjsv: 6 };

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://static.hotjar.com/c/hotjar-${HOTJAR_ID}.js?sv=6`;
      document.head.appendChild(script);
    }

    console.log('✅ Hotjar ativado');
  }

  private disableHotjar(): void {
    // Remove cookies do Hotjar
    this.deleteCookies(['_hjid', '_hjSession*', '_hjIncludedInPageviewSample']);
    
    // Desabilita o Hotjar
    if ((window as any).hj) {
      (window as any).hj('stateChange', 'off');
    }

    console.log('❌ Hotjar desabilitado');
  }

  // ===== SERVIÇOS DE MARKETING =====
  private enableMarketingServices(): void {
    // Facebook Pixel
    this.enableFacebookPixel();
    
    // LinkedIn Insight Tag
    this.enableLinkedInInsight();
    
    console.log('✅ Serviços de marketing ativados');
  }

  private disableMarketingServices(): void {
    // Remove cookies de marketing
    this.deleteCookies(['_fbp', '_fbc', 'fr', 'li_*', 'bcookie']);
    
    console.log('❌ Serviços de marketing desabilitados');
  }

  private enableFacebookPixel(): void {
    const FB_PIXEL_ID = '1234567890123456'; // TODO: Substituir pelo ID real
    
    if (!(window as any).fbq) {
      (window as any).fbq = function(...args: any[]) {
        ((window as any).fbq.q = (window as any).fbq.q || []).push(args);
      };
      (window as any).fbq.loaded = true;
      (window as any).fbq.version = '2.0';
      (window as any).fbq.queue = [];

      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(script);

      (window as any).fbq('init', FB_PIXEL_ID);
      (window as any).fbq('track', 'PageView');
    }
  }

  private enableLinkedInInsight(): void {
    const LINKEDIN_ID = '1234567'; // TODO: Substituir pelo ID real
    
    if (!(window as any)._linkedin_data_partner_ids) {
      (window as any)._linkedin_data_partner_ids = [];
    }
    (window as any)._linkedin_data_partner_ids.push(LINKEDIN_ID);
  }

  // ===== UTILITÁRIOS =====
  private deleteCookies(patterns: string[]): void {
    patterns.forEach(pattern => {
      if (pattern.includes('*')) {
        // Remove cookies com wildcard
        const prefix = pattern.replace('*', '');
        document.cookie.split(';').forEach(cookie => {
          const name = cookie.split('=')[0].trim();
          if (name.startsWith(prefix)) {
            this.deleteCookie(name);
          }
        });
      } else {
        this.deleteCookie(pattern);
      }
    });
  }

  private deleteCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
  }

  // Verifica se uma categoria de cookie foi aceita
  public hasConsent(category: keyof CookiePreferences): boolean {
    return this.preferences?.[category] ?? false;
  }

  // Obtém todas as preferências
  public getPreferences(): CookiePreferences | null {
    return this.preferences;
  }

  // Verifica se o usuário já fez uma escolha
  public hasUserConsented(): boolean {
    return this.preferences !== null;
  }

  // Reseta todas as preferências (para teste)
  public resetConsent(): void {
    localStorage.removeItem('cookie_consent');
    this.preferences = null;
    
    // Remove todos os cookies de tracking
    this.deleteCookies([
      '_ga', '_ga_*', '_gid', '_gat_gtag_*',
      '_gtm', '_gtag',
      '_hjid', '_hjSession*', '_hjIncludedInPageviewSample',
      '_fbp', '_fbc', 'fr',
      'li_*', 'bcookie'
    ]);
  }

  // Método para resetar a instância (apenas para testes)
  public static resetInstance(): void {
    CookieManager.instance = null as any;
  }
}

// Exporta instância singleton
export const cookieManager = CookieManager.getInstance(); 