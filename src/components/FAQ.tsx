import React, { useRef, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FloatingOrbs } from "./ui/orbs";

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
      question: "Quando eu recebo acesso as aulas?",
      answer: "Você receberá acesso imediato após a confirmação do pagamento. Todo o conteúdo estará disponível em nossa plataforma de ensino exclusiva."
    },
    {
      question: "Como faço para iniciar o curso?",
      answer: "Após a confirmação do pagamento, você receberá um e-mail com suas credenciais de acesso. Basta fazer login na plataforma e começar a assistir as aulas."
    },
    {
      question: "Como o curso está estruturado?",
      answer: "O curso é dividido em módulos progressivos, com aulas em vídeo, materiais complementares e exercícios práticos. Você pode estudar no seu próprio ritmo."
    },
    {
      question: "O curso abrange o uso do Trello em ambientes pessoais?",
      answer: "Sim, o curso cobre tanto o uso profissional quanto pessoal do Trello, com exemplos práticos para ambos os cenários."
    },
    {
      question: "Posso fazer pelo celular?",
      answer: "Sim! Nossa plataforma é totalmente responsiva e otimizada para dispositivos móveis. Você pode assistir as aulas e acessar todo o conteúdo pelo seu smartphone ou tablet."
    }
  ];

  return (
    <section className="w-full py-16 bg-gray-50 dark:bg-gray-950 relative overflow-hidden" ref={sectionRef}>
      {/* Orbes flutuantes */}
      <FloatingOrbs sectionId="faq" />

      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
        {/* Header with badge and line */}
        <div className="flex items-center gap-4 mb-8 sm:mb-16 w-full">
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-300 border border-violet-200 dark:border-violet-700">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-violet-500 text-white mr-2">?</span>
              <span>FAQ</span>
            </div>
          </div>
          <div className="flex-1 h-[1px] bg-violet-300 dark:bg-violet-700"></div>
        </div>

        {/* Main content */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display leading-tight mb-4">
              Confira as perguntas
            </h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
              mais frequentes:
            </h3>
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
                    <span className="text-lg font-medium text-gray-900 dark:text-white">
                      {item.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <p className="text-gray-600 dark:text-gray-400">
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