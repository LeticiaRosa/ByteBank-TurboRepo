# ByteBank - Microfrontend de Autenticação

Este é o microfrontend de autenticação do ByteBank, responsável por toda a gestão de usuários, login, registro e segurança da aplicação bancária digital.

## 🎯 Sobre este MFE

O **mfe-auth** é o microfrontend dedicado à autenticação e gestão de usuários que contém:

- **Sistema de Login**: Autenticação segura com Supabase Auth
- **Registro de Usuários**: Criação de novas contas com validação
- **Gestão de Perfil**: Edição de dados pessoais e preferências
- **Segurança**: Integração com políticas RLS (Row Level Security)
- **Hooks de Autenticação**: Estado global compartilhado via Module Federation

## 🚀 Como Executar

### Desenvolvimento

Para executar este microfrontend em modo desenvolvimento:

```bash
# Instalar dependências (na raiz do monorepo)
pnpm install

# Executar apenas este MFE
pnpm dev --filter=apps/mfe-auth

# Ou executar todos os MFEs simultaneamente
pnpm dev
```

A aplicação estará disponível em: **http://localhost:3001**

### Produção

Para build de produção:

```bash
pnpm build --filter=apps/mfe-auth
```

## 🏗️ Arquitetura e Tecnologias

### Tecnologias Principais

- **React 18** + **TypeScript** - Interface moderna e tipada
- **Vite** - Build tool super rápido
- **TanStack Router** - Roteamento file-based
- **TanStack Query** - Gerenciamento de estado servidor
- **React Hook Form** - Gestão de formulários
- **Supabase Auth** - Autenticação e autorização
- **Module Federation** - Compartilhamento entre microfrontends
- **TailwindCSS** - Estilização utilitária
- **Zod** - Validação de schemas TypeScript

### Module Federation

Este MFE expõe hooks e componentes de autenticação para outros MFEs:

```typescript
// Expõe para outros MFEs
exposes: {
  "./useAuth": "./src/hooks/useAuth.ts",
  "./AuthGuard": "./src/components/AuthGuard.tsx",
  "./UserProfile": "./src/components/UserProfile.tsx"
}

// Consome do MFE principal quando necessário
remotes: {
  "mfe-menu": "http://localhost:3002/remoteEntry.js"
}
```

## 🔐 Funcionalidades de Autenticação

### 🚪 Sistema de Login

- **Login Seguro**:
  - Validação de email e senha
  - Feedback visual de erros
  - Redirecionamento automático pós-login
  - Lembrança de sessão

### 📝 Registro de Usuários

- **Cadastro Completo**:
  - Validação de email único
  - Política de senhas seguras
  - Confirmação por email
  - Criação automática de perfil bancário

### 👤 Gestão de Perfil

- **Edição de Dados**:
  - Informações pessoais (nome, email, telefone)
  - Upload de foto de perfil
  - Configurações de preferências
  - Alteração de senha

### 🛡️ Segurança e Autorização

- **Proteção de Rotas**:
  - AuthGuard para rotas protegidas
  - Redirecionamento automático
  - Verificação de token JWT
  - Políticas RLS no Supabase

## 🗂️ Estrutura de Rotas

O roteamento é baseado em arquivos usando TanStack Router:

```
src/routes/
├── __root.tsx          # Layout de autenticação
├── index.tsx           # Login principal (/)
├── register.tsx        # Registro de usuário
├── profile.tsx         # Perfil do usuário
└── app2/               # Exemplo de integração
    └── index.tsx       # Rota protegida
```

## 🔧 Hooks Personalizados

### useAuth Hook

O hook principal de autenticação que é compartilhado via Module Federation:

```typescript
// Exemplo de uso
const { user, loading, signIn, signUp, signOut } = useAuth()

// Estados disponíveis
interface AuthState {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, userData: any) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: any) => Promise<void>
}
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

### Configuração de Ambiente

Este MFE utiliza variáveis de ambiente seguras via `@bytebank/env`:

```typescript
// src/env.mjs (exemplo)
import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  clientPrefix: 'VITE_',
  client: {
    VITE_SUPABASE_URL: z.string().url(),
    VITE_SUPABASE_ANON_KEY: z.string(),
    VITE_APP_TITLE: z.string().default('ByteBank Auth'),
  },
  runtimeEnv: import.meta.env,
})
```

### Integração com Supabase

Configuração do cliente Supabase para autenticação:

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import { env } from '@/env'

export const supabase = createClient(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  },
)
```

## 🔗 Integração com Outros MFEs

### Compartilhamento de Estado

O estado de autenticação é compartilhado via Module Federation:

```typescript
// Outros MFEs podem consumir
import { useAuth } from 'mfe-auth/useAuth';

function ProtectedComponent() {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" />;

  return <Dashboard />;
}
```

### Dependências Compartilhadas

- **@bytebank/ui**: Design System compartilhado
- **@bytebank/env**: Configurações de ambiente seguras
- **React Query**: Estado global de cache
- **Supabase Client**: Autenticação unificada

## 🎨 Componentes Principais

### AuthForm Component

Formulário reutilizável para login e registro:

```tsx
<AuthForm
  mode="login" // ou "register"
  onSubmit={handleSubmit}
  loading={isLoading}
  defaultValues={initialData}
/>
```

### AuthGuard Component

Proteção de rotas que pode ser exportada para outros MFEs:

```tsx
<AuthGuard fallback={<LoginRedirect />} requiredRole="user">
  <ProtectedContent />
</AuthGuard>
```

## 🚀 Deploy e URLs

### Ambientes

- **Desenvolvimento**: http://localhost:3001
- **Produção**: https://appbytebank-auth.netlify.app

### Configuração de Deploy

O MFE está configurado para deploy automático no Netlify:

```toml
# netlify.toml
[build]
  command = "pnpm build"
  publish = "dist"

[[headers]]
  for = "/remoteEntry.js"
  [headers.values]
    Access-Control-Allow-Origin = "*"
```

## 🎯 Próximos Passos

Para contribuir com este MFE:

1. **Instale as dependências**: `pnpm install` (na raiz do monorepo)
2. **Configure o ambiente**: Copie `.env.example` para `.env`
3. **Execute em desenvolvimento**: `pnpm dev`
4. **Acesse**: http://localhost:3001
5. **Desenvolva**: Os componentes estão em `src/components/`
6. **Teste**: Faça login/registro para testar as funcionalidades

## 📚 Documentação Relacionada

- [Supabase Auth](https://supabase.com/docs/guides/auth) - Sistema de autenticação
- [React Hook Form](https://react-hook-form.com/) - Gestão de formulários
- [TanStack Query](https://tanstack.com/query) - Gerenciamento de estado
- [Module Federation](https://module-federation.io/) - Microfrontends
- [T3 Env](https://env.t3.gg/) - Gestão segura de variáveis

---

**Este MFE é parte do ecossistema ByteBank - Sistema de Banking Digital**
