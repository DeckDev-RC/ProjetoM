import React from "react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="w-full bg-gray-900/95 py-20 px-4 relative" style={{ 
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #1e293b 70%, #0f172a 100%)'
    }}>
      
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          
          {/* Left Section - CTA */}
          <div className="md:col-span-1">
            <h3 className="text-white text-2xl font-normal mb-8 leading-relaxed font-sans">
              {t('footer.cta')}
            </h3>
            <button 
              onClick={() => {
                // Primeiro tenta navegar para a seção de contato na mesma página
                const contactSection = document.querySelector('#contact');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                } else {
                  // Se não estiver na página principal, abre o WhatsApp diretamente
                  window.open('https://wa.me/5562993140780?text=Olá! Gostaria de saber mais sobre as soluções de IA da Mind AI Tecnologia.', '_blank');
                }
              }}
              className="bg-green-500 hover:bg-green-600 text-black font-medium px-8 py-3 rounded-full flex items-center gap-3 transition-all duration-200 hover:scale-105 font-sans cursor-pointer"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.506"/>
              </svg>
              {t('footer.ctaButton')}
            </button>
          </div>

          {/* Menu Section */}
          <div className="md:col-span-1">
            <h4 className="text-white font-medium text-lg mb-8 font-sans">{t('footer.menu')}</h4>
            <nav className="space-y-5">
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-base font-sans" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                {t('navbar.home')}
              </a>
              <a href="#features" className="block text-gray-400 hover:text-white transition-colors text-base font-sans">
                {t('navbar.features')}
              </a>
              <a href="#process-optimization" className="block text-gray-400 hover:text-white transition-colors text-base font-sans">
                {t('navbar.strategy')}
              </a>
              <a href="#faq" className="block text-gray-400 hover:text-white transition-colors text-base font-sans">
                {t('navbar.faq')}
              </a>
              <a href="#contact" className="block text-gray-400 hover:text-white transition-colors text-base font-sans">
                {t('navbar.contact')}
              </a>
            </nav>
          </div>

          {/* Legal Section */}
          <div className="md:col-span-1">
            <h4 className="text-white font-medium text-lg mb-8 font-sans">{t('footer.legal')}</h4>
            <nav className="space-y-5">
              <a href="/terms" className="block text-gray-400 hover:text-white transition-colors text-base font-sans">
                {t('footer.links.terms')}
              </a>
              <a href="/privacy" className="block text-gray-400 hover:text-white transition-colors text-base font-sans">
                {t('footer.links.privacy')}
              </a>
              <a href="/cookies" className="block text-gray-400 hover:text-white transition-colors text-base font-sans">
                {t('footer.links.cookies')}
              </a>
            </nav>
          </div>

          {/* Company Info Section */}
          <div className="md:col-span-1">
            <h4 className="text-white font-medium text-lg mb-8 font-sans">{t('footer.contact')}</h4>
            <div className="space-y-4">
              <div className="text-gray-400 text-base font-sans">
                <div className="flex items-start gap-2 mb-3">
                  <svg className="w-4 h-4 mt-1 text-violet-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <a 
                    href="https://maps.google.com/?q=R.+S-1,+Q.+153+-+L.+25,+St.+Bueno,+Goiânia+-+GO,+74230-220"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="leading-relaxed hover:text-white transition-colors cursor-pointer"
                  >
                    R. S-1, Q. 153 - L. 25<br />
                    St. Bueno, Goiânia - GO<br />
                    74230-220
                  </a>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>contato@mindtecnologia-ai.com.br</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>(62) 99314-0780</span>
                </div>
              </div>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm group font-sans mt-6"
              >
                <span>{t('footer.backToTop')}</span>
                <svg className="w-4 h-4 transform group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <div className="border-t border-gray-700 mb-12" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo and Copyright */}
          <div className="flex items-center gap-12">
            <div className="text-white font-bold text-2xl tracking-[0.3em]">
            <img 
            src="/logo.svg" 
            alt="Mind AI Logo" 
            className="w-32 h-auto sm:w-25" 
          />
            </div>
            <p className="text-gray-400 text-base font-sans">
              {t('footer.copyright')}
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-6">
            <a 
              href="https://instagram.com/mindtecnologia.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors p-2"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a 
              href="https://wa.me/5562993140780" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors p-2"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.506"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
