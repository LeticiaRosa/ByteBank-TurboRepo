# ByteBank - Microfrontend Menu/Dashboard

Este é o microfrontend principal do ByteBank, responsável pelo dashboard, gestão de transações e interface principal do sistema bancário digital.

## 🎯 Sobre este MFE

O **mfe-menu** é o microfrontend central da aplicação ByteBank que contém:

- **Dashboard Principal**: Visão geral financeira com gráficos e KPIs
- **Gestão de Transações**: Criação, edição e visualização de transações
- **Extrato Bancário**: Histórico completo com filtros avançados
- **Interface Principal**: Layout responsivo e componentes de navegação
- **Análises Financeiras**: Relatórios e visualizações de dados

## 🚀 Como Executar

### Desenvolvimento

Para executar este microfrontend em modo desenvolvimento:

```bash
# Instalar dependências (na raiz do monorepo)
pnpm install

# Executar apenas este MFE
pnpm dev --filter=apps/mfe-menu

# Ou executar todos os MFEs simultaneamente
pnpm dev
```

A aplicação estará disponível em: **http://localhost:3002**

### Produção

Para build de produção:

```bash
pnpm build --filter=apps/mfe-menu
```

## 🏗️ Arquitetura e Tecnologias

### Tecnologias Principais

- **React 18** + **TypeScript** - Interface moderna e tipada
- **Vite** - Build tool super rápido
- **TanStack Router** - Roteamento file-based
- **TanStack Query** - Gerenciamento de estado servidor
- **Module Federation** - Integração entre microfrontends
- **TailwindCSS** - Estilização utilitária
- **Recharts** - Gráficos e visualizações

### Module Federation

Este MFE expõe e consome componentes via Module Federation:

```typescript
// Expõe componentes para outros MFEs
exposes: {
  "./Dashboard": "./src/components/Dashboard",
  "./TransactionForm": "./src/components/TransactionForm"
}

// Consome do MFE de autenticação
remotes: {
  "mfe-auth": "http://localhost:3001/remoteEntry.js"
}
```

## 📊 Funcionalidades Principais

### 🏠 Dashboard Principal

- **Cartões de Resumo**: Saldo atual, receitas e despesas mensais
- **Gráficos Interativos**:
  - Evolução do saldo ao longo do tempo
  - Distribuição de gastos por categoria
  - Comparativos mensais
- **KPIs Financeiros**: Métricas importantes em tempo real

### 💰 Gestão de Transações

- **Formulário Inteligente**:
  - Validação avançada com React Hook Form
  - Categorização automática
  - Upload de comprovantes (JPG, PNG, PDF)
  - Cálculo automático de saldo

### 📋 Extrato Bancário

- **Filtros Avançados**:
  - Por período (data inicial e final)
  - Por categoria de transação
  - Por tipo (receita/despesa)
  - Por valor (intervalo)
- **Funcionalidades**:
  - Busca textual por descrição
  - Paginação inteligente
  - Export para CSV
  - Estatísticas do período

### 🎨 Interface e UX

- **Layout Responsivo**: Adaptável para desktop, tablet e mobile
- **Dark/Light Mode**: Alternância de tema
- **Design System**: Componentes do `@bytebank/ui`
- **Navegação Intuitiva**: Sidebar colapsível e breadcrumbs

## 🗂️ Estrutura de Rotas

O roteamento é baseado em arquivos usando TanStack Router:

```
src/routes/
├── __root.tsx          # Layout principal
├── index.tsx           # Dashboard (/)
├── transactions/
│   ├── index.tsx       # Lista de transações
│   └── create.tsx      # Criar transação
└── extracts/
    └── index.tsx       # Extrato bancário
```

## 🛠️ Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento com hot reload
pnpm dev

# Build para produção
pnpm build

# Preview do build
pnpm preview

# Linting e formatação
pnpm lint
pnpm format
pnpm check
```

### Gerenciamento de Estado

O MFE utiliza múltiplas estratégias de gerenciamento de estado:

- **TanStack Query**: Cache e sincronização de dados do servidor
- **React Hook Form**: Estado de formulários
- **Context API**: Estado de autenticação (compartilhado via Module Federation)
- **Local Storage**: Persistência de preferências do usuário

### Integração com Backend

Conecta-se ao Supabase para:

```typescript
// Exemplo de query de transações
const { data: transactions } = useQuery({
  queryKey: ['transactions', filters],
  queryFn: () =>
    supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false }),
})
```

## 🔗 Integração com Outros MFEs

### Module Federation Config

```typescript
// vite.config.ts
federation({
  name: 'mfe-menu',
  exposes: {
    './Dashboard': './src/components/Dashboard',
    './TransactionList': './src/components/TransactionList',
  },
  remotes: {
    'mfe-auth': 'http://localhost:3001/remoteEntry.js',
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
    '@tanstack/react-query': { singleton: true },
  },
})
```

### Dependências Compartilhadas

- **@bytebank/ui**: Design System compartilhado
- **@bytebank/env**: Configurações de ambiente
- **React Query**: Estado global de cache
- **Supabase Client**: Cliente de dados unificado

## 🎯 Próximos Passos

Para contribuir com este MFE:

1. **Instale as dependências**: `pnpm install` (na raiz do monorepo)
2. **Execute em desenvolvimento**: `pnpm dev`
3. **Acesse**: http://localhost:3002
4. **Desenvolva**: Os componentes estão em `src/components/`
5. **Teste**: Navegue entre as rotas para testar as funcionalidades

## 📚 Documentação Relacionada

- [TanStack Router](https://tanstack.com/router) - Roteamento
- [TanStack Query](https://tanstack.com/query) - Gerenciamento de estado
- [Module Federation](https://module-federation.io/) - Microfrontends
- [Supabase](https://supabase.com/docs) - Backend as a Service
- [Recharts](https://recharts.org/) - Biblioteca de gráficos

---

**Este MFE é parte do ecossistema ByteBank - Sistema de Banking Digital**
