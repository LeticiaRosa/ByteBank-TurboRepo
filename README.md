# ByteBank - Sistema de Gerenciamento Financeiro
Este projeto é o resultado do Tech Challenge da Fase 02 da pós-graduação em Front-End Engineer. Aprimorar e escalar a aplicação de gerenciamento financeiro existente, utilizando uma arquitetura de microfrontends e garantindo a integração e deploy eficientes em ambientes cloud. A aplicação deve incluir novas funcionalidades e melhorias de performance, segurança e experiência do usuário. 

## 🏆 Visão Geral

O ByteBank é uma plataforma de banking digital que utiliza tecnologias de ponta para fornecer:

- **Dashboard Inteligente**: Visualizações financeiras em tempo real com gráficos e KPIs
- **Gestão de Transações**: Sistema completo de receitas, despesas e transferências
- **Análise Financeira**: Relatórios detalhados com categorização automática
- **Segurança Avançada**: Autenticação robusta e políticas de segurança RLS
- **Upload de Comprovantes**: Sistema de anexos para transações
- **Experiência Responsiva**: Interface adaptável para todos os dispositivos

## 🚀 Demo Live

- **Aplicação de Autenticação**: [https://appbytebank-auth.netlify.app](https://appbytebank-auth.netlify.app)
- **Dashboard Principal**: Integrado via Module Federation

## 🏗️ Arquitetura Microfrontend

### Estrutura Modular

```
bytebank/
├── apps/
│   ├── mfe-auth/           # Microfrontend de Autenticação
│   └── mfe-menu/           # Microfrontend do Dashboard
├── packages/
│   ├── ui/                 # Design System compartilhado
│   ├── env/                # Configuração de variáveis
│   ├── eslint-config/      # Configuração ESLint
│   └── typescript-config/  # Configuração TypeScript
```

### Tecnologias Principais

- **Frontend**: React 18 + TypeScript + Vite
- **Microfrontends**: Module Federation (Webpack)
- **Styling**: TailwindCSS + shadcn/ui
- **State Management**: TanStack Query + React Hook Form
- **Routing**: TanStack Router
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Containerização**: Docker + Docker Compose
- **Deploy**: Netlify

## 📊 Funcionalidades Principais

### 🏠 Home Page - Dashboard Inteligente

- **Cartões de Resumo**: Saldo principal, receitas e gastos mensais
- **Gráficos Avançados**:
  - Evolução do saldo ao longo do tempo
  - Distribuição de gastos por categoria
  - Análise comparativa mensal
- **Visualizações Interativas**:
  - Charts responsivos com tooltips
  - Dark/Light Mode
  

### 💳 Gestão de Transações

- **Criação Inteligente**:
  - Formulário com validação avançada
  - Sugestões automáticas de categorias
  - Cálculo automático de saldo
  - Validação dos dados inseridos
- **Upload de Comprovantes**:
  - Suporte a JPG, PNG, PDF (máx. 5MB)
  - Drag & drop interface
  - Armazenamento seguro no Supabase Storage

### 📈 Extrato

- **Extrato Detalhado**:
  - Filtros avançados (período, categoria, tipo, valor)
  - Estatísticas do período selecionado
  - Export de dados através de CSV
- **Listagem Avançada**:
  - Filtros dinâmicos (data, categoria, valor, status)
  - Busca textual por descrição e remetente
  - Paginação 

## 🛠️ Instalação e Desenvolvimento

### Pré-requisitos

- Node.js 20+
- pnpm (recomendado)
- Docker (opcional, para containerização)
- Conta no Supabase 

### Configuração Rápida

1. **Clone o repositório**

```bash
git clone https://github.com/LeticiaRosa/ByteBank-TurboRepo.git
cd ByteBank-TurboRepo/bytebank
```

2. **Configure as variáveis de ambiente**

```bash
cp .env.example .env
# Edite o .env com suas credenciais do Supabase
```

3. **Instale as dependências**

```bash
pnpm install
```

4. **Execute em desenvolvimento**

```bash
# Todos os microfrontends
pnpm dev
```

### Desenvolvimento com Docker

Para um ambiente isolado e consistente:

```bash
# Construir e executar
docker compose up --build

# Em background
docker compose up -d --build

# Parar containers
docker compose down
```

**Acesso**:

- Auth MFE: http://localhost:3001
- Menu MFE: http://localhost:3002

## 🎨 Design System

### Componentes Reutilizáveis (packages/ui)

- **Formulários**: Input, Button, Select, DatePicker, FileUpload
- **Layout**: Card, Sidebar, Header, Navigation
- **Feedback**: Toast, Skeleton, Loading States
- **Data Display**: Charts, Tables, Pagination
- **Overlays**: Modal, Sheet, Dropdown

### Padrão de Cores e Acessibilidade

- **Modo Escuro/Claro**: Suporte completo com CSS variables
- **Contraste**: Segue WCAG 2.1 AA
- **Navegação por Teclado**: Componentes totalmente acessíveis
- **Screen Readers**: Labels e ARIA adequados

## 🧪 Testes e Qualidade

### Ferramentas de Qualidade

```bash

# Linting
pnpm lint
pnpm lint:fix

# Formatação
pnpm format

# Type checking
pnpm type-check

# Build de produção
pnpm build
```


## 🚀 Deploy e Produção

### Deploy Automatizado

O projeto está configurado para deploy em plataformas cloud:

- **Frontend**: Netlify/Vercel
- **Backend**: Supabase Cloud
- **Assets**: CDN otimizado
- **Monitoring**: Built-in analytics

### Configuração de Produção

```bash
# Build otimizado
pnpm build

# Preview local
pnpm preview

# Deploy (configure CI/CD)
# Automatizado via GitHub Actions
```

### Variáveis de Ambiente de Produção

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Microfrontends URLs
VITE_AUTH_MFE_URL=https://your-auth-app.netlify.app
VITE_MENU_MFE_URL=https://your-menu-app.netlify.app

# App Config
VITE_APP_NAME=ByteBank
VITE_APP_VERSION=1.0.0
```

## 🔧 Arquitetura Técnica

### Module Federation

```typescript
// mfe-auth/vite.config.ts
federation({
  name: "mfe-auth",
  exposes: {
    "./useAuth": "./src/hooks/useAuth.ts",
  },
  remotes: {
    dashboard: "http://localhost:3002/remoteEntry.js",
  },
  shared: {
    react: { singleton: true },
    "react-dom": { singleton: true },
    "@tanstack/react-query": { singleton: true },
  },
});
```

### Estado Global

- **React Query**: Cache inteligente e sincronização
- **Context API**: Estado de autenticação
- **Local Storage**: Persistência de preferências

### Performance

- **Code Splitting**: Lazy loading automático
- **Bundle Optimization**: Tree shaking + minificação
- **Image Optimization**: Lazy loading + WebP


## 🤝 Contribuição

### Como Contribuir

1. Fork o projeto
2. Crie uma feature branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Padrões de Código

- **TypeScript**: Tipagem estrita obrigatória
- **ESLint + Prettier**: Formatação automática
- **Conventional Commits**: Padrão de mensagens

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- **TanStack**: Por ferramentas incríveis de React
- **Supabase**: Backend-as-a-Service poderoso
- **shadcn/ui**: Design System elegante
- **Vite**: Build tool super rápido
- **Module Federation**: Arquitetura microfrontend

---

**Desenvolvido com ❤️ para revolucionar a experiência bancária digital**
