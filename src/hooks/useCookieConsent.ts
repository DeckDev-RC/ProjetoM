import { useState, useEffect } from 'react';
import { cookieManager, CookiePreferences } from '@/utils/cookieManager';

export const useCookieConsent = () => {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null);
  const [hasConsented, setHasConsented] = useState(false);

  useEffect(() => {
    // Carrega preferências iniciais
    const currentPrefs = cookieManager.getPreferences();
    setPreferences(currentPrefs);
    setHasConsented(cookieManager.hasUserConsented());
  }, []);

  const updatePreferences = (newPrefs: CookiePreferences) => {
    cookieManager.savePreferences(newPrefs);
    setPreferences(newPrefs);
    setHasConsented(true);
  };

  const resetConsent = () => {
    cookieManager.resetConsent();
    setPreferences(null);
    setHasConsented(false);
  };

  const hasConsentFor = (category: keyof CookiePreferences): boolean => {
    return cookieManager.hasConsent(category);
  };

  return {
    preferences,
    hasConsented,
    updatePreferences,
    resetConsent,
    hasConsentFor,
    // Métodos de conveniência
    canUseAnalytics: hasConsentFor('performance'),
    canUseMarketing: hasConsentFor('marketing'),
    canUseFunctionality: hasConsentFor('functionality'),
  };
}; 