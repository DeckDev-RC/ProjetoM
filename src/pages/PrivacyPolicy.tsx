import React, { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import { FloatingOrbs } from "@/components/ui/orbs";
import { ArrowUp, FileText, Shield, Database, Eye, UserCheck, AlertTriangle, Scale, Clock, Phone, Home, ChevronLeft, Cookie, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const PrivacyPolicy = () => {
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
    { id: "general-info", title: "Informações Gerais", icon: FileText },
    { id: "data-collected", title: "Dados Coletados", icon: Database },
    { id: "purpose", title: "Finalidade do Tratamento", icon: Eye },
    { id: "legal-basis", title: "Base Legal", icon: Scale },
    { id: "data-sharing", title: "Compartilhamento", icon: UserCheck },
    { id: "security", title: "Segurança e Proteção", icon: Shield },
    { id: "retention", title: "Retenção de Dados", icon: Clock },
    { id: "user-rights", title: "Direitos dos Titulares", icon: UserCheck },
    { id: "cookies", title: "Cookies e Tecnologias", icon: Cookie },
    { id: "policy-changes", title: "Alterações na Política", icon: AlertTriangle },
    { id: "contact-dpo", title: "Contato DPO", icon: Phone }
  ];

  return (
    <div className="min-h-screen relative bg-gray-950">
      {/* Background Orbs */}
      <FloatingOrbs orbCount={20} sectionId="privacy-background" enableMouseFollow={true} />
      
      {/* Frosted Glass Overlay */}
      <div className="fixed inset-0 z-[1] pointer-events-none frosted-glass-overlay" />
      
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
              <span className="text-sm font-medium text-blue-200 font-sans">Políticas de Privacidade</span>
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
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100/80 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/50 mb-6 backdrop-blur-sm">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white mr-2 font-sans">🔒</span>
                <span className="font-sans">Proteção de Dados</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-white">
                Políticas de
                <br />
                <span 
                  className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                  style={{
                    backgroundSize: '200% 200%',
                    animation: 'gradientFlow 3s ease-in-out infinite'
                  }}
                >
                  Privacidade
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
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 max-w-2xl mx-auto">
                <p className="text-sm text-blue-200 font-sans">
                  Esta política descreve como a Mind AI Tecnologia coleta, usa, armazena e protege 
                  seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD).
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
                1. Informações Gerais
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <p className="text-gray-300 mb-4">
                  A Mind AI Tecnologia, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº [CNPJ], 
                  com sede na R. S-1, Q. 153 - L. 25 - St. Bueno, Goiânia - GO, 74230-220, está comprometida com a proteção da privacidade e dos dados pessoais 
                  de seus clientes, usuários e parceiros.
                </p>
                <p className="text-gray-300 mb-4">
                  Esta Política de Privacidade descreve como coletamos, usamos, armazenamos, compartilhamos e 
                  protegemos suas informações pessoais, em conformidade com a Lei Geral de Proteção de Dados 
                  (LGPD - Lei 13.709/2018) e demais regulamentações aplicáveis.
                </p>
                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                  <p className="text-blue-200 font-medium">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Seus dados são tratados com o mais alto nível de segurança e transparência.
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
                2. Dados Coletados
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <p className="text-gray-300 mb-6">
                  Coletamos diferentes tipos de dados dependendo da sua interação com nossos serviços:
                </p>
                <div className="grid gap-4">
                  <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-purple-300 mb-2">Dados de Identificação</h4>
                    <ul className="text-gray-300 space-y-1">
                      <li>• Nome completo e razão social</li>
                      <li>• CPF/CNPJ</li>
                      <li>• Endereço de e-mail</li>
                      <li>• Telefone de contato</li>
                      <li>• Endereço físico</li>
                    </ul>
                  </div>
                  <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-indigo-300 mb-2">Dados de Navegação</h4>
                    <ul className="text-gray-300 space-y-1">
                      <li>• Endereço IP</li>
                      <li>• Informações do navegador</li>
                      <li>• Páginas visitadas</li>
                      <li>• Tempo de permanência</li>
                      <li>• Cookies e tecnologias similares</li>
                    </ul>
                  </div>
                  <div className="bg-pink-500/10 border border-pink-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-pink-300 mb-2">Dados Comerciais</h4>
                    <ul className="text-gray-300 space-y-1">
                      <li>• Histórico de contratações</li>
                      <li>• Preferências de serviços</li>
                      <li>• Dados de faturamento</li>
                      <li>• Comunicações comerciais</li>
                    </ul>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-green-300 mb-2">Dados Técnicos</h4>
                    <ul className="text-gray-300 space-y-1">
                      <li>• Logs de sistema</li>
                      <li>• Dados de performance</li>
                      <li>• Informações de integração</li>
                      <li>• Dados de uso dos serviços</li>
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
                3. Finalidade do Tratamento
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <p className="text-gray-300 mb-6">
                  Seus dados pessoais são tratados para as seguintes finalidades específicas:
                </p>
                <div className="space-y-4">
                  <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-cyan-300 mb-2">Prestação de Serviços</h4>
                    <p className="text-gray-300">Desenvolvimento, implementação e manutenção de soluções de IA personalizadas.</p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">Comunicação</h4>
                    <p className="text-gray-300">Envio de informações sobre serviços, atualizações técnicas e suporte ao cliente.</p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-purple-300 mb-2">Melhoria dos Serviços</h4>
                    <p className="text-gray-300">Análise de uso para aprimoramento e desenvolvimento de novas funcionalidades.</p>
                  </div>
                  <div className="bg-pink-500/10 border border-pink-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-pink-300 mb-2">Cumprimento Legal</h4>
                    <p className="text-gray-300">Atendimento a obrigações legais, regulamentares e contratuais.</p>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-green-300 mb-2">Segurança</h4>
                    <p className="text-gray-300">Prevenção de fraudes, proteção de sistemas e segurança da informação.</p>
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
                4. Base Legal para o Tratamento
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <p className="text-gray-300 mb-6">
                  O tratamento de seus dados pessoais é fundamentado nas seguintes bases legais previstas na LGPD:
                </p>
                <div className="space-y-4">
                  <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-yellow-300 mb-2">Execução de Contrato</h4>
                    <p className="text-gray-300">Para prestação dos serviços contratados e cumprimento de obrigações contratuais.</p>
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-orange-300 mb-2">Consentimento</h4>
                    <p className="text-gray-300">Quando você autoriza expressamente o tratamento para finalidades específicas.</p>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-red-300 mb-2">Obrigação Legal</h4>
                    <p className="text-gray-300">Para cumprimento de obrigações legais e regulamentares aplicáveis.</p>
                  </div>
                  <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-indigo-300 mb-2">Legítimo Interesse</h4>
                    <p className="text-gray-300">Para melhoria dos serviços, segurança e prevenção de fraudes.</p>
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
                5. Compartilhamento de Dados
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <p className="text-gray-300 mb-6">
                  Seus dados pessoais podem ser compartilhados apenas nas seguintes situações:
                </p>
                <div className="space-y-4">
                  <div className="bg-teal-500/10 border border-teal-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-teal-300 mb-2">Prestadores de Serviços</h4>
                    <p className="text-gray-300">Com parceiros técnicos que auxiliam na prestação dos serviços, sempre sob rigorosos contratos de confidencialidade.</p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">Autoridades Competentes</h4>
                    <p className="text-gray-300">Quando exigido por lei, ordem judicial ou por autoridades regulamentares.</p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-purple-300 mb-2">Consentimento Expresso</h4>
                    <p className="text-gray-300">Em situações específicas onde você autoriza expressamente o compartilhamento.</p>
                  </div>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg mt-6">
                  <p className="text-red-200 font-medium">
                    <AlertTriangle className="w-4 h-4 inline mr-2" />
                    Nunca vendemos, alugamos ou comercializamos seus dados pessoais.
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
                6. Segurança e Proteção
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <p className="text-gray-300 mb-6">
                  Implementamos medidas técnicas e organizacionais rigorosas para proteger seus dados:
                </p>
                <div className="grid gap-4">
                  <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-green-300 mb-2">Medidas Técnicas</h4>
                    <ul className="text-gray-300 space-y-1">
                      <li>• Criptografia de dados em trânsito e em repouso</li>
                      <li>• Controles de acesso baseados em funções</li>
                      <li>• Monitoramento contínuo de segurança</li>
                      <li>• Backups seguros e redundantes</li>
                      <li>• Testes regulares de penetração</li>
                    </ul>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">Medidas Organizacionais</h4>
                    <ul className="text-gray-300 space-y-1">
                      <li>• Treinamento regular da equipe</li>
                      <li>• Políticas internas de segurança</li>
                      <li>• Contratos de confidencialidade</li>
                      <li>• Auditoria de processos</li>
                      <li>• Plano de resposta a incidentes</li>
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
                7. Retenção de Dados
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <p className="text-gray-300 mb-6">
                  Mantemos seus dados pessoais apenas pelo tempo necessário para as finalidades específicas:
                </p>
                <div className="space-y-4">
                  <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-orange-300 mb-2">Durante a Prestação de Serviços</h4>
                    <p className="text-gray-300">Enquanto durar a relação contratual e prestação dos serviços.</p>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-yellow-300 mb-2">Período Legal</h4>
                    <p className="text-gray-300">Conforme exigido por obrigações legais (ex: dados fiscais por 5 anos).</p>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-red-300 mb-2">Eliminação Segura</h4>
                    <p className="text-gray-300">Após o período de retenção, os dados são eliminados de forma segura e irreversível.</p>
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
                8. Seus Direitos como Titular
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <p className="text-gray-300 mb-6">
                  Você possui os seguintes direitos em relação aos seus dados pessoais:
                </p>
                <div className="grid gap-4">
                  <div className="bg-violet-500/10 border border-violet-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-violet-300 mb-2">Acesso</h4>
                    <p className="text-gray-300">Confirmar a existência e obter acesso aos seus dados pessoais.</p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">Correção</h4>
                    <p className="text-gray-300">Solicitar a correção de dados incompletos, inexatos ou desatualizados.</p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-purple-300 mb-2">Eliminação</h4>
                    <p className="text-gray-300">Solicitar a eliminação de dados desnecessários, excessivos ou tratados em desconformidade.</p>
                  </div>
                  <div className="bg-pink-500/10 border border-pink-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-pink-300 mb-2">Portabilidade</h4>
                    <p className="text-gray-300">Solicitar a portabilidade dos dados para outro fornecedor de serviços.</p>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-green-300 mb-2">Oposição</h4>
                    <p className="text-gray-300">Opor-se ao tratamento realizado com base no legítimo interesse.</p>
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-cyan-300 mb-2">Revogação do Consentimento</h4>
                    <p className="text-gray-300">Revogar o consentimento para tratamentos específicos.</p>
                  </div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg mt-6">
                  <p className="text-blue-200 font-medium">
                    Para exercer seus direitos, entre em contato através do e-mail: contato@mindtecnologia-ai.com.br
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
                9. Cookies e Tecnologias Similares
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <p className="text-gray-300 mb-6">
                  Utilizamos cookies e tecnologias similares para melhorar sua experiência:
                </p>
                <div className="space-y-4">
                  <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-amber-300 mb-2">Cookies Essenciais</h4>
                    <p className="text-gray-300">Necessários para o funcionamento básico do site e dos serviços.</p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">Cookies de Performance</h4>
                    <p className="text-gray-300">Coletam informações sobre como você usa nosso site para melhorias.</p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-purple-300 mb-2">Cookies de Funcionalidade</h4>
                    <p className="text-gray-300">Permitem personalizar sua experiência e lembrar suas preferências.</p>
                  </div>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg mt-6">
                  <p className="text-amber-200 font-medium">
                    Você pode gerenciar suas preferências de cookies através das configurações do seu navegador.
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
                10. Alterações nesta Política
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-red-300 mb-3">Atualizações</h4>
                    <p className="text-gray-300">
                      Esta Política de Privacidade pode ser atualizada periodicamente para refletir mudanças 
                      em nossos serviços, práticas de dados ou requisitos legais.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-red-300 mb-3">Notificação</h4>
                    <p className="text-gray-300">
                      Notificaremos sobre alterações significativas através de e-mail ou aviso em nosso site, 
                      com antecedência mínima de 30 dias.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-red-300 mb-3">Versão Atual</h4>
                    <p className="text-gray-300">
                      A data da última atualização está sempre indicada no início desta política. 
                      Recomendamos a revisão periódica deste documento.
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
                11. Contato do Encarregado de Dados (DPO)
              </h2>
              <div className="prose prose-invert max-w-none font-sans">
                <p className="text-gray-300 mb-6">
                  Para questões relacionadas à proteção de dados, exercício de direitos ou esclarecimentos 
                  sobre esta política, entre em contato com nosso Encarregado de Proteção de Dados:
                </p>
                <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-lg">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Database className="w-5 h-5 text-green-400" />
                      <span className="text-green-300 font-semibold">Encarregado de Proteção de Dados (DPO)</span>
                    </div>
                    <div className="space-y-2 text-gray-300">
                      <p><strong>E-mail:</strong> contato@mindtecnologia-ai.com.br</p>
                      <p><strong>Telefone:</strong> +55 62 99314-0780</p>
                      <p><strong>Endereço:</strong> R. S-1, Q. 153 - L. 25 - St. Bueno, Goiânia - GO, 74230-220</p>
                      <p><strong>Horário de atendimento:</strong> Segunda a sexta, das 9h às 18h</p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg mt-6">
                  <p className="text-blue-200 font-medium">
                    <Shield className="w-4 h-4 inline mr-2" />
                    Comprometemo-nos a responder suas solicitações em até 15 dias úteis.
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
        aria-label="Voltar ao topo"
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