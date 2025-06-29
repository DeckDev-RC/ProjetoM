import React, { useState, useEffect } from "react";
import { Cookie, X, Settings, Shield, BarChart3, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { cookieManager, CookiePreferences } from "@/utils/cookieManager";

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always true, cannot be disabled
    performance: false,
    functionality: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice using the cookie manager
    if (!cookieManager.hasUserConsented()) {
      // Show banner after a small delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      performance: true,
      functionality: true,
      marketing: true,
    };
    
    cookieManager.savePreferences(allAccepted);
    setIsVisible(false);
  };

  const handleAcceptSelected = () => {
    cookieManager.savePreferences(preferences);
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const essentialOnly = {
      essential: true,
      performance: false,
      functionality: false,
      marketing: false,
    };
    
    cookieManager.savePreferences(essentialOnly);
    setIsVisible(false);
  };

  const handlePreferenceChange = (category: keyof CookiePreferences) => {
    if (category === 'essential') return; // Essential cookies cannot be disabled
    
    setPreferences(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[90]" />
      
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border-b border-gray-700/50 p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-500 text-white">
                    <Cookie className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white font-sans">
                      Configurações de Cookies
                    </h3>
                    <p className="text-sm text-gray-300 font-sans">
                      Respeitamos sua privacidade e dados pessoais
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsVisible(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
                  aria-label="Fechar banner de cookies"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {!showDetails ? (
                /* Simple View */
                <div>
                  <p className="text-gray-300 mb-6 font-sans leading-relaxed">
                    Utilizamos cookies para melhorar sua experiência de navegação, analisar o tráfego do site e 
                    personalizar conteúdo. Você pode escolher quais categorias de cookies aceitar.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleAcceptAll}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-lg transition-all duration-300 hover:scale-105 font-sans"
                    >
                      Aceitar Todos
                    </button>
                    <button
                      onClick={() => setShowDetails(true)}
                      className="flex-1 px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 font-medium rounded-lg border border-gray-600/50 hover:border-gray-500/50 transition-all duration-300 font-sans flex items-center justify-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Personalizar
                    </button>
                    <button
                      onClick={handleRejectAll}
                      className="flex-1 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-200 font-medium rounded-lg border border-red-500/30 hover:border-red-500/50 transition-all duration-300 font-sans"
                    >
                      Rejeitar Todos
                    </button>
                  </div>

                  <div className="mt-4 text-center">
                    <a
                      href="/cookies"
                      className="text-sm text-amber-400 hover:text-amber-300 underline font-sans"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Saiba mais sobre nossa Política de Cookies
                    </a>
                  </div>
                </div>
              ) : (
                /* Detailed View */
                <div>
                  <div className="mb-6">
                    <p className="text-gray-300 font-sans">
                      Escolha quais tipos de cookies você gostaria de aceitar. Sua escolha será lembrada por 12 meses.
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    {/* Essential Cookies */}
                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-green-400" />
                          <h4 className="font-medium text-white font-sans">Cookies Essenciais</h4>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={preferences.essential}
                            disabled
                            className="sr-only"
                          />
                          <div className="w-12 h-6 bg-green-500 rounded-full flex items-center justify-end pr-1">
                            <div className="w-4 h-4 bg-white rounded-full"></div>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 font-sans">
                        Necessários para o funcionamento básico do site. Não podem ser desabilitados.
                      </p>
                    </div>

                    {/* Performance Cookies */}
                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <BarChart3 className="w-5 h-5 text-blue-400" />
                          <h4 className="font-medium text-white font-sans">Cookies de Performance</h4>
                        </div>
                        <button
                          onClick={() => handlePreferenceChange('performance')}
                          className="relative"
                        >
                          <div className={cn(
                            "w-12 h-6 rounded-full flex items-center transition-colors",
                            preferences.performance ? "bg-blue-500 justify-end pr-1" : "bg-gray-600 justify-start pl-1"
                          )}>
                            <div className="w-4 h-4 bg-white rounded-full transition-transform"></div>
                          </div>
                        </button>
                      </div>
                      <p className="text-sm text-gray-400 font-sans">
                        Nos ajudam a entender como você usa o site para melhorar a performance.
                      </p>
                    </div>

                    {/* Functionality Cookies */}
                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Eye className="w-5 h-5 text-purple-400" />
                          <h4 className="font-medium text-white font-sans">Cookies de Funcionalidade</h4>
                        </div>
                        <button
                          onClick={() => handlePreferenceChange('functionality')}
                          className="relative"
                        >
                          <div className={cn(
                            "w-12 h-6 rounded-full flex items-center transition-colors",
                            preferences.functionality ? "bg-purple-500 justify-end pr-1" : "bg-gray-600 justify-start pl-1"
                          )}>
                            <div className="w-4 h-4 bg-white rounded-full transition-transform"></div>
                          </div>
                        </button>
                      </div>
                      <p className="text-sm text-gray-400 font-sans">
                        Permitem recursos aprimorados e personalização da sua experiência.
                      </p>
                    </div>

                    {/* Marketing Cookies */}
                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Settings className="w-5 h-5 text-orange-400" />
                          <h4 className="font-medium text-white font-sans">Cookies de Marketing</h4>
                        </div>
                        <button
                          onClick={() => handlePreferenceChange('marketing')}
                          className="relative"
                        >
                          <div className={cn(
                            "w-12 h-6 rounded-full flex items-center transition-colors",
                            preferences.marketing ? "bg-orange-500 justify-end pr-1" : "bg-gray-600 justify-start pl-1"
                          )}>
                            <div className="w-4 h-4 bg-white rounded-full transition-transform"></div>
                          </div>
                        </button>
                      </div>
                      <p className="text-sm text-gray-400 font-sans">
                        Utilizados para personalizar anúncios e medir a eficácia de campanhas.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleAcceptSelected}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all duration-300 hover:scale-105 font-sans"
                    >
                      Salvar Preferências
                    </button>
                    <button
                      onClick={() => setShowDetails(false)}
                      className="flex-1 px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 font-medium rounded-lg border border-gray-600/50 hover:border-gray-500/50 transition-all duration-300 font-sans"
                    >
                      Voltar
                    </button>
                  </div>

                  <div className="mt-4 text-center">
                    <a
                      href="/cookies"
                      className="text-sm text-amber-400 hover:text-amber-300 underline font-sans"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Leia nossa Política de Cookies completa
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookieBanner; 