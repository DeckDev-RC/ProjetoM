import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Hook para sincronizar o idioma entre todas as páginas
 * Garante que o idioma selecionado seja mantido em toda a aplicação
 */
export const useLanguageSync = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Função para aplicar o idioma salvo
    const applySavedLanguage = () => {
      const savedLanguage = localStorage.getItem('i18nextLng');
      
      // Se há um idioma salvo e é diferente do atual
      if (savedLanguage && savedLanguage !== i18n.language && (savedLanguage === 'pt' || savedLanguage === 'en')) {
        i18n.changeLanguage(savedLanguage);
      }
      
      // Garantir que o HTML tenha o idioma correto
      document.documentElement.lang = savedLanguage || i18n.language;
    };

    // Aplicar idioma salvo imediatamente
    applySavedLanguage();

    // Listener para mudanças de idioma
    const handleLanguageChange = (lng: string) => {
      // Garantir que o idioma seja salvo no localStorage
      localStorage.setItem('i18nextLng', lng);
      
      // Também salvar no sessionStorage como backup
      sessionStorage.setItem('i18nextLng', lng);
      
      // Atualizar o atributo lang do HTML
      document.documentElement.lang = lng;
    };

    // Adicionar listener
    i18n.on('languageChanged', handleLanguageChange);

    // Cleanup
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  return {
    currentLanguage: i18n.language,
    changeLanguage: (lng: string) => {
      // Validar idioma antes de aplicar
      if (lng === 'pt' || lng === 'en') {
        i18n.changeLanguage(lng);
      }
    },
    isReady: i18n.isInitialized
  };
}; 