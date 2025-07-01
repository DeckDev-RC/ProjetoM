import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Verificar se as variáveis estão configuradas (sem quebrar a aplicação)
const isSupabaseConfigured = 
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  !import.meta.env.VITE_SUPABASE_URL.includes('placeholder') &&
  !import.meta.env.VITE_SUPABASE_ANON_KEY.includes('placeholder');

if (!isSupabaseConfigured) {
  console.warn(
    '⚠️ Supabase não configurado. ' +
    'Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env'
  );
}

// Criar cliente do Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false // Para formulário de contato não precisamos de sessão
  }
});

// Tipos para o formulário de contato
export interface ContactFormData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  created_at?: string;
  updated_at?: string;
}

// Função para inserir dados de contato
export const insertContactForm = async (data: Omit<ContactFormData, 'id' | 'created_at' | 'updated_at'>) => {
  // Se Supabase não estiver configurado, simular sucesso
  if (!isSupabaseConfigured) {
    console.warn('⚠️ Supabase não configurado. Simulando envio do formulário...');
    return {
      id: 'temp-' + Date.now(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      created_at: new Date().toISOString()
    };
  }

  try {
    const { data: result, error } = await supabase
      .from('contact_forms')
      .insert([
        {
          name: data.name.trim(),
          email: data.email.trim().toLowerCase(),
          phone: data.phone.trim(),
          company: data.company?.trim() || null,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Erro ao inserir dados no Supabase:', error);
      throw new Error(`Erro no banco de dados: ${error.message}`);
    }

    return result;
  } catch (error) {
    console.error('Erro na operação do Supabase:', error);
    throw error;
  }
};

// Função para verificar conexão com Supabase
export const testSupabaseConnection = async () => {
  // Se Supabase não estiver configurado, retornar false
  if (!isSupabaseConfigured) {
    console.warn('⚠️ Supabase não configurado. Configure as variáveis de ambiente primeiro.');
    return false;
  }

  try {
    const { data, error } = await supabase
      .from('contact_forms')
      .select('count', { count: 'exact', head: true });

    if (error) {
      console.error('Erro ao testar conexão:', error);
      return false;
    }

    console.log('Conexão com Supabase estabelecida com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao conectar com Supabase:', error);
    return false;
  }
}; 