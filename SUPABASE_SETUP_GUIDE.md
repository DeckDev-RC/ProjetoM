# Guia de Configuração - Integração Supabase

## Visão Geral
Este guia explica como configurar a integração do formulário de contato com o Supabase rodando em sua VPS.

## Pré-requisitos
- Supabase instalado e rodando em sua VPS
- Acesso ao painel administrativo do Supabase
- URL e chave de API do seu projeto Supabase

## 1. Configuração da Tabela no Supabase

### Criar a Tabela `contact_forms`

Execute o seguinte SQL no SQL Editor do seu Supabase:

```sql
-- Criar tabela para formulários de contato
CREATE TABLE contact_forms (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  phone varchar(50) NOT NULL,
  company varchar(255),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criar índices para melhor performance
CREATE INDEX idx_contact_forms_email ON contact_forms(email);
CREATE INDEX idx_contact_forms_created_at ON contact_forms(created_at);

-- Habilitar RLS (Row Level Security)
ALTER TABLE contact_forms ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção de novos contatos (público)
CREATE POLICY "Permitir inserção de contatos" ON contact_forms
  FOR INSERT
  WITH CHECK (true);

-- Política para leitura (apenas para usuários autenticados/admin)
CREATE POLICY "Permitir leitura para admin" ON contact_forms
  FOR SELECT
  USING (auth.role() = 'authenticated');
```

### Configurar Trigger para updated_at (opcional)

```sql
-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
CREATE TRIGGER update_contact_forms_updated_at
    BEFORE UPDATE ON contact_forms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## 2. Configuração das Variáveis de Ambiente

### Criar arquivo `.env`

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Configuração do Supabase
VITE_SUPABASE_URL=https://seu-dominio-vps.com:8000
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

### Obter as Credenciais

1. **URL do Supabase**: 
   - Se usando Supabase Cloud: `https://seu-projeto.supabase.co`
   - Se usando VPS própria: `https://seu-dominio.com:porta`

2. **Chave Anônima (anon key)**:
   - Acesse Settings → API no painel do Supabase
   - Copie a chave `anon/public`

## 3. Configuração de Segurança

### RLS (Row Level Security)
A tabela já está configurada com RLS habilitado:
- **Inserção**: Permitida para qualquer pessoa (formulário público)
- **Leitura**: Apenas para usuários autenticados (admin)

### CORS (se necessário)
Se estiver rodando em VPS própria, configure o CORS no Supabase:

```json
{
  "allowed_origins": [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://seu-dominio-frontend.com"
  ]
}
```

## 4. Testando a Integração

### Verificar Conexão
O sistema inclui uma função de teste de conexão. Para usá-la:

```typescript
import { testSupabaseConnection } from './src/lib/supabase';

// Testar conexão
testSupabaseConnection().then(success => {
  console.log('Conexão:', success ? 'OK' : 'FALHOU');
});
```

### Testar Inserção Manual
```typescript
import { insertContactForm } from './src/lib/supabase';

// Teste manual
insertContactForm({
  name: 'Teste',
  email: 'teste@exemplo.com',
  phone: '11999999999',
  company: 'Empresa Teste'
}).then(result => {
  console.log('Resultado:', result);
}).catch(error => {
  console.error('Erro:', error);
});
```

## 5. Monitoramento e Logs

### Logs no Console
O sistema registra logs detalhados:
- Sucessos de inserção
- Erros de conexão
- Problemas de validação

### Verificar Dados no Supabase
1. Acesse o painel do Supabase
2. Vá para Table Editor
3. Selecione a tabela `contact_forms`
4. Visualize os dados inseridos

## 6. Estrutura dos Dados

### Campos da Tabela
```typescript
interface ContactFormData {
  id?: string;              // UUID gerado automaticamente
  name: string;             // Nome (obrigatório)
  email: string;            // Email (obrigatório)
  phone: string;            // Telefone (obrigatório)
  company?: string;         // Empresa (opcional)
  created_at?: string;      // Data de criação (automática)
  updated_at?: string;      // Data de atualização (automática)
}
```

### Validações Aplicadas
- **Nome**: Mínimo 2 caracteres
- **Email**: Formato válido de email
- **Telefone**: Mínimo 10 dígitos
- **Empresa**: Campo opcional

## 7. Solução de Problemas

### Erro: "Variáveis de ambiente não configuradas"
- Verifique se o arquivo `.env` existe
- Confirme se as variáveis começam com `VITE_`
- Reinicie o servidor de desenvolvimento

### Erro: "Erro no banco de dados"
- Verifique se a tabela `contact_forms` existe
- Confirme se as políticas RLS estão configuradas
- Teste a conexão com o Supabase

### Erro: "CORS"
- Configure os domínios permitidos no Supabase
- Verifique se a URL está correta

### Erro: "Unauthorized"
- Verifique a chave anônima (anon key)
- Confirme se as políticas RLS permitem inserção

## 8. Próximos Passos (Opcional)

### Notificações por Email
Configure webhooks ou triggers para enviar emails quando novos contatos chegarem.

### Dashboard Administrativo
Crie uma interface para visualizar e gerenciar os contatos recebidos.

### Integração com CRM
Configure integrações automáticas com sistemas de CRM.

## Suporte
Para dúvidas sobre esta integração, consulte:
- [Documentação oficial do Supabase](https://supabase.com/docs)
- [Guia de JavaScript Client](https://supabase.com/docs/reference/javascript)

---

**Importante**: Mantenha suas chaves de API seguras e nunca as compartilhe em repositórios públicos. 