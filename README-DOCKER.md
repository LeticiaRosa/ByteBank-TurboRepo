# ByteBank - Desenvolvimento com Docker

## 🚀 Como usar

### 1. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e configure suas credenciais do Supabase:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações do Supabase.

### 2. Execute o projeto

```bash
# Construir e executar os contêineres
docker compose up --build

# Ou em background
docker compose up -d --build
```

> **Nota**: Se houver erro de lockfile, execute primeiro `pnpm install` na raiz do projeto para atualizar o `pnpm-lock.yaml`

### 3. Acesse as aplicações

- **MFE Auth**: http://localhost:3001
- **MFE Menu**: http://localhost:3002

### 4. Parar os contêineres

```bash
docker-compose down
```

## 📋 Estrutura

O projeto contém dois Micro Front-ends containerizados:

- `mfe-auth`: Responsável pela autenticação (porta 3001)
- `mfe-menu`: Dashboard principal da aplicação (porta 3002)

Ambos utilizam:

- React + TypeScript
- Vite
- Module Federation
- Supabase (backend/autenticação)
- Docker para containerização

**Arquitetura simplificada para desenvolvimento:**

- Sem Nginx (desnecessário para dev)
- Sem PostgreSQL local (usa Supabase)
- Sem Redis (não necessário)
- Containers se comunicam diretamente

## 🔧 Desenvolvimento

Os contêineres estão configurados com hot-reload, então qualquer mudança no código será refletida automaticamente na aplicação.

## 🆘 Troubleshooting

### Erro ERR_EMPTY_RESPONSE

Se os serviços não respondem:

- Aguarde alguns minutos para o build inicial
- Verifique os logs: `docker compose logs mfe-auth` ou `docker compose logs mfe-menu`
- Os serviços estão configurados para escutar em `0.0.0.0` dentro do Docker

### Erro de CORS

Não deve mais ocorrer com a configuração simplificada usando apenas `localhost`.

### Erro de workspace packages

Se aparecer erro sobre packages não encontrados:

```bash
# Limpe o cache do Docker primeiro
docker system prune -a

# Execute na raiz do projeto
pnpm install

# Depois execute o docker
docker compose up --build
```

### Limpar cache do Docker

```bash
# Remove todos os contêineres e imagens
docker compose down
docker system prune -a
```
