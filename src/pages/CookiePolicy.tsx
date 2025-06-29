import React, { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import { FloatingOrbs } from "@/components/ui/orbs";
import { ArrowUp, Cookie, Shield, Settings, Eye, BarChart3, Zap, AlertTriangle, Clock, Scale, ChevronLeft, Lock, Monitor, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

const CookiePolicy = () => {
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
    { id: "what-are-cookies", title: "O que são Cookies", icon: Cookie },
    { id: "types-of-cookies", title: "Tipos de Cookies", icon: Settings },
    { id: "cookies-we-use", title: "Cookies que Utilizamos", icon: Eye },
    { id: "third-party-cookies", title: "Cookies de Terceiros", icon: BarChart3 },
    { id: "cookie-management", title: "Gerenciar Cookies", icon: Settings },
    { id: "legal-basis", title: "Base Legal", icon: Scale },
    { id: "data-retention", title: "Retenção de Dados", icon: Clock },
    { id: "policy-updates", title: "Atualizações", icon: AlertTriangle }
  ];

  return (
    <div className="min-h-screen relative bg-gray-950">
      {/* Background Orbs */}
      <FloatingOrbs orbCount={20} sectionId="cookies-background" enableMouseFollow={true} />
      
      {/* Frosted Glass Overlay - apenas para o background, não sobre o conteúdo */}
      <div className="fixed inset-0 z-[1] pointer-events-none frosted-glass-overlay" style={{ zIndex: 0 }} />
      
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
              <span className="text-sm font-medium text-amber-200 font-sans">Política de Cookies</span>
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
      
      <main className="relative z-20 pt-24">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100/80 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300 border border-amber-200/50 dark:border-amber-700/50 mb-6 backdrop-blur-sm">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-white mr-2 font-sans">🍪</span>
                <span className="font-sans">Transparência Digital</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-white">
                Política de
                <br />
                <span 
                  className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-orange-500 to-red-500"
                  style={{
                    backgroundSize: '200% 200%',
                    animation: 'gradientFlow 3s ease-in-out infinite'
                  }}
                >
                  Cookies
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
              
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 max-w-2xl mx-auto">
                <p className="text-sm text-amber-200 font-sans">
                  Esta política explica como utilizamos cookies e tecnologias similares em nosso site, 
                  garantindo transparência sobre coleta e uso de dados de navegação.
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
                1. O que são Cookies
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <p className="text-gray-300 mb-4">
                  Cookies são pequenos arquivos de texto armazenados no seu dispositivo (computador, tablet ou smartphone) 
                  quando você visita um site. Eles são amplamente utilizados para fazer os sites funcionarem de forma 
                  mais eficiente e fornecer informações aos proprietários do site.
                </p>
                <p className="text-gray-300 mb-4">
                  Os cookies permitem que um site reconheça seu dispositivo e armazene algumas informações sobre suas 
                  preferências ou ações anteriores. Isso melhora sua experiência de navegação, tornando-a mais rápida 
                  e personalizada.
                </p>
                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
                  <p className="text-amber-200 font-medium">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Os cookies não podem acessar outros arquivos no seu dispositivo nem instalar vírus.
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
                2. Tipos de Cookies
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <p className="text-gray-300 mb-6">
                  Utilizamos diferentes tipos de cookies, cada um com uma finalidade específica:
                </p>
                <div className="grid gap-4">
                  <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-green-300 mb-2 flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Cookies Essenciais
                    </h4>
                    <p className="text-gray-300 mb-2">
                      Necessários para o funcionamento básico do site. Sem eles, algumas funcionalidades não funcionariam.
                    </p>
                    <ul className="text-gray-300 space-y-1 text-sm">
                      <li>• Manutenção da sessão do usuário</li>
                      <li>• Configurações de segurança</li>
                      <li>• Preferências de idioma</li>
                      <li>• Estado de formulários</li>
                    </ul>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-300 mb-2 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Cookies de Performance
                    </h4>
                    <p className="text-gray-300 mb-2">
                      Coletam informações sobre como você usa o site para melhorar sua performance.
                    </p>
                    <ul className="text-gray-300 space-y-1 text-sm">
                      <li>• Páginas mais visitadas</li>
                      <li>• Tempo de carregamento</li>
                      <li>• Erros encontrados</li>
                      <li>• Padrões de navegação</li>
                    </ul>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-purple-300 mb-2 flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Cookies de Funcionalidade
                    </h4>
                    <p className="text-gray-300 mb-2">
                      Permitem que o site lembre suas escolhas e forneça recursos aprimorados.
                    </p>
                    <ul className="text-gray-300 space-y-1 text-sm">
                      <li>• Preferências de tema</li>
                      <li>• Configurações de acessibilidade</li>
                      <li>• Localização geográfica</li>
                      <li>• Histórico de navegação</li>
                    </ul>
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-orange-300 mb-2 flex items-center gap-2">
                      <Monitor className="w-5 h-5" />
                      Cookies de Marketing
                    </h4>
                    <p className="text-gray-300 mb-2">
                      Utilizados para tornar as mensagens publicitárias mais relevantes para você.
                    </p>
                    <ul className="text-gray-300 space-y-1 text-sm">
                      <li>• Rastreamento de conversões</li>
                      <li>• Personalização de anúncios</li>
                      <li>• Análise de campanhas</li>
                      <li>• Remarketing</li>
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
                3. Cookies que Utilizamos
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <p className="text-gray-300 mb-6">
                  Detalhamento específico dos cookies utilizados em nosso site:
                </p>
                <div className="space-y-6">
                  <div className="bg-cyan-500/10 border border-cyan-500/20 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-cyan-300 mb-4">Cookies Próprios (First-Party)</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-600">
                            <th className="text-left py-2 text-cyan-200">Nome</th>
                            <th className="text-left py-2 text-cyan-200">Finalidade</th>
                            <th className="text-left py-2 text-cyan-200">Duração</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-300">
                          <tr className="border-b border-gray-700">
                            <td className="py-2 font-mono">session_id</td>
                            <td className="py-2">Identificação da sessão</td>
                            <td className="py-2">Sessão</td>
                          </tr>
                          <tr className="border-b border-gray-700">
                            <td className="py-2 font-mono">user_preferences</td>
                            <td className="py-2">Preferências do usuário</td>
                            <td className="py-2">30 dias</td>
                          </tr>
                          <tr className="border-b border-gray-700">
                            <td className="py-2 font-mono">cookie_consent</td>
                            <td className="py-2">Consentimento de cookies</td>
                            <td className="py-2">1 ano</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-mono">theme_mode</td>
                            <td className="py-2">Modo escuro/claro</td>
                            <td className="py-2">90 dias</td>
                          </tr>
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
                4. Cookies de Terceiros
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <p className="text-gray-300 mb-6">
                  Também utilizamos cookies de serviços terceirizados para funcionalidades específicas:
                </p>
                <div className="space-y-4">
                  <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-purple-300 mb-2">Google Analytics</h4>
                    <p className="text-gray-300 mb-2">Para análise de tráfego e comportamento dos usuários.</p>
                    <p className="text-sm text-gray-400">
                      Cookies: _ga, _ga_*, _gid, _gat_gtag_*
                    </p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">Google Tag Manager</h4>
                    <p className="text-gray-300 mb-2">Para gerenciamento de tags e scripts.</p>
                    <p className="text-sm text-gray-400">
                      Cookies: _gtm, _gtag
                    </p>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-green-300 mb-2">Hotjar</h4>
                    <p className="text-gray-300 mb-2">Para análise de experiência do usuário e mapas de calor.</p>
                    <p className="text-sm text-gray-400">
                      Cookies: _hjid, _hjSession*, _hjIncludedInPageviewSample
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
                5. Como Gerenciar Cookies
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <p className="text-gray-300 mb-6">
                  Você tem controle total sobre os cookies. Pode gerenciá-los de várias formas:
                </p>
                <div className="space-y-4">
                  <div className="bg-teal-500/10 border border-teal-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-teal-300 mb-2 flex items-center gap-2">
                      <Monitor className="w-5 h-5" />
                      Configurações do Navegador
                    </h4>
                    <p className="text-gray-300 mb-3">
                      Todos os navegadores permitem gerenciar cookies através de suas configurações:
                    </p>
                    <div className="grid gap-3">
                      <div className="bg-gray-700/30 p-3 rounded">
                        <p className="font-medium text-white mb-1">Chrome</p>
                        <p className="text-sm text-gray-300">Configurações → Privacidade e Segurança → Cookies</p>
                      </div>
                      <div className="bg-gray-700/30 p-3 rounded">
                        <p className="font-medium text-white mb-1">Firefox</p>
                        <p className="text-sm text-gray-300">Preferências → Privacidade e Segurança → Cookies</p>
                      </div>
                      <div className="bg-gray-700/30 p-3 rounded">
                        <p className="font-medium text-white mb-1">Safari</p>
                        <p className="text-sm text-gray-300">Preferências → Privacidade → Cookies</p>
                      </div>
                      <div className="bg-gray-700/30 p-3 rounded">
                        <p className="font-medium text-white mb-1">Edge</p>
                        <p className="text-sm text-gray-300">Configurações → Cookies e Permissões do Site</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-300 mb-2 flex items-center gap-2">
                      <Smartphone className="w-5 h-5" />
                      Banner de Consentimento
                    </h4>
                    <p className="text-gray-300">
                      Use nosso banner de cookies para aceitar ou recusar categorias específicas de cookies.
                      Suas preferências serão lembradas para futuras visitas.
                    </p>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-yellow-300 mb-2">Opt-out de Terceiros</h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-300">
                        • <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-yellow-300 hover:underline">Google Analytics Opt-out</a>
                      </p>
                      <p className="text-gray-300">
                        • <a href="https://www.hotjar.com/legal/compliance/opt-out" target="_blank" rel="noopener noreferrer" className="text-yellow-300 hover:underline">Hotjar Opt-out</a>
                      </p>
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
                6. Base Legal
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <p className="text-gray-300 mb-6">
                  O uso de cookies é baseado nas seguintes bases legais:
                </p>
                <div className="space-y-4">
                  <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-indigo-300 mb-2">Consentimento (Art. 7º, I da LGPD)</h4>
                    <p className="text-gray-300">
                      Para cookies não essenciais, obtemos seu consentimento explícito através do banner de cookies.
                    </p>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-green-300 mb-2">Legítimo Interesse (Art. 7º, IX da LGPD)</h4>
                    <p className="text-gray-300">
                      Para cookies essenciais necessários ao funcionamento do site e melhoria dos serviços.
                    </p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">Execução de Contrato (Art. 7º, V da LGPD)</h4>
                    <p className="text-gray-300">
                      Para cookies necessários à prestação dos serviços contratados.
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
                7. Retenção de Dados
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <p className="text-gray-300 mb-6">
                  Os dados coletados através de cookies são mantidos pelos seguintes períodos:
                </p>
                <div className="space-y-4">
                  <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-orange-300 mb-2">Cookies de Sessão</h4>
                    <p className="text-gray-300">
                      Eliminados automaticamente quando você fecha o navegador.
                    </p>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-yellow-300 mb-2">Cookies Persistentes</h4>
                    <p className="text-gray-300">
                      Mantidos pelo período especificado em cada cookie (de 30 dias a 2 anos).
                    </p>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-red-300 mb-2">Dados Analíticos</h4>
                    <p className="text-gray-300">
                      Dados agregados e anonimizados podem ser mantidos por até 26 meses para análise de tendências.
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
                8. Atualizações desta Política
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <p className="text-gray-300 mb-4">
                  Esta Política de Cookies pode ser atualizada periodicamente para refletir mudanças em nossas 
                  práticas ou por motivos operacionais, legais ou regulamentares.
                </p>
                <p className="text-gray-300 mb-6">
                  Quando fizermos alterações significativas, notificaremos você através do banner de cookies 
                  ou por outros meios apropriados antes que as mudanças entrem em vigor.
                </p>
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                  <p className="text-red-200 font-medium">
                    <AlertTriangle className="w-4 h-4 inline mr-2" />
                    Recomendamos que você revise esta política periodicamente para se manter informado sobre como utilizamos cookies.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contato */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 text-center">
                Dúvidas sobre Cookies?
              </h2>
              <div className="text-center">
                <p className="text-gray-300 mb-6 font-sans">
                  Se você tiver dúvidas sobre nossa Política de Cookies ou quiser exercer seus direitos, 
                  entre em contato conosco.
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
                    <Eye className="w-4 h-4" />
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
        className="fixed bottom-8 right-8 z-40 p-3 rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        aria-label="Voltar ao topo"
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