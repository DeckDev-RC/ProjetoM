import React from 'react';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { cookieManager } from '@/utils/cookieManager';
import { Cookie, RefreshCw, Eye, BarChart3, Settings, Shield } from 'lucide-react';

// COMPONENTE APENAS PARA DESENVOLVIMENTO/DEBUG
// Remover em produção
const CookieDebugPanel = () => {
  const { 
    preferences, 
    hasConsented, 
    resetConsent,
    canUseAnalytics,
    canUseMarketing,
    canUseFunctionality
  } = useCookieConsent();

  if (process.env.NODE_ENV === 'production') {
    return null; // Não mostrar em produção
  }

  return (
    <div className="fixed top-4 right-4 z-[200] bg-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-lg p-4 max-w-sm">
      <div className="flex items-center gap-2 mb-3">
        <Cookie className="w-5 h-5 text-amber-400" />
        <h3 className="text-white font-semibold text-sm">Cookie Debug Panel</h3>
      </div>
      
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-300">Consentimento:</span>
          <span className={hasConsented ? "text-green-400" : "text-red-400"}>
            {hasConsented ? "Dado" : "Pendente"}
          </span>
        </div>
        
        {preferences && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-green-400" />
                <span className="text-gray-300">Essenciais:</span>
              </div>
              <span className="text-green-400">✓</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <BarChart3 className="w-3 h-3 text-blue-400" />
                <span className="text-gray-300">Performance:</span>
              </div>
              <span className={canUseAnalytics ? "text-green-400" : "text-red-400"}>
                {canUseAnalytics ? "✓" : "✗"}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3 text-purple-400" />
                <span className="text-gray-300">Funcionalidade:</span>
              </div>
              <span className={canUseFunctionality ? "text-green-400" : "text-red-400"}>
                {canUseFunctionality ? "✓" : "✗"}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Settings className="w-3 h-3 text-orange-400" />
                <span className="text-gray-300">Marketing:</span>
              </div>
              <span className={canUseMarketing ? "text-green-400" : "text-red-400"}>
                {canUseMarketing ? "✓" : "✗"}
              </span>
            </div>
          </>
        )}
        
        <button
          onClick={resetConsent}
          className="w-full mt-3 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs rounded border border-red-500/30 hover:border-red-500/50 transition-colors flex items-center justify-center gap-1"
        >
          <RefreshCw className="w-3 h-3" />
          Reset Cookies
        </button>
        
        <div className="text-gray-400 text-xs mt-2">
          <p>Abra DevTools → Console para ver logs dos serviços</p>
        </div>
      </div>
    </div>
  );
};

export default CookieDebugPanel; 