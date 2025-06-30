import React, { useEffect, useState } from "react";
import Footer from "@/components/Footer";

import { ArrowUp, FileText, Shield, Settings, Eye, UserCheck, AlertTriangle, Scale, Clock, Phone, Home, ChevronLeft, Lock, CreditCard, XCircle, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useLanguageSync } from "@/hooks/useLanguageSync";
import LanguageSwitch from "@/components/LanguageSwitch";

const TermsOfService = () => {
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
    { id: "acceptance", title: t('terms.sections.acceptance'), icon: FileText },
    { id: "definitions", title: t('terms.sections.definitions'), icon: BookOpen },
    { id: "services", title: t('terms.sections.services'), icon: Settings },
    { id: "client-responsibilities", title: t('terms.sections.clientResponsibilities'), icon: UserCheck },
    { id: "our-responsibilities", title: t('terms.sections.ourResponsibilities'), icon: Shield },
    { id: "intellectual-property", title: t('terms.sections.intellectualProperty'), icon: Lock },
    { id: "data-protection", title: t('terms.sections.dataProtection'), icon: Shield },
    { id: "limitations", title: t('terms.sections.limitations'), icon: AlertTriangle },
    { id: "payments", title: t('terms.sections.payments'), icon: CreditCard },
    { id: "termination", title: t('terms.sections.termination'), icon: XCircle },
    { id: "general", title: t('terms.sections.general'), icon: Scale }
  ];

  return (
    <div className="min-h-screen relative bg-gray-950">

      
      {/* Navbar customizada para página de termos */}
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
              <FileText className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-200 font-sans">{t('terms.badge')}</span>
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
              {t('terms.backButton')}
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
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300 border border-blue-700/50 mb-6 backdrop-blur-sm">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white mr-2 font-sans">📋</span>
                <span className="font-sans">{t('terms.badge')}</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-white">
                {t('terms.title')}
                <br />
                <span 
                  className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                  style={{
                    backgroundSize: '200% 200%',
                    animation: 'gradientFlow 3s ease-in-out infinite'
                  }}
                >
                  {t('terms.titleGradient')}
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
                {t('terms.lastUpdated')}
              </p>
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 max-w-2xl mx-auto">
                <p className="text-sm text-blue-200 font-sans">
                  {t('terms.description')}
                </p>
              </div>
            </div>

            {/* Índice */}
            <div className="max-w-4xl mx-auto mb-16">
              <h2 className="text-2xl font-display font-bold text-white mb-6 text-center">{t('terms.index')}</h2>
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
          
          {/* 1. Aceitação dos Termos */}
          <section id="acceptance" className="mb-16">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-400" />
                1. {t('terms.content.acceptance.title')}
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                {(t('terms.content.acceptance.content', { returnObjects: true }) as string[]).map((paragraph: string, index: number) => (
                  <p key={index} className="text-gray-300 mb-4">
                    {paragraph}
                  </p>
                ))}
                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                  <p className="text-blue-200 font-medium">
                    <Lock className="w-4 h-4 inline mr-2" />
                    A contratação implica na aceitação integral destes termos.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Definições */}
          <section id="definitions" className="mb-16">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-blue-400" />
                2. {t('terms.content.definitions.title')}
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <div className="grid gap-4">
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">{t('terms.content.definitions.items.aiServices.title')}</h4>
                    <p className="text-gray-300">{t('terms.content.definitions.items.aiServices.description')}</p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-purple-300 mb-2">{t('terms.content.definitions.items.intelligentAgents.title')}</h4>
                    <p className="text-gray-300">{t('terms.content.definitions.items.intelligentAgents.description')}</p>
                  </div>
                  <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-indigo-300 mb-2">{t('terms.content.definitions.items.clientData.title')}</h4>
                    <p className="text-gray-300">{t('terms.content.definitions.items.clientData.description')}</p>
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-cyan-300 mb-2">{t('terms.content.definitions.items.customSolution.title')}</h4>
                    <p className="text-gray-300">{t('terms.content.definitions.items.customSolution.description')}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Descrição dos Serviços */}
          <section id="services" className="mb-16">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <Settings className="w-6 h-6 text-purple-400" />
                3. {t('terms.content.services.title')}
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <p className="text-gray-300 mb-6">
                  {t('terms.content.services.description')}
                </p>
                <div className="grid gap-4">
                  <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-purple-300 mb-2">{t('terms.content.services.items.development.title')}</h4>
                    <p className="text-gray-300">{t('terms.content.services.items.development.description')}</p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">{t('terms.content.services.items.integration.title')}</h4>
                    <p className="text-gray-300">{t('terms.content.services.items.integration.description')}</p>
                  </div>
                  <div className="bg-pink-500/10 border border-pink-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-pink-300 mb-2">{t('terms.content.services.items.automation.title')}</h4>
                    <p className="text-gray-300">{t('terms.content.services.items.automation.description')}</p>
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-orange-300 mb-2">{t('terms.content.services.items.support.title')}</h4>
                    <p className="text-gray-300">{t('terms.content.services.items.support.description')}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Responsabilidades do Cliente */}
          <section id="client-responsibilities" className="mb-16">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <UserCheck className="w-6 h-6 text-cyan-400" />
                4. {t('terms.content.clientResponsibilities.title')}
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <p className="text-gray-300 mb-6">
                  {t('terms.content.clientResponsibilities.description')}
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/20 p-6 rounded-lg">
                  <ul className="text-gray-300 space-y-2">
                    {(t('terms.content.clientResponsibilities.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-cyan-400 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Nossas Responsabilidades */}
          <section id="our-responsibilities" className="mb-16">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <Shield className="w-6 h-6 text-blue-400" />
                5. {t('terms.content.ourResponsibilities.title')}
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <p className="text-gray-300 mb-6">
                  {t('terms.content.ourResponsibilities.description')}
                </p>
                <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-lg">
                  <ul className="text-gray-300 space-y-2">
                    {(t('terms.content.ourResponsibilities.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 6. Propriedade Intelectual */}
          <section id="intellectual-property" className="mb-16">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <Lock className="w-6 h-6 text-amber-400" />
                6. {t('terms.content.intellectualProperty.title')}
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <div className="space-y-4">
                  <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-amber-300 mb-2">{t('terms.content.intellectualProperty.items.codeAndTechnology.title')}</h4>
                    <p className="text-gray-300">{t('terms.content.intellectualProperty.items.codeAndTechnology.description')}</p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">{t('terms.content.intellectualProperty.items.clientData.title')}</h4>
                    <p className="text-gray-300">{t('terms.content.intellectualProperty.items.clientData.description')}</p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-purple-300 mb-2">{t('terms.content.intellectualProperty.items.derivedKnowledge.title')}</h4>
                    <p className="text-gray-300">{t('terms.content.intellectualProperty.items.derivedKnowledge.description')}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 7. Proteção de Dados */}
          <section id="data-protection" className="mb-16">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <Shield className="w-6 h-6 text-indigo-400" />
                7. {t('terms.content.dataProtection.title')}
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-lg mb-6">
                  <p className="text-indigo-200 font-medium">
                    {t('terms.content.dataProtection.lgpdCompliance')}
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">{t('terms.content.dataProtection.items.dataProcessing.title')}</h4>
                    <p className="text-gray-300">{t('terms.content.dataProtection.items.dataProcessing.description')}</p>
                  </div>
                  <div className="bg-pink-500/10 border border-pink-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-pink-300 mb-2">{t('terms.content.dataProtection.items.securityMeasures.title')}</h4>
                    <ul className="text-gray-300 space-y-1 mt-2">
                      {(t('terms.content.dataProtection.items.securityMeasures.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-purple-300 mb-2">{t('terms.content.dataProtection.items.dataSubjectRights.title')}</h4>
                    <p className="text-gray-300">{t('terms.content.dataProtection.items.dataSubjectRights.description')}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 8. Limitações e Garantias */}
          <section id="limitations" className="mb-16">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                8. {t('terms.content.limitations.title')}
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <div className="space-y-6">
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-300 mb-3">{t('terms.content.limitations.warranties.title')}</h4>
                    <ul className="text-gray-300 space-y-1">
                      {(t('terms.content.limitations.warranties.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-red-300 mb-3">{t('terms.content.limitations.limitations.title')}</h4>
                    <p className="text-gray-300 mb-3">{t('terms.content.limitations.limitations.description')}</p>
                    <ul className="text-gray-300 space-y-1 mb-4">
                      {(t('terms.content.limitations.limitations.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                    <div className="bg-red-600/20 border border-red-500/30 p-3 rounded">
                      <p className="text-red-200 font-medium text-sm">
                        <AlertTriangle className="w-4 h-4 inline mr-2" />
                        {t('terms.content.limitations.limitations.limitationNote')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 9. Condições de Pagamento */}
          <section id="payments" className="mb-16">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-yellow-400" />
                9. {t('terms.content.payments.title')}
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <div className="space-y-4">
                  <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-yellow-300 mb-2">{t('terms.content.payments.items.valuesAndSchedule.title')}</h4>
                    <p className="text-gray-300">{t('terms.content.payments.items.valuesAndSchedule.description')}</p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">{t('terms.content.payments.items.paymentMethods.title')}</h4>
                    <ul className="text-gray-300 space-y-1 mt-2">
                      {(t('terms.content.payments.items.paymentMethods.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-red-300 mb-2">{t('terms.content.payments.items.latePayment.title')}</h4>
                    <p className="text-gray-300">{t('terms.content.payments.items.latePayment.description')}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 10. Rescisão do Contrato */}
          <section id="termination" className="mb-16">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <XCircle className="w-6 h-6 text-orange-400" />
                10. {t('terms.content.termination.title')}
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <div className="space-y-4">
                  <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-orange-300 mb-2">{t('terms.content.termination.items.mutualAgreement.title')}</h4>
                    <p className="text-gray-300">{t('terms.content.termination.items.mutualAgreement.description')}</p>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-red-300 mb-2">{t('terms.content.termination.items.breach.title')}</h4>
                    <p className="text-gray-300">{t('terms.content.termination.items.breach.description')}</p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-purple-300 mb-2">{t('terms.content.termination.items.effects.title')}</h4>
                    <ul className="text-gray-300 space-y-1 mt-2">
                      {(t('terms.content.termination.items.effects.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 11. Disposições Gerais */}
          <section id="general" className="mb-16">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <Scale className="w-6 h-6 text-teal-400" />
                11. {t('terms.content.general.title')}
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <div className="space-y-4">
                  <div className="bg-teal-500/10 border border-teal-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-teal-300 mb-2">{t('terms.content.general.items.applicableLaw.title')}</h4>
                    <p className="text-gray-300">{t('terms.content.general.items.applicableLaw.description')}</p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">{t('terms.content.general.items.competentForum.title')}</h4>
                    <p className="text-gray-300">{t('terms.content.general.items.competentForum.description')}</p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-purple-300 mb-2">{t('terms.content.general.items.modifications.title')}</h4>
                    <p className="text-gray-300">{t('terms.content.general.items.modifications.description')}</p>
                  </div>
                  <div className="bg-pink-500/10 border border-pink-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-pink-300 mb-2">{t('terms.content.general.items.contact.title')}</h4>
                    <p className="text-gray-300">{t('terms.content.general.items.contact.description')}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contato */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 text-center">
                Dúvidas sobre os Termos?
              </h2>
              <div className="text-center">
                <p className="text-gray-300 mb-6 font-sans">
                  Nossa equipe está disponível para esclarecer qualquer questão sobre estes termos de serviço.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="mailto:contato@mindtecnologia-ai.com.br"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 hover:border-blue-500/50 text-blue-200 hover:text-blue-100 transition-all duration-300 font-sans"
                  >
                    <Shield className="w-4 h-4" />
                    contato@mindtecnologia-ai.com.br
                  </a>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 hover:border-purple-500/50 text-purple-200 hover:text-purple-100 transition-all duration-300 font-sans"
                  >
                    <Phone className="w-4 h-4" />
                    Fale Conosco
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
        className="fixed bottom-8 right-8 z-40 p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
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

export default TermsOfService;