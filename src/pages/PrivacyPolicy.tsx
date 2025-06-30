import React, { useEffect, useState } from "react";
import Footer from "@/components/Footer";

import { ArrowUp, FileText, Shield, Database, Eye, UserCheck, AlertTriangle, Scale, Clock, Phone, Home, ChevronLeft, Cookie, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useLanguageSync } from "@/hooks/useLanguageSync";
import LanguageSwitch from "@/components/LanguageSwitch";

const PrivacyPolicy = () => {
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
    { id: "general-info", title: t('privacy.sections.generalInfo'), icon: FileText },
    { id: "data-collected", title: t('privacy.sections.dataCollected'), icon: Database },
    { id: "purpose", title: t('privacy.sections.purpose'), icon: Eye },
    { id: "legal-basis", title: t('privacy.sections.legalBasis'), icon: Scale },
    { id: "data-sharing", title: t('privacy.sections.dataSharing'), icon: UserCheck },
    { id: "security", title: t('privacy.sections.security'), icon: Shield },
    { id: "retention", title: t('privacy.sections.retention'), icon: Clock },
    { id: "user-rights", title: t('privacy.sections.userRights'), icon: UserCheck },
    { id: "cookies", title: t('privacy.sections.cookies'), icon: Cookie },
    { id: "policy-changes", title: t('privacy.sections.policyChanges'), icon: AlertTriangle },
    { id: "contact-dpo", title: t('privacy.sections.contactDpo'), icon: Phone }
  ];

  return (
    <div className="min-h-screen relative bg-gray-950">

      
      {/* Navbar customizada para página de privacidade */}
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
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-200 font-sans">{t('privacy.badge')}</span>
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
              {t('privacy.backButton')}
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
      
      <main className="relative z-10 pt-24">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300 border border-blue-700/50 mb-6 backdrop-blur-sm">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white mr-2 font-sans">🔒</span>
                <span className="font-sans">{t('privacy.badge')}</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-white">
                {t('privacy.title')}
                <br />
                <span 
                  className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                  style={{
                    backgroundSize: '200% 200%',
                    animation: 'gradientFlow 3s ease-in-out infinite'
                  }}
                >
                  {t('privacy.titleGradient')}
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
                {t('privacy.lastUpdated')}
              </p>
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 max-w-2xl mx-auto">
                <p className="text-sm text-blue-200 font-sans">
                  {t('privacy.description')}
                </p>
              </div>
            </div>

            {/* Índice */}
            <div className="max-w-4xl mx-auto mb-16">
              <h2 className="text-2xl font-display font-bold text-white mb-6 text-center">{t('privacy.index')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sections.map((section, index) => {
                  const Icon = section.icon;
                  return (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className={`flex items-center gap-3 p-4 rounded-lg border transition-all duration-300 hover:scale-105 ${
                        activeSection === section.id
                          ? 'bg-blue-500/20 border-blue-500/50 text-blue-200'
                          : 'bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50'
                      }`}
                    >
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-bold">
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
          
          {/* 1. Informações Gerais */}
          <section id="general-info" className="mb-16">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-400" />
                1. {t('privacy.content.generalInfo.title')}
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                {(t('privacy.content.generalInfo.content', { returnObjects: true }) as string[]).map((paragraph: string, index: number) => (
                  <p key={index} className="text-gray-300 mb-4">
                    {paragraph}
                  </p>
                ))}
                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                  <p className="text-blue-200 font-medium">
                    <Lock className="w-4 h-4 inline mr-2" />
                    {t('privacy.dataProtectionNote')}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Dados Coletados */}
          <section id="data-collected" className="mb-16">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <Database className="w-6 h-6 text-purple-400" />
                2. {t('privacy.content.dataCollected.title')}
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <p className="text-gray-300 mb-6">
                  {t('privacy.content.dataCollected.description')}
                </p>
                <div className="grid gap-4">
                  <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-purple-300 mb-2">{t('privacy.content.dataCollected.categories.identification.title')}</h4>
                    <ul className="text-gray-300 space-y-1">
                      {(t('privacy.content.dataCollected.categories.identification.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-indigo-300 mb-2">{t('privacy.content.dataCollected.categories.navigation.title')}</h4>
                    <ul className="text-gray-300 space-y-1">
                      {(t('privacy.content.dataCollected.categories.navigation.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-pink-500/10 border border-pink-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-pink-300 mb-2">{t('privacy.content.dataCollected.categories.commercial.title')}</h4>
                    <ul className="text-gray-300 space-y-1">
                      {(t('privacy.content.dataCollected.categories.commercial.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-green-300 mb-2">{t('privacy.content.dataCollected.categories.technical.title')}</h4>
                    <ul className="text-gray-300 space-y-1">
                      {(t('privacy.content.dataCollected.categories.technical.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Finalidade do Tratamento */}
          <section id="purpose" className="mb-16">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <Eye className="w-6 h-6 text-cyan-400" />
                3. {t('privacy.content.purpose.title')}
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <p className="text-gray-300 mb-6">
                  {t('privacy.content.purpose.description')}
                </p>
                <div className="space-y-4">
                  <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-cyan-300 mb-2">{t('privacy.content.purpose.purposes.serviceProvision.title')}</h4>
                    <p className="text-gray-300">{t('privacy.content.purpose.purposes.serviceProvision.description')}</p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">{t('privacy.content.purpose.purposes.communication.title')}</h4>
                    <p className="text-gray-300">{t('privacy.content.purpose.purposes.communication.description')}</p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-purple-300 mb-2">{t('privacy.content.purpose.purposes.improvement.title')}</h4>
                    <p className="text-gray-300">{t('privacy.content.purpose.purposes.improvement.description')}</p>
                  </div>
                  <div className="bg-pink-500/10 border border-pink-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-pink-300 mb-2">{t('privacy.content.purpose.purposes.legal.title')}</h4>
                    <p className="text-gray-300">{t('privacy.content.purpose.purposes.legal.description')}</p>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-green-300 mb-2">{t('privacy.content.purpose.purposes.security.title')}</h4>
                    <p className="text-gray-300">{t('privacy.content.purpose.purposes.security.description')}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Base Legal */}
          <section id="legal-basis" className="mb-16">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <Scale className="w-6 h-6 text-yellow-400" />
                4. {t('privacy.content.legalBasis.title')}
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <p className="text-gray-300 mb-6">
                  {t('privacy.content.legalBasis.description')}
                </p>
                <div className="space-y-4">
                  <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-yellow-300 mb-2">{t('privacy.content.legalBasis.bases.contract.title')}</h4>
                    <p className="text-gray-300">{t('privacy.content.legalBasis.bases.contract.description')}</p>
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-orange-300 mb-2">{t('privacy.content.legalBasis.bases.consent.title')}</h4>
                    <p className="text-gray-300">{t('privacy.content.legalBasis.bases.consent.description')}</p>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-red-300 mb-2">{t('privacy.content.legalBasis.bases.legalObligation.title')}</h4>
                    <p className="text-gray-300">{t('privacy.content.legalBasis.bases.legalObligation.description')}</p>
                  </div>
                  <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-indigo-300 mb-2">{t('privacy.content.legalBasis.bases.legitimateInterest.title')}</h4>
                    <p className="text-gray-300">{t('privacy.content.legalBasis.bases.legitimateInterest.description')}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Compartilhamento de Dados */}
          <section id="data-sharing" className="mb-16">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <UserCheck className="w-6 h-6 text-teal-400" />
                5. {t('privacy.content.dataSharing.title')}
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <p className="text-gray-300 mb-6">
                  {t('privacy.content.dataSharing.description')}
                </p>
                <div className="space-y-4">
                  <div className="bg-teal-500/10 border border-teal-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-teal-300 mb-2">{t('privacy.content.dataSharing.situations.serviceProviders.title')}</h4>
                    <p className="text-gray-300">{t('privacy.content.dataSharing.situations.serviceProviders.description')}</p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">{t('privacy.content.dataSharing.situations.authorities.title')}</h4>
                    <p className="text-gray-300">{t('privacy.content.dataSharing.situations.authorities.description')}</p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-purple-300 mb-2">{t('privacy.content.dataSharing.situations.consent.title')}</h4>
                    <p className="text-gray-300">{t('privacy.content.dataSharing.situations.consent.description')}</p>
                  </div>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg mt-6">
                  <p className="text-red-200 font-medium">
                    <AlertTriangle className="w-4 h-4 inline mr-2" />
                    {t('privacy.content.dataSharing.noSaleNote')}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 6. Segurança e Proteção */}
          <section id="security" className="mb-16">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <Shield className="w-6 h-6 text-green-400" />
                6. {t('privacy.content.security.title')}
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <p className="text-gray-300 mb-6">
                  {t('privacy.content.security.description')}
                </p>
                <div className="grid gap-4">
                  <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-green-300 mb-2">{t('privacy.content.security.measures.technical.title')}</h4>
                    <ul className="text-gray-300 space-y-1">
                      {(t('privacy.content.security.measures.technical.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">{t('privacy.content.security.measures.organizational.title')}</h4>
                    <ul className="text-gray-300 space-y-1">
                      {(t('privacy.content.security.measures.organizational.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 7. Retenção de Dados */}
          <section id="retention" className="mb-16">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <Clock className="w-6 h-6 text-orange-400" />
                7. {t('privacy.content.retention.title')}
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <p className="text-gray-300 mb-6">
                  {t('privacy.content.retention.description')}
                </p>
                <div className="space-y-4">
                  <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-orange-300 mb-2">{t('privacy.content.retention.periods.serviceProvision.title')}</h4>
                    <p className="text-gray-300">{t('privacy.content.retention.periods.serviceProvision.description')}</p>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-yellow-300 mb-2">{t('privacy.content.retention.periods.legalPeriod.title')}</h4>
                    <p className="text-gray-300">{t('privacy.content.retention.periods.legalPeriod.description')}</p>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-red-300 mb-2">{t('privacy.content.retention.periods.secureElimination.title')}</h4>
                    <p className="text-gray-300">{t('privacy.content.retention.periods.secureElimination.description')}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 8. Direitos dos Titulares */}
          <section id="user-rights" className="mb-16">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <UserCheck className="w-6 h-6 text-violet-400" />
                8. {t('privacy.content.userRights.title')}
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <p className="text-gray-300 mb-6">
                  {t('privacy.content.userRights.description')}
                </p>
                <div className="grid gap-4">
                  <div className="bg-violet-500/10 border border-violet-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-violet-300 mb-2">{t('privacy.content.userRights.rights.access.title')}</h4>
                    <p className="text-gray-300">{t('privacy.content.userRights.rights.access.description')}</p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">{t('privacy.content.userRights.rights.correction.title')}</h4>
                    <p className="text-gray-300">{t('privacy.content.userRights.rights.correction.description')}</p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-purple-300 mb-2">{t('privacy.content.userRights.rights.deletion.title')}</h4>
                    <p className="text-gray-300">{t('privacy.content.userRights.rights.deletion.description')}</p>
                  </div>
                  <div className="bg-pink-500/10 border border-pink-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-pink-300 mb-2">{t('privacy.content.userRights.rights.portability.title')}</h4>
                    <p className="text-gray-300">{t('privacy.content.userRights.rights.portability.description')}</p>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-green-300 mb-2">{t('privacy.content.userRights.rights.opposition.title')}</h4>
                    <p className="text-gray-300">{t('privacy.content.userRights.rights.opposition.description')}</p>
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-cyan-300 mb-2">{t('privacy.content.userRights.rights.consentRevocation.title')}</h4>
                    <p className="text-gray-300">{t('privacy.content.userRights.rights.consentRevocation.description')}</p>
                  </div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg mt-6">
                  <p className="text-blue-200 font-medium">
                    {t('privacy.content.userRights.exerciseNote')}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 9. Cookies e Tecnologias */}
          <section id="cookies" className="mb-16">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <Cookie className="w-6 h-6 text-amber-400" />
                9. {t('privacy.content.cookies.title')}
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <p className="text-gray-300 mb-6">
                  {t('privacy.content.cookies.description')}
                </p>
                <div className="space-y-4">
                  <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-amber-300 mb-2">{t('privacy.content.cookies.types.essential.title')}</h4>
                    <p className="text-gray-300">{t('privacy.content.cookies.types.essential.description')}</p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">{t('privacy.content.cookies.types.performance.title')}</h4>
                    <p className="text-gray-300">{t('privacy.content.cookies.types.performance.description')}</p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-purple-300 mb-2">{t('privacy.content.cookies.types.functionality.title')}</h4>
                    <p className="text-gray-300">{t('privacy.content.cookies.types.functionality.description')}</p>
                  </div>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg mt-6">
                  <p className="text-amber-200 font-medium">
                    {t('privacy.content.cookies.managementNote')}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 10. Alterações na Política */}
          <section id="policy-changes" className="mb-16">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                10. {t('privacy.content.policyChanges.title')}
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-red-300 mb-3">{t('privacy.content.policyChanges.items.updates.title')}</h4>
                    <p className="text-gray-300">
                      {t('privacy.content.policyChanges.items.updates.description')}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-red-300 mb-3">{t('privacy.content.policyChanges.items.notification.title')}</h4>
                    <p className="text-gray-300">
                      {t('privacy.content.policyChanges.items.notification.description')}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-red-300 mb-3">{t('privacy.content.policyChanges.items.currentVersion.title')}</h4>
                    <p className="text-gray-300">
                      {t('privacy.content.policyChanges.items.currentVersion.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 11. Contato DPO */}
          <section id="contact-dpo" className="mb-16">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <Phone className="w-6 h-6 text-green-400" />
                11. {t('privacy.content.contactDpo.title')}
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <p className="text-gray-300 mb-6">
                  {t('privacy.content.contactDpo.description')}
                </p>
                <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-lg">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Database className="w-5 h-5 text-green-400" />
                      <span className="text-green-300 font-semibold">{t('privacy.content.contactDpo.contact.title')}</span>
                    </div>
                    <div className="space-y-2 text-gray-300">
                      <p><strong>E-mail:</strong> {t('privacy.content.contactDpo.contact.email')}</p>
                      <p><strong>Telefone:</strong> {t('privacy.content.contactDpo.contact.phone')}</p>
                      <p><strong>Endereço:</strong> {t('privacy.content.contactDpo.contact.address')}</p>
                      <p><strong>Horário de atendimento:</strong> {t('privacy.content.contactDpo.contact.hours')}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg mt-6">
                  <p className="text-blue-200 font-medium">
                    <Shield className="w-4 h-4 inline mr-2" />
                    {t('privacy.content.contactDpo.responseNote')}
                  </p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
      
      {/* Botão Voltar ao Topo */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-50 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        aria-label={t('common.backToTop')}
      >
        <ArrowUp className="w-6 h-6" />
      </button>
      
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default PrivacyPolicy; 