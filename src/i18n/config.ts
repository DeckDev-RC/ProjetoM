import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ptTranslations from './locales/pt.json';
import enTranslations from './locales/en.json';

const resources = {
  pt: {
    translation: ptTranslations
  },
  en: {
    translation: enTranslations
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt', // apenas fallback, não idioma inicial
    
    detection: {
      order: ['localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      lookupSessionStorage: 'i18nextLng',
      caches: ['localStorage', 'sessionStorage'],
      excludeCacheFor: ['cimode'],
    },

    interpolation: {
      escapeValue: false
    },

    // Configurações otimizadas para performance
    debug: false,
    
    react: {
      useSuspense: false, // Desabilitar para melhor performance
    },

    // Garantir que o namespace seja carregado
    defaultNS: 'translation',
    ns: ['translation'],
    
    // Lista de idiomas suportados
    supportedLngs: ['pt', 'en'],
    nonExplicitSupportedLngs: true,
  })
  .catch((error) => {
    console.error('Erro ao inicializar i18n:', error);
  });

export default i18n; 