import React, { startTransition } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import ContactHeader from './ContactHeader';
import ContactForm from './ContactForm';
import styles from './Contact.module.css';

// Comparação customizada para React.memo - otimização avançada
const arePropsEqual = () => true; // Componente não recebe props que mudam

const Contact = React.memo(() => {
  // Hook otimizado para intersection observer
  const { elementRef, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px',
    triggerOnce: true
  });

  // Usar startTransition para updates não urgentes
  const [shouldRender, setShouldRender] = React.useState(false);

  React.useEffect(() => {
    if (isVisible) {
      startTransition(() => {
        setShouldRender(true);
      });
    }
  }, [isVisible]);

  return (
    <section 
      className={styles.contactSection}
      id="contact" 
      ref={elementRef}
      aria-labelledby="contact-title"
    >
      <div className={styles.container}>
        <div className={styles.maxWidth}>
          <div className={`${styles.fadeInUp} ${isVisible ? styles.visible : ''}`}>
            {/* Card principal com backdrop blur */}
            <div className={styles.contactCard}>
              {/* Gradiente de fundo */}
              <div className={styles.cardBackground} aria-hidden="true"></div>
              
              {/* Conteúdo do card */}
              <div className={styles.cardContent}>
                {/* Header - renderização condicional para performance */}
                {shouldRender && (
                  <ContactHeader />
                )}

                {/* Formulário - renderização condicional para performance */}
                {shouldRender && (
                  <ContactForm />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}, arePropsEqual);

Contact.displayName = 'Contact';

export default Contact; 