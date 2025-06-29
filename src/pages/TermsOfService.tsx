import React, { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import { FloatingOrbs } from "@/components/ui/orbs";
import { ArrowUp, FileText, Shield, Database, CreditCard, UserCheck, AlertTriangle, Scale, Clock, Phone, Home, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const TermsOfService = () => {
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
    { id: "acceptance", title: "Aceitação dos Termos", icon: UserCheck },
    { id: "definitions", title: "Definições", icon: FileText },
    { id: "services", title: "Descrição dos Serviços", icon: Database },
    { id: "client-responsibilities", title: "Responsabilidades do Cliente", icon: Shield },
    { id: "our-responsibilities", title: "Nossas Responsabilidades", icon: UserCheck },
    { id: "intellectual-property", title: "Propriedade Intelectual", icon: Shield },
    { id: "data-protection", title: "Proteção de Dados", icon: Database },
    { id: "limitations", title: "Limitações e Garantias", icon: AlertTriangle },
    { id: "payments", title: "Pagamentos", icon: CreditCard },
    { id: "termination", title: "Rescisão", icon: Clock },
    { id: "general", title: "Disposições Gerais", icon: Scale }
  ];

  return (
    <div className="min-h-screen relative bg-gray-950">
      {/* Background Orbs */}
      <FloatingOrbs orbCount={20} sectionId="terms-background" enableMouseFollow={true} />
      
      {/* Frosted Glass Overlay */}
      <div className="fixed inset-0 z-[1] pointer-events-none frosted-glass-overlay" />
      
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
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20">
              <Scale className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-medium text-violet-200 font-sans">Termos Legais</span>
            </div>
          </div>

          {/* Botão voltar */}
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-gray-600/50 text-gray-300 hover:text-white transition-all duration-300 font-sans"
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar
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
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-violet-100/80 dark:bg-violet-900/50 text-violet-600 dark:text-violet-300 border border-violet-200/50 dark:border-violet-700/50 mb-6 backdrop-blur-sm">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-violet-500 text-white mr-2 font-sans">⚖</span>
                <span className="font-sans">Termos Legais</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-white">
                Termos de
                <br />
                <span 
                  className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                  style={{
                    backgroundSize: '200% 200%',
                    animation: 'gradientFlow 3s ease-in-out infinite'
                  }}
                >
                  Serviço
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
                Última atualização: 25 de janeiro de 2025
              </p>
              
              <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-4 max-w-2xl mx-auto">
                <p className="text-sm text-violet-200 font-sans">
                  Estes termos regem o uso dos serviços de inteligência artificial da Mind AI Tecnologia. 
                  Ao contratar nossos serviços, você concorda com todos os termos descritos abaixo.
                </p>
              </div>
            </div>

            {/* Índice */}
            <div className="max-w-4xl mx-auto mb-16">
              <h2 className="text-2xl font-display font-bold text-white mb-6 text-center">Índice</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sections.map((section, index) => {
                  const Icon = section.icon;
                  return (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className={`flex items-center gap-3 p-4 rounded-lg border transition-all duration-300 hover:scale-105 ${
                        activeSection === section.id
                          ? 'bg-violet-500/20 border-violet-500/50 text-violet-200'
                          : 'bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50'
                      }`}
                    >
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-500 text-white text-sm font-bold">
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
                <UserCheck className="w-6 h-6 text-violet-400" />
                1. Aceitação dos Termos
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <p className="text-gray-300 mb-4">
                  Ao contratar os serviços da Mind AI Tecnologia, pessoa jurídica de direito privado, 
                  inscrita no CNPJ sob o nº [CNPJ], com sede na R. S-1, Q. 153 - L. 25 - St. Bueno, Goiânia - GO, 74230-220, você ("Cliente") 
                  concorda expressamente com estes Termos de Serviço.
                </p>
                <p className="text-gray-300 mb-4">
                  Estes termos constituem um acordo legal vinculativo entre você e a Mind AI Tecnologia. 
                  Se você não concorda com qualquer parte destes termos, não deve contratar nossos serviços.
                </p>
                <p className="text-gray-300">
                  A contratação pode ocorrer através de proposta comercial assinada, aceite eletrônico 
                  ou início da prestação dos serviços após aprovação mútua do escopo do projeto.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Definições */}
          <section id="definitions" className="mb-16">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-400" />
                2. Definições
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <div className="grid gap-4">
                  <div className="bg-gray-900/50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">Serviços de IA</h4>
                    <p className="text-gray-300">Desenvolvimento, implementação e manutenção de soluções de inteligência artificial personalizadas, incluindo agentes inteligentes, automação de processos e integração com sistemas existentes.</p>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-purple-300 mb-2">Agentes Inteligentes</h4>
                    <p className="text-gray-300">Sistemas de IA capazes de executar tarefas específicas de forma autônoma, como atendimento ao cliente, vendas, gestão de processos e análise de dados.</p>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-pink-300 mb-2">Dados do Cliente</h4>
                    <p className="text-gray-300">Todas as informações, dados, arquivos, bases de dados e conteúdo fornecidos pelo Cliente para desenvolvimento e operação dos serviços de IA.</p>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-green-300 mb-2">Solução Personalizada</h4>
                    <p className="text-gray-300">Sistema de IA desenvolvido especificamente para atender às necessidades e processos únicos do Cliente.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Descrição dos Serviços */}
          <section id="services" className="mb-16">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <Database className="w-6 h-6 text-indigo-400" />
                3. Descrição dos Serviços
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <p className="text-gray-300 mb-6">
                  A Mind AI Tecnologia oferece os seguintes serviços principais:
                </p>
                <div className="grid gap-4">
                  <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-indigo-300 mb-2">Desenvolvimento de IA Personalizada</h4>
                    <p className="text-gray-300">Criação de agentes inteligentes sob medida para automatizar processos específicos do seu negócio.</p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-purple-300 mb-2">Integração de Sistemas</h4>
                    <p className="text-gray-300">Conexão dos agentes de IA com CRMs, ERPs, bancos de dados e ferramentas existentes.</p>
                  </div>
                  <div className="bg-pink-500/10 border border-pink-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-pink-300 mb-2">Automação de Processos</h4>
                    <p className="text-gray-300">Implementação de fluxos automatizados para vendas, atendimento, gestão e análise de dados.</p>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-green-300 mb-2">Suporte e Manutenção</h4>
                    <p className="text-gray-300">Monitoramento contínuo, ajustes, melhorias e suporte técnico especializado.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Responsabilidades do Cliente */}
          <section id="client-responsibilities" className="mb-16">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <Shield className="w-6 h-6 text-orange-400" />
                4. Responsabilidades do Cliente
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <p className="text-gray-300 mb-4">O Cliente compromete-se a:</p>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></span>
                    Fornecer informações precisas e completas sobre seus processos e necessidades
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></span>
                    Disponibilizar acesso aos sistemas e dados necessários para desenvolvimento
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></span>
                    Colaborar ativamente durante o processo de desenvolvimento e testes
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></span>
                    Manter a confidencialidade das informações técnicas compartilhadas
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></span>
                    Realizar pagamentos conforme cronograma acordado
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></span>
                    Usar os serviços de forma legal e ética
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 5. Nossas Responsabilidades */}
          <section id="our-responsibilities" className="mb-16">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <UserCheck className="w-6 h-6 text-teal-400" />
                5. Nossas Responsabilidades
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <p className="text-gray-300 mb-4">A Mind AI Tecnologia compromete-se a:</p>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></span>
                    Desenvolver soluções de IA de acordo com as especificações acordadas
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></span>
                    Entregar os projetos dentro dos prazos estabelecidos
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></span>
                    Fornecer treinamento e documentação adequados
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></span>
                    Oferecer suporte técnico durante o período acordado
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></span>
                    Manter confidencialidade absoluta sobre dados e informações do Cliente
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></span>
                    Implementar medidas de segurança adequadas para proteção de dados
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 6. Propriedade Intelectual */}
          <section id="intellectual-property" className="mb-16">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <Shield className="w-6 h-6 text-yellow-400" />
                6. Propriedade Intelectual
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-yellow-300 mb-3">Código e Tecnologia</h4>
                    <p className="text-gray-300">
                      O código-fonte, algoritmos, modelos de IA e tecnologias desenvolvidas pela Mind AI 
                      permanecem de propriedade exclusiva da empresa, sendo licenciados para uso do Cliente 
                      conforme escopo acordado.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-yellow-300 mb-3">Dados do Cliente</h4>
                    <p className="text-gray-300">
                      Todos os dados fornecidos pelo Cliente permanecem de sua propriedade exclusiva. 
                      A Mind AI não utilizará estes dados para outros fins além da prestação dos serviços contratados.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-yellow-300 mb-3">Conhecimento Derivado</h4>
                    <p className="text-gray-300">
                      Insights, metodologias e conhecimentos gerais desenvolvidos durante a prestação dos 
                      serviços poderão ser utilizados pela Mind AI em projetos futuros, desde que não 
                      identifiquem ou comprometam informações específicas do Cliente.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 7. Proteção de Dados */}
          <section id="data-protection" className="mb-16">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <Database className="w-6 h-6 text-cyan-400" />
                7. Proteção de Dados e Privacidade
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-lg mb-6">
                  <p className="text-cyan-200 font-medium">
                    Esta seção está em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018)
                  </p>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-cyan-300 mb-3">Tratamento de Dados</h4>
                    <p className="text-gray-300">
                      A Mind AI atua como operadora de dados pessoais, tratando informações exclusivamente 
                      para prestação dos serviços contratados, sob instruções do Cliente (controlador).
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-cyan-300 mb-3">Medidas de Segurança</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Criptografia de dados em trânsito e em repouso</li>
                      <li>• Controles de acesso rigorosos</li>
                      <li>• Monitoramento contínuo de segurança</li>
                      <li>• Backup e recuperação de dados</li>
                      <li>• Treinamento de equipe em proteção de dados</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-cyan-300 mb-3">Direitos dos Titulares</h4>
                    <p className="text-gray-300">
                      Garantimos o exercício dos direitos previstos na LGPD, incluindo acesso, correção, 
                      anonimização, bloqueio, eliminação e portabilidade de dados pessoais.
                    </p>
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
                8. Limitações e Garantias
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-red-300 mb-3">Garantias Oferecidas</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Funcionamento conforme especificações acordadas</li>
                      <li>• Correção de bugs identificados durante período de garantia</li>
                      <li>• Suporte técnico durante período estabelecido</li>
                      <li>• Conformidade com padrões de segurança</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-red-300 mb-3">Limitações de Responsabilidade</h4>
                    <p className="text-gray-300 mb-4">
                      A Mind AI não se responsabiliza por:
                    </p>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Decisões tomadas com base em resultados dos sistemas de IA</li>
                      <li>• Danos decorrentes de uso inadequado ou não autorizado</li>
                      <li>• Falhas em sistemas de terceiros integrados</li>
                      <li>• Interrupções por motivos de força maior</li>
                      <li>• Lucros cessantes ou danos indiretos</li>
                    </ul>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                    <p className="text-red-200 font-medium">
                      A responsabilidade total da Mind AI está limitada ao valor total pago pelo Cliente 
                      no projeto específico onde ocorreu o problema.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 9. Pagamentos */}
          <section id="payments" className="mb-16">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-emerald-400" />
                9. Condições de Pagamento
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-emerald-300 mb-3">Valores e Cronograma</h4>
                    <p className="text-gray-300">
                      Os valores são estabelecidos na proposta comercial específica de cada projeto, 
                      com cronograma de pagamento vinculado às entregas e marcos do desenvolvimento.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-emerald-300 mb-3">Formas de Pagamento</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Transferência bancária (PIX, TED, DOC)</li>
                      <li>• Boleto bancário</li>
                      <li>• Outras formas acordadas na proposta</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-emerald-300 mb-3">Atraso no Pagamento</h4>
                    <p className="text-gray-300">
                      O atraso no pagamento superior a 15 dias pode resultar na suspensão dos serviços 
                      e cobrança de juros de 1% ao mês, além de multa de 2% sobre o valor em atraso.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 10. Rescisão */}
          <section id="termination" className="mb-16">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <Clock className="w-6 h-6 text-amber-400" />
                10. Rescisão do Contrato
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-amber-300 mb-3">Rescisão por Acordo Mútuo</h4>
                    <p className="text-gray-300">
                      O contrato pode ser rescindido a qualquer momento por acordo entre as partes, 
                      com acerto financeiro proporcional aos serviços já prestados.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-amber-300 mb-3">Rescisão por Inadimplemento</h4>
                    <p className="text-gray-300">
                      Qualquer das partes pode rescindir o contrato em caso de descumprimento material 
                      das obrigações, após notificação e prazo de 15 dias para regularização.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-amber-300 mb-3">Efeitos da Rescisão</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Cessação imediata dos serviços em desenvolvimento</li>
                      <li>• Entrega de materiais e códigos já desenvolvidos</li>
                      <li>• Pagamento proporcional dos serviços prestados</li>
                      <li>• Devolução de dados e informações confidenciais</li>
                      <li>• Manutenção das obrigações de confidencialidade</li>
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
                <Scale className="w-6 h-6 text-slate-400" />
                11. Disposições Gerais
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-300 mb-3">Lei Aplicável</h4>
                    <p className="text-gray-300">
                      Este contrato é regido pelas leis da República Federativa do Brasil, 
                      especialmente pelo Código Civil, Código de Defesa do Consumidor (quando aplicável) 
                      e Lei Geral de Proteção de Dados.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-300 mb-3">Foro Competente</h4>
                    <p className="text-gray-300">
                      Fica eleito o foro da comarca de [Cidade/Estado] para dirimir quaisquer 
                      controvérsias decorrentes deste contrato, renunciando as partes a qualquer outro.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-300 mb-3">Modificações</h4>
                    <p className="text-gray-300">
                      Estes termos podem ser atualizados periodicamente. Clientes ativos serão 
                      notificados com 30 dias de antecedência sobre mudanças significativas.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-300 mb-3">Contato</h4>
                    <p className="text-gray-300">
                      Para dúvidas sobre estes termos, entre em contato através dos canais oficiais 
                      disponíveis em nosso site ou por e-mail: contato@mindtecnologia-ai.com.br
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer da página */}
          <div className="text-center py-8 border-t border-gray-700">
            <p className="text-gray-400 mb-4 font-sans">
              Mind AI Tecnologia - Termos de Serviço
            </p>
            <p className="text-sm text-gray-500 font-sans">
              Última atualização: 25 de janeiro de 2025
            </p>
          </div>
        </div>
      </main>

      {/* Botão voltar ao topo */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-50 bg-violet-500 hover:bg-violet-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Voltar ao topo"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default TermsOfService;