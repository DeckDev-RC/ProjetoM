# 🧪 Guia de Testes Unitários - Projeto M

## 📋 Visão Geral

Este projeto implementa testes unitários usando **Vitest** e **React Testing Library** para garantir a qualidade e confiabilidade dos componentes React.

## 🛠️ Configuração de Testes

### Dependências Instaladas
```json
{
  "@testing-library/jest-dom": "^6.4.2",
  "@testing-library/react": "^14.2.1", 
  "@testing-library/user-event": "^14.5.2",
  "@vitest/coverage-v8": "^1.3.1",
  "@vitest/ui": "^1.3.1",
  "jsdom": "^24.0.0",
  "vitest": "^1.3.1"
}
```

### Scripts Disponíveis
```bash
npm run test          # Executa testes em modo watch
npm run test:run      # Executa testes uma vez
npm run test:ui       # Interface visual dos testes
npm run test:coverage # Relatório de cobertura
npm run test:watch    # Modo watch explícito
```

## 📁 Estrutura de Testes

```
src/
├── components/
│   └── __tests__/
│       ├── Navbar.test.tsx
│       └── Hero.test.tsx
├── lib/
│   └── __tests__/
│       └── utils.test.ts
├── test/
│   └── setup.ts
└── vitest.config.ts
```

## ✅ Testes Implementados

### 1. **Navbar Component** (`src/components/__tests__/Navbar.test.tsx`)

**Funcionalidades Testadas:**
- ✅ Renderização da logo
- ✅ Scroll para o topo ao clicar na logo
- ✅ Efeito de scroll no header
- ✅ Classes CSS corretas do logo
- ⚠️ Links de navegação (necessita ajuste para elementos duplicados)
- ⚠️ Estilo de navegação (necessita ajuste para margin-left)

**Exemplo de Teste:**
```typescript
it('should render the logo', () => {
  renderWithRouter(<Navbar />)
  
  const logo = screen.getByAltText('Mind AI Logo')
  expect(logo).toBeInTheDocument()
  expect(logo).toHaveAttribute('src', '/logo.svg')
})
```

### 2. **Hero Component** (`src/components/__tests__/Hero.test.tsx`)

**Funcionalidades Testadas:**
- ✅ Renderização do título principal
- ✅ Renderização da descrição
- ✅ Renderização do botão CTA
- ✅ Renderização do badge de apresentação
- ✅ Renderização do componente de vídeo
- ✅ Animação de texto gradiente
- ⚠️ Estrutura de styling (necessita ajuste para role="region")
- ⚠️ Vídeo de background (necessita ajuste para seletor)
- ⚠️ Estrutura do card (necessita ajuste para classes)

**Exemplo de Teste:**
```typescript
it('should render the main heading', () => {
  renderWithRouter(<Hero />)
  
  expect(screen.getByText('Automatize tudo')).toBeInTheDocument()
  expect(screen.getByText('Expanda sem limites')).toBeInTheDocument()
})
```

### 3. **Utils Library** (`src/lib/__tests__/utils.test.ts`)

**Funcionalidades Testadas:**
- ✅ Combinação de classes CSS
- ✅ Classes condicionais
- ✅ Valores undefined e null
- ✅ Strings vazias
- ✅ Arrays de classes
- ✅ Objetos com valores booleanos
- ✅ Combinações complexas
- ✅ Sem argumentos
- ✅ Classes do Tailwind CSS

**Exemplo de Teste:**
```typescript
it('should handle conditional classes', () => {
  const result = cn('base', true && 'conditional', false && 'hidden')
  expect(result).toBe('base conditional')
})
```

## 🎯 Resultados dos Testes

### Status Atual
- **Total de Testes**: 33
- **Testes Passando**: 22 ✅
- **Testes Falhando**: 11 ⚠️
- **Arquivos de Teste**: 3 funcionais

### Cobertura de Código
- **Componentes**: Navbar, Hero
- **Utilitários**: Função `cn` (utils)
- **Hooks**: Preparado para implementação

## 🔧 Configuração Técnica

### Vitest Config (`vitest.config.ts`)
```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        'src/main.tsx',
        'src/vite-env.d.ts'
      ]
    }
  }
})
```

### Setup de Testes (`src/test/setup.ts`)
- ✅ Mock do IntersectionObserver
- ✅ Mock do ResizeObserver
- ✅ Mock do matchMedia
- ✅ Mock do localStorage/sessionStorage
- ✅ Mock do scrollTo
- ✅ Mock do requestAnimationFrame

## 🚀 Executando os Testes

### Comando Básico
```bash
npm run test:run
```

### Com Interface Visual
```bash
npm run test:ui
```

### Com Cobertura
```bash
npm run test:coverage
```

## 📊 Métricas de Qualidade

### Benefícios Implementados
- ✅ **Detecção Precoce de Bugs**: Testes capturam problemas antes da produção
- ✅ **Refatoração Segura**: Mudanças podem ser feitas com confiança
- ✅ **Documentação Viva**: Testes servem como documentação do comportamento
- ✅ **Qualidade do Código**: Força boas práticas de desenvolvimento
- ✅ **Integração Contínua**: Base para CI/CD

### Próximos Passos
1. **Corrigir Testes Falhando**: Ajustar seletores e expectations
2. **Adicionar Testes de Hooks**: useCookieConsent, useResponsiveUtils
3. **Testes de Integração**: Componentes trabalhando juntos
4. **Testes E2E**: Fluxos completos do usuário
5. **Performance Testing**: Métricas de renderização

## 🔍 Debugging de Testes

### Problemas Comuns
1. **Elementos Duplicados**: Usar `getAllBy*` em vez de `getBy*`
2. **Role não encontrado**: Usar `data-testid` ou seletores CSS
3. **Async Operations**: Usar `waitFor` ou `findBy*`
4. **Mocks não funcionando**: Verificar ordem de imports

### Ferramentas de Debug
```typescript
// Ver estrutura do DOM
screen.debug()

// Listar roles disponíveis
screen.logTestingPlaygroundURL()
```

## 📈 Conclusão

O sistema de testes unitários está **funcionando e operacional** com:
- ✅ 22 testes passando
- ✅ Configuração completa do Vitest
- ✅ Mocks apropriados
- ✅ Cobertura de componentes principais
- ✅ Base sólida para expansão

Os testes proporcionam **confiança** no código e facilitam a **manutenção** e **evolução** do projeto. 