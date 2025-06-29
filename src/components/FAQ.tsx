import React, { useRef, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const faqItems = [
    {
      question: "Quanto tempo leva para implementar uma solução de IA personalizada?",
      answer: "O tempo varia conforme a complexidade do projeto, mas em média iniciamos a entrega de soluções a partir de 21 dias úteis após o alinhamento inicial."
    },
    {
      question: "A solução se integra aos sistemas que já usamos?",
      answer: "Sim. Nossas soluções são desenvolvidas para integrar com CRMs, ERPs, bancos de dados e ferramentas como WhatsApp, Notion, Trello, Google Sheets e muito mais."
    },
    {
      question: "Preciso ter conhecimentos técnicos para utilizar os agentes de IA?",
      answer: "Não. Nossos fluxos são criados para serem totalmente intuitivos. Fornecemos treinamentos simples e suporte para sua equipe aproveitar todo o potencial da IA sem complicações."
    },
    {
      question: "Como funciona a implementação?",
      answer: "Iniciamos com um cronograma detalhado, alinhando todas as etapas do projeto. A implementação acontece de forma progressiva, com entregas parciais que permitem ajustes e melhorias ao longo do processo. Assim, o agente pode ser moldado conforme suas necessidades antes da entrega final."
    },
    {
      question: "Como funciona após a entrega do projeto?",
      answer: "Após a entrega, seguimos acompanhando seu projeto com monitoramento técnico e suporte sempre que necessário. Caso surjam dúvidas, ajustes ou qualquer instabilidade, nossa equipe estará disponível para ajudar de forma rápida e objetiva."
    }
  ];

  return (
        <section className="w-full py-16 relative overflow-hidden" id="faq" ref={sectionRef}>

      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
        {/* Header with badge and line */}
        <div className="flex items-center gap-4 mb-8 sm:mb-16 w-full">
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-violet-100/80 dark:bg-violet-900/50 text-violet-600 dark:text-violet-300 border border-violet-200/50 dark:border-violet-700/50 backdrop-blur-sm">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-violet-500 text-white mr-2 font-sans">?</span>
              <span className="font-sans">FAQ</span>
            </div>
          </div>
          <div className="flex-1 h-[1px] bg-violet-300/60 dark:bg-violet-700/60"></div>
        </div>

        {/* Main content */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display leading-tight mb-4">
              Confira as perguntas
            </h2>
            <h3 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
              style={{
                backgroundSize: '200% 200%',
                animation: 'gradientFlow 3s ease-in-out infinite'
              }}
            >
              mais frequentes:
            </h3>
            
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
          </div>

          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqItems.map((item, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800"
                >
                  <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                    <span className="text-lg font-medium text-gray-900 dark:text-white font-sans">
                      {item.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <p className="text-gray-600 dark:text-gray-400 font-sans">
                      {item.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ; 