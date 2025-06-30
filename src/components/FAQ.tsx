import React, { useRef, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";

const FAQ = () => {
  const { t } = useTranslation();
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

  const faqItems = t('faq.questions', { returnObjects: true }) as Array<{question: string, answer: string}>;

  return (
        <section className="w-full py-16 relative overflow-hidden" id="faq" ref={sectionRef}>

      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
        {/* Header with badge and line */}
        <div className="flex items-center gap-4 mb-8 sm:mb-16 w-full">
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-violet-900/50 text-violet-300 border border-violet-700/50 backdrop-blur-sm">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-violet-500 text-white mr-2 font-sans">?</span>
              <span className="font-sans">{t('faq.badge')}</span>
            </div>
          </div>
                      <div className="flex-1 h-[1px] bg-violet-700/60"></div>
        </div>

        {/* Main content */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display leading-tight mb-4">
              {t('faq.title')}
            </h2>
            <h3 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
              style={{
                backgroundSize: '200% 200%',
                animation: 'gradientFlow 3s ease-in-out infinite'
              }}
            >
              {t('faq.titleGradient')}
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
                  className="bg-gray-900 rounded-lg shadow-sm border border-gray-800"
                >
                  <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                                          <span className="text-lg font-medium text-white font-sans">
                      {item.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                                          <p className="text-gray-400 font-sans">
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