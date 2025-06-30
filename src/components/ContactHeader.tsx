import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Contact.module.css';

interface ContactHeaderProps {
  className?: string;
}

const ContactHeader = React.memo<ContactHeaderProps>(({ className = '' }) => {
  const { t } = useTranslation();

  return (
    <div className={className}>
      {/* Badge e divisor */}
      <div className={styles.header}>
        <div className={styles.badge}>
          <span className={styles.badgeIcon}>✉</span>
          <span>{t('contact.badge')}</span>
        </div>
        <div className={styles.divider}></div>
      </div>

      {/* Títulos */}
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>
          {t('contact.title')}
        </h2>
        <h3 className={styles.gradientTitle}>
          <span className={styles.gradientText}>
            {t('contact.titleGradient')}
          </span>
        </h3>
        <p className={styles.description}>
          {t('contact.description')}
        </p>
      </div>
    </div>
  );
});

ContactHeader.displayName = 'ContactHeader';

export default ContactHeader; 