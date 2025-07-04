import { useState, useCallback, useMemo } from 'react';
import { useToast } from '../components/ui/use-toast';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/utils';

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
}

interface FormField {
  type: string;
  placeholder: string;
  required: boolean;
  name: keyof FormData;
}

export const useContactForm = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Campos do formulário memoizados
  const formFields = useMemo<FormField[]>(() => [
    { type: "text", placeholder: t('contact.form.name'), required: true, name: 'name' },
    { type: "email", placeholder: t('contact.form.email'), required: true, name: 'email' },
    { type: "tel", placeholder: t('contact.form.phone'), required: true, name: 'phone' },
    { type: "text", placeholder: t('contact.form.company'), required: false, name: 'company' }
  ], [t]);

  // Validação de email otimizada
  const isValidEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  // Validação de telefone otimizada
  const isValidPhone = useCallback((phone: string): boolean => {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }, []);

  // Validação individual de campo
  const validateField = useCallback((name: keyof FormData, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return t('contact.validation.nameRequired');
        if (value.trim().length < 2) return t('contact.validation.nameMinLength');
        break;
      case 'email':
        if (!value.trim()) return t('contact.validation.emailRequired');
        if (!isValidEmail(value)) return t('contact.validation.emailInvalid');
        break;
      case 'phone':
        if (!value.trim()) return t('contact.validation.phoneRequired');
        if (!isValidPhone(value)) return t('contact.validation.phoneInvalid');
        break;
      case 'company':
        // Empresa é opcional, não precisa validação
        break;
      default:
        break;
    }
    return undefined;
  }, [t, isValidEmail, isValidPhone]);

  // Atualizar campo do formulário
  const updateField = useCallback((name: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  // Validar formulário completo
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.entries(formData).forEach(([key, value]) => {
      const fieldName = key as keyof FormData;
      const error = validateField(fieldName, value);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [formData, validateField]);

  // Submeter formulário
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      if (!validateForm()) {
        toast({
          title: t('contact.toast.errorTitle'),
          description: t('contact.toast.errorDescription'),
          variant: 'destructive'
        });
        return;
      }

      // Envio para o Supabase
      const { error } = await supabase
        .from('contact_forms')
        .insert([
          { ...formData }
        ]);

      if (error) {
        throw error;
      }

      toast({
        title: t('contact.toast.title'),
        description: t('contact.toast.description'),
      });

      // Resetar formulário após sucesso
      setFormData({ name: '', email: '', phone: '', company: '' });
      setErrors({});

    } catch (error) {
      toast({
        title: t('contact.toast.errorTitle'),
        description: t('contact.toast.errorDescription'),
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, isSubmitting, validateForm, toast, t]);

  return {
    formData,
    errors,
    isSubmitting,
    formFields,
    updateField,
    handleSubmit,
    validateField
  };
}; 