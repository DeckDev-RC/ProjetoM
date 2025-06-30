import React, { useEffect, useState } from "react";
import Footer from "@/components/Footer";

import { ArrowUp, Cookie, Shield, Settings, Eye, BarChart3, Zap, AlertTriangle, Clock, Scale, ChevronLeft, Lock, Monitor, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useLanguageSync } from "@/hooks/useLanguageSync";
import LanguageSwitch from "@/components/LanguageSwitch";

const CookiePolicy = () => {
  const { t } = useTranslation();
  useLanguageSync(); // Garantir sincronização do idioma
  const [activeSection, setActiveSection] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Controle do scroll para navbar
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Scroll suave para âncoras
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href')?.substring(1);
        if (!targetId) return;
        
        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;
        
        const offset = 100;
        
        window.scrollTo({
          top: targetElement.offsetTop - offset,
          behavior: 'smooth'
        });
      });
    });

    // Observer para seção ativa
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-100px 0px" }
    );
    
    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sections = [
    { id: "what-are-cookies", title: t('cookies.sections.whatAreCookies'), icon: Cookie },
    { id: "types-of-cookies", title: t('cookies.sections.typesOfCookies'), icon: Settings },
    { id: "cookies-we-use", title: t('cookies.sections.cookiesWeUse'), icon: Eye },
    { id: "third-party-cookies", title: t('cookies.sections.thirdPartyCookies'), icon: BarChart3 },
    { id: "cookie-management", title: t('cookies.sections.cookieManagement'), icon: Settings },
    { id: "legal-basis", title: t('cookies.sections.legalBasis'), icon: Scale },
    { id: "data-retention", title: t('cookies.sections.dataRetention'), icon: Clock },
    { id: "policy-updates", title: t('cookies.sections.policyUpdates'), icon: AlertTriangle }
  ];

  return (
    <div className="min-h-screen relative bg-gray-950">

      
      {/* Navbar customizada para página de cookies */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 py-4 md:py-5 transition-all duration-300",
          isScrolled 
            ? "bg-gray-900/90 backdrop-blur-md shadow-lg border-b border-gray-800/50" 
            : "bg-gray-950/80 backdrop-blur-sm"
        )}
      >
        <div className="container flex items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <a 
            href="/" 
            className="flex items-center space-x-2"
            aria-label="Mind AI - Voltar para Home"
          >
            <img 
              src="/logo.svg" 
              alt="Mind AI Logo" 
              className="w-28 h-auto sm:w-32" 
            />
          </a>

          {/* Navegação central */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
              <Cookie className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-200 font-sans">{t('cookies.badge')}</span>
            </div>
          </div>

          {/* Botão voltar e seletor de idioma */}
          <div className="flex items-center gap-4">
            <LanguageSwitch />
            
            <a
              href="/"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-gray-600/50 text-gray-300 hover:text-white transition-all duration-300 font-sans"
            >
              <ChevronLeft className="w-4 h-4" />
              {t('cookies.backButton')}
            </a>
            
            {/* Mobile - apenas ícone */}
            <a
              href="/"
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-gray-600/50 text-gray-300 hover:text-white transition-all duration-300"
              aria-label="Voltar para Home"
            >
              <ChevronLeft className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>
      
      <main className="relative z-20 pt-24">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-900/50 text-amber-300 border border-amber-700/50 mb-6 backdrop-blur-sm">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-white mr-2 font-sans">🍪</span>
                <span className="font-sans">{t('cookies.badge')}</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-white">
                {t('cookies.title')}
                <br />
                <span 
                  className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-orange-500 to-red-500"
                  style={{
                    backgroundSize: '200% 200%',
                    animation: 'gradientFlow 3s ease-in-out infinite'
                  }}
                >
                  {t('cookies.titleGradient')}
                </span>
              </h1>
              
              <style dangerouslySetInnerHTML={{
                __html: `
                  @keyframes gradientFlow {
                    0% {
                      background-position: 0% 50%;
                    }
                    50% {
                      background-position: 100% 50%;
                    }
                    100% {
                      background-position: 0% 50%;
                    }
                  }
                `
              }} />
              
              <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8 font-sans">
                {t('cookies.lastUpdated')}
              </p>
              
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 max-w-2xl mx-auto">
                <p className="text-sm text-amber-200 font-sans">
                  {t('cookies.description')}
                </p>
              </div>
            </div>

            {/* Índice */}
            <div className="max-w-4xl mx-auto mb-16">
              <h2 className="text-2xl font-display font-bold text-white mb-6 text-center">{t('cookies.index')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sections.map((section, index) => {
                  const Icon = section.icon;
                  return (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className={`flex items-center gap-3 p-4 rounded-lg border transition-all duration-300 hover:scale-105 ${
                        activeSection === section.id
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
                          : 'bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50'
                      }`}
                    >
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500 text-white text-sm font-bold">
                        {index + 1}
                      </span>
                      <Icon className="w-5 h-5" />
                      <span className="font-sans font-medium">{section.title}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          
          {/* 1. O que são Cookies */}
          <section id="what-are-cookies" className="mb-16">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <Cookie className="w-6 h-6 text-amber-400" />
                1. {t('cookies.content.whatAreCookies.title')}
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                {(t('cookies.content.whatAreCookies.content', { returnObjects: true }) as string[]).map((paragraph: string, index: number) => (
                  <p key={index} className="text-gray-300 mb-4">
                    {paragraph}
                  </p>
                ))}
                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
                  <p className="text-amber-200 font-medium">
                    <Lock className="w-4 h-4 inline mr-2" />
                    {t('cookies.content.whatAreCookies.securityNote')}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Tipos de Cookies */}
          <section id="types-of-cookies" className="mb-16">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <Settings className="w-6 h-6 text-blue-400" />
                2. {t('cookies.content.typesOfCookies.title')}
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <p className="text-gray-300 mb-6">
                  {t('cookies.content.typesOfCookies.description')}
                </p>
                <div className="grid gap-4">
                  <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-green-300 mb-2 flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      {t('cookies.content.typesOfCookies.types.essential.title')}
                    </h4>
                    <p className="text-gray-300 mb-2">
                      {t('cookies.content.typesOfCookies.types.essential.description')}
                    </p>
                    <ul className="text-gray-300 space-y-1 text-sm">
                      {(t('cookies.content.typesOfCookies.types.essential.features', { returnObjects: true }) as string[]).map((feature: string, index: number) => (
                        <li key={index}>• {feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-300 mb-2 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      {t('cookies.content.typesOfCookies.types.performance.title')}
                    </h4>
                    <p className="text-gray-300 mb-2">
                      {t('cookies.content.typesOfCookies.types.performance.description')}
                    </p>
                    <ul className="text-gray-300 space-y-1 text-sm">
                      {(t('cookies.content.typesOfCookies.types.performance.features', { returnObjects: true }) as string[]).map((feature: string, index: number) => (
                        <li key={index}>• {feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-purple-300 mb-2 flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      {t('cookies.content.typesOfCookies.types.functionality.title')}
                    </h4>
                    <p className="text-gray-300 mb-2">
                      {t('cookies.content.typesOfCookies.types.functionality.description')}
                    </p>
                    <ul className="text-gray-300 space-y-1 text-sm">
                      {(t('cookies.content.typesOfCookies.types.functionality.features', { returnObjects: true }) as string[]).map((feature: string, index: number) => (
                        <li key={index}>• {feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-orange-300 mb-2 flex items-center gap-2">
                      <Monitor className="w-5 h-5" />
                      {t('cookies.content.typesOfCookies.types.marketing.title')}
                    </h4>
                    <p className="text-gray-300 mb-2">
                      {t('cookies.content.typesOfCookies.types.marketing.description')}
                    </p>
                    <ul className="text-gray-300 space-y-1 text-sm">
                      {(t('cookies.content.typesOfCookies.types.marketing.features', { returnObjects: true }) as string[]).map((feature: string, index: number) => (
                        <li key={index}>• {feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Cookies que Utilizamos */}
          <section id="cookies-we-use" className="mb-16">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <Eye className="w-6 h-6 text-cyan-400" />
                3. {t('cookies.content.cookiesWeUse.title')}
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <p className="text-gray-300 mb-6">
                  {t('cookies.content.cookiesWeUse.description')}
                </p>
                <div className="space-y-6">
                  <div className="bg-cyan-500/10 border border-cyan-500/20 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-cyan-300 mb-4">{t('cookies.content.cookiesWeUse.firstParty.title')}</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-600">
                            <th className="text-left py-2 text-cyan-200">{t('cookies.content.cookiesWeUse.firstParty.tableHeaders.name')}</th>
                            <th className="text-left py-2 text-cyan-200">{t('cookies.content.cookiesWeUse.firstParty.tableHeaders.purpose')}</th>
                            <th className="text-left py-2 text-cyan-200">{t('cookies.content.cookiesWeUse.firstParty.tableHeaders.duration')}</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-300">
                          {(t('cookies.content.cookiesWeUse.firstParty.cookies', { returnObjects: true }) as any[]).map((cookie: any, index: number) => (
                            <tr key={index} className="border-b border-gray-700">
                              <td className="py-2 font-mono">{cookie.name}</td>
                              <td className="py-2">{cookie.purpose}</td>
                              <td className="py-2">{cookie.duration}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Cookies de Terceiros */}
          <section id="third-party-cookies" className="mb-16">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-purple-400" />
                4. {t('cookies.content.thirdPartyCookies.title')}
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <p className="text-gray-300 mb-6">
                  {t('cookies.content.thirdPartyCookies.description')}
                </p>
                <div className="space-y-4">
                  <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-purple-300 mb-2">{t('cookies.content.thirdPartyCookies.services.googleAnalytics.title')}</h4>
                    <p className="text-gray-300 mb-2">{t('cookies.content.thirdPartyCookies.services.googleAnalytics.description')}</p>
                    <p className="text-sm text-gray-400">
                      Cookies: {t('cookies.content.thirdPartyCookies.services.googleAnalytics.cookies')}
                    </p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">{t('cookies.content.thirdPartyCookies.services.googleTagManager.title')}</h4>
                    <p className="text-gray-300 mb-2">{t('cookies.content.thirdPartyCookies.services.googleTagManager.description')}</p>
                    <p className="text-sm text-gray-400">
                      Cookies: {t('cookies.content.thirdPartyCookies.services.googleTagManager.cookies')}
                    </p>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-green-300 mb-2">{t('cookies.content.thirdPartyCookies.services.hotjar.title')}</h4>
                    <p className="text-gray-300 mb-2">{t('cookies.content.thirdPartyCookies.services.hotjar.description')}</p>
                    <p className="text-sm text-gray-400">
                      Cookies: {t('cookies.content.thirdPartyCookies.services.hotjar.cookies')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Gerenciar Cookies */}
          <section id="cookie-management" className="mb-16">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <Settings className="w-6 h-6 text-teal-400" />
                5. {t('cookies.content.cookieManagement.title')}
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <p className="text-gray-300 mb-6">
                  {t('cookies.content.cookieManagement.description')}
                </p>
                <div className="space-y-4">
                  <div className="bg-teal-500/10 border border-teal-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-teal-300 mb-2 flex items-center gap-2">
                      <Monitor className="w-5 h-5" />
                      {t('cookies.content.cookieManagement.methods.browserSettings.title')}
                    </h4>
                    <p className="text-gray-300 mb-3">
                      {t('cookies.content.cookieManagement.methods.browserSettings.description')}
                    </p>
                    <div className="grid gap-3">
                      <div className="bg-gray-700/30 p-3 rounded">
                        <p className="font-medium text-white mb-1">{t('cookies.content.cookieManagement.methods.browserSettings.browsers.chrome.name')}</p>
                        <p className="text-sm text-gray-300">{t('cookies.content.cookieManagement.methods.browserSettings.browsers.chrome.path')}</p>
                      </div>
                      <div className="bg-gray-700/30 p-3 rounded">
                        <p className="font-medium text-white mb-1">{t('cookies.content.cookieManagement.methods.browserSettings.browsers.firefox.name')}</p>
                        <p className="text-sm text-gray-300">{t('cookies.content.cookieManagement.methods.browserSettings.browsers.firefox.path')}</p>
                      </div>
                      <div className="bg-gray-700/30 p-3 rounded">
                        <p className="font-medium text-white mb-1">{t('cookies.content.cookieManagement.methods.browserSettings.browsers.safari.name')}</p>
                        <p className="text-sm text-gray-300">{t('cookies.content.cookieManagement.methods.browserSettings.browsers.safari.path')}</p>
                      </div>
                      <div className="bg-gray-700/30 p-3 rounded">
                        <p className="font-medium text-white mb-1">{t('cookies.content.cookieManagement.methods.browserSettings.browsers.edge.name')}</p>
                        <p className="text-sm text-gray-300">{t('cookies.content.cookieManagement.methods.browserSettings.browsers.edge.path')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-300 mb-2 flex items-center gap-2">
                      <Smartphone className="w-5 h-5" />
                      {t('cookies.content.cookieManagement.methods.consentBanner.title')}
                    </h4>
                    <p className="text-gray-300">
                      {t('cookies.content.cookieManagement.methods.consentBanner.description')}
                    </p>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-yellow-300 mb-2">{t('cookies.content.cookieManagement.methods.thirdPartyOptOut.title')}</h4>
                    <div className="space-y-2 text-sm">
                      {(t('cookies.content.cookieManagement.methods.thirdPartyOptOut.links', { returnObjects: true }) as any[]).map((link: any, index: number) => (
                        <p key={index} className="text-gray-300">
                          • <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-yellow-300 hover:underline">{link.name}</a>
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 6. Base Legal */}
          <section id="legal-basis" className="mb-16">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <Scale className="w-6 h-6 text-indigo-400" />
                6. {t('cookies.content.legalBasis.title')}
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <p className="text-gray-300 mb-6">
                  {t('cookies.content.legalBasis.description')}
                </p>
                <div className="space-y-4">
                  <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-indigo-300 mb-2">{t('cookies.content.legalBasis.bases.consent.title')}</h4>
                    <p className="text-gray-300">
                      {t('cookies.content.legalBasis.bases.consent.description')}
                    </p>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-green-300 mb-2">{t('cookies.content.legalBasis.bases.legitimateInterest.title')}</h4>
                    <p className="text-gray-300">
                      {t('cookies.content.legalBasis.bases.legitimateInterest.description')}
                    </p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">{t('cookies.content.legalBasis.bases.contractExecution.title')}</h4>
                    <p className="text-gray-300">
                      {t('cookies.content.legalBasis.bases.contractExecution.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 7. Retenção de Dados */}
          <section id="data-retention" className="mb-16">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <Clock className="w-6 h-6 text-orange-400" />
                7. {t('cookies.content.dataRetention.title')}
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <p className="text-gray-300 mb-6">
                  {t('cookies.content.dataRetention.description')}
                </p>
                <div className="space-y-4">
                  <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-orange-300 mb-2">{t('cookies.content.dataRetention.periods.sessionCookies.title')}</h4>
                    <p className="text-gray-300">
                      {t('cookies.content.dataRetention.periods.sessionCookies.description')}
                    </p>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-yellow-300 mb-2">{t('cookies.content.dataRetention.periods.persistentCookies.title')}</h4>
                    <p className="text-gray-300">
                      {t('cookies.content.dataRetention.periods.persistentCookies.description')}
                    </p>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-red-300 mb-2">{t('cookies.content.dataRetention.periods.analyticsData.title')}</h4>
                    <p className="text-gray-300">
                      {t('cookies.content.dataRetention.periods.analyticsData.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 8. Atualizações da Política */}
          <section id="policy-updates" className="mb-16">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                8. {t('cookies.content.policyUpdates.title')}
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                {(t('cookies.content.policyUpdates.content', { returnObjects: true }) as string[]).map((paragraph: string, index: number) => (
                  <p key={index} className="text-gray-300 mb-4">
                    {paragraph}
                  </p>
                ))}
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                  <p className="text-red-200 font-medium">
                    <AlertTriangle className="w-4 h-4 inline mr-2" />
                    {t('cookies.content.policyUpdates.reviewNote')}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contato */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 text-center">
                {t('cookies.content.contact.title')}
              </h2>
              <div className="text-center">
                <p className="text-gray-300 mb-6 font-sans">
                  {t('cookies.content.contact.description')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href={`mailto:${t('cookies.content.contact.email')}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 hover:border-blue-500/50 text-blue-200 hover:text-blue-100 transition-all duration-300 font-sans"
                  >
                    <Shield className="w-4 h-4" />
                    {t('cookies.content.contact.email')}
                  </a>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 hover:border-purple-500/50 text-purple-200 hover:text-purple-100 transition-all duration-300 font-sans"
                  >
                    <Eye className="w-4 h-4" />
                    {t('cookies.content.contact.contactLink')}
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Botão Voltar ao Topo */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-40 p-3 rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        aria-label={t('common.backToTop')}
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      <div className="relative z-20">
        <Footer />
      </div>
    </div>
  );
};

export default CookiePolicy;