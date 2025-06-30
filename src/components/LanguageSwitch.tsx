import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { ChevronDown, Globe } from "lucide-react";
import { useLanguageSync } from "@/hooks/useLanguageSync";

const LanguageSwitch = () => {
  const { i18n, t } = useTranslation();
  const { changeLanguage: syncChangeLanguage } = useLanguageSync();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'pt', name: t('languageSwitch.portuguese'), flag: '🇧🇷' },
    { code: 'en', name: t('languageSwitch.english'), flag: '🇺🇸' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    syncChangeLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300",
          "bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-gray-600/50",
          "text-gray-300 hover:text-white text-sm font-medium",
          isOpen && "bg-gray-700/50 border-gray-600/50"
        )}
        aria-label="Alterar idioma"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{currentLanguage.flag}</span>
        <span className="hidden md:inline">{currentLanguage.name}</span>
        <ChevronDown 
          className={cn(
            "w-4 h-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )} 
        />
      </button>

      {isOpen && (
        <>
          {/* Overlay para fechar ao clicar fora */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full right-0 mt-2 z-50 min-w-[140px] bg-gray-800/95 backdrop-blur-md border border-gray-700/50 rounded-lg shadow-xl overflow-hidden">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-200",
                  "hover:bg-gray-700/50 text-sm font-medium",
                  i18n.language === language.code 
                    ? "bg-blue-500/20 text-blue-300" 
                    : "text-gray-300 hover:text-white"
                )}
              >
                <span className="text-lg">{language.flag}</span>
                <span>{language.name}</span>
                {i18n.language === language.code && (
                  <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitch; 