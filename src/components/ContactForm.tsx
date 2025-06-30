import React from 'react';
import { Input } from './ui/input';
import { useContactForm } from '../hooks/useContactForm';
import { useTranslation } from 'react-i18next';
import styles from './Contact.module.css';

interface ContactFormProps {
  className?: string;
}

const ContactForm = React.memo<ContactFormProps>(({ className = '' }) => {
  const { t } = useTranslation();
  const {
    formData,
    errors,
    isSubmitting,
    formFields,
    updateField,
    handleSubmit
  } = useContactForm();

  return (
    <form onSubmit={handleSubmit} className={`${styles.form} ${className}`}>
      <div className={styles.formFields}>
        {formFields.map((field) => (
          <div key={field.name} className={styles.inputWrapper}>
            <Input
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={(e) => updateField(field.name, e.target.value)}
              className={`${styles.input} ${errors[field.name] ? styles.inputError : ''}`}
              required={field.required}
              disabled={isSubmitting}
              aria-label={field.placeholder}
              aria-invalid={!!errors[field.name]}
              aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
            />
            {errors[field.name] && (
              <div 
                id={`${field.name}-error`}
                className={styles.errorMessage}
                role="alert"
                aria-live="polite"
              >
                {errors[field.name]}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`${styles.submitButton} ${styles.shimmerEffect}`}
        aria-label={isSubmitting ? t('contact.form.submitting') : t('contact.form.submit')}
      >
        <span className={styles.buttonContent}>
          {isSubmitting && <div className={styles.loadingSpinner} />}
          {isSubmitting ? t('contact.form.submitting') : t('contact.form.submit')}
        </span>
        
        {/* Efeito de partículas */}
        <div className={styles.particleEffects}>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
        </div>
      </button>
    </form>
  );
});

ContactForm.displayName = 'ContactForm';

export default ContactForm; 