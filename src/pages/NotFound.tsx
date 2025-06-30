import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguageSync } from "@/hooks/useLanguageSync";

const NotFound = () => {
  const { t } = useTranslation();
  useLanguageSync(); // Garantir sincronização do idioma
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-white">404</h1>
        <p className="text-xl text-gray-300 mb-4">{t('notFound.message', 'Oops! Página não encontrada')}</p>
        <a href="/" className="text-blue-400 hover:text-blue-300 underline font-sans">
          {t('notFound.backToHome', 'Voltar para Home')}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
