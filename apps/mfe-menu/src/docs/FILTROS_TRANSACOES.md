# Filtros de Transações - Integração com Supabase

Este documento explica como usar os filtros de transações implementados no sistema ByteBank, seguindo a documentação do Supabase.

## Arquivos Criados/Modificados

1. **`src/lib/transactions.ts`** - Funções para filtrar transações (migradas do supabase.ts)
2. **`src/lib/file-upload.ts`** - Funções para upload de arquivos (NEW)
3. **`src/components/extrato/ExtractFilters.tsx`** - Componente de filtros (com exemplos atualizados)
4. **`src/hooks/useFilteredTransactions.ts`** - Hooks para React Query
5. **`src/components/extrato/ExtractWithFilters.tsx`** - Exemplo de componente completo

## Principais Funcionalidades

### 1. Função `getFilteredTransactions`

Busca transações usando os filtros do componente `ExtractFilters`:

```typescript
const filters: FilterOptions = {
  dateFrom: '2024-01-01',
  dateTo: '2024-12-31',
  transactionType: 'deposit',
  status: 'completed',
  minAmount: '100',
  maxAmount: '1000',
  description: 'salário',
  category: 'trabalho',
  senderName: 'empresa',
}

const transactions = await getFilteredTransactions(filters, userId)
```

### 2. Função `queryTransactions`

Busca transações com sintaxe similar ao Supabase JS SDK:

```typescript
// Exemplo: Buscar transações de alimentação dos últimos 30 dias
const transactions = await queryTransactions(userId, {
  eq: { category: 'alimentacao' },
  gte: { created_at: '2024-01-01T00:00:00.000Z' },
  lte: { created_at: '2024-12-31T23:59:59.999Z' },
  ilike: { description: 'mercado' },
  order: { column: 'created_at', ascending: false },
})
```

### 3. Funções de Upload de Arquivos (file-upload.ts)

```typescript
// Upload de comprovantes
const { url, error } = await uploadReceipt(file, transactionId, userId)

// Upload genérico
const { url, error } = await uploadFile(file, 'bucket-name', 'path/to/file')

// Validação de arquivo
const { isValid, error } = validateReceiptFile(file)
```

### 3. Hooks para React Query

```typescript
// Hook para filtros do componente
const {
  data: transactions,
  isLoading,
  error,
} = useFilteredTransactions(filters, userId, true)

// Hook para queries customizadas
const { data: foodTransactions } = useCustomTransactionQuery(userId, {
  eq: { category: 'alimentacao' },
  gte: { created_at: startOfMonth },
  order: { column: 'created_at', ascending: false },
})
```

## Filtros Suportados

### Operadores Disponíveis

- **`eq`** - Igual (equivalente ao `.eq()` do Supabase)
- **`gte`** - Maior ou igual (equivalente ao `.gte()` do Supabase)
- **`lte`** - Menor ou igual (equivalente ao `.lte()` do Supabase)
- **`like`** - Busca textual sensível ao caso (equivalente ao `.like()` do Supabase)
- **`ilike`** - Busca textual insensível ao caso (equivalente ao `.ilike()` do Supabase)
- **`order`** - Ordenação (equivalente ao `.order()` do Supabase)

### Campos Filtráveis

- **Datas**: `dateFrom`, `dateTo` (usa `created_at`)
- **Tipo**: `transactionType` (deposit, withdrawal, transfer, payment, fee)
- **Status**: `status` (pending, completed, failed, cancelled)
- **Valores**: `minAmount`, `maxAmount` (convertidos para centavos)
- **Texto**: `description`, `senderName` (busca case-insensitive)
- **Categoria**: `category` (alimentacao, transporte, etc.)

## Implementação Técnica

### Parâmetros PostgREST

As funções convertem os filtros para parâmetros de query do PostgREST:

```typescript
// Filtro por período
params['created_at'] =
  'gte.2024-01-01T00:00:00.000Z&created_at=lte.2024-12-31T23:59:59.999Z'

// Filtro por categoria
params['category'] = 'eq.alimentacao'

// Filtro por descrição (case-insensitive)
params['description'] = 'ilike.%mercado%'

// Filtro por valor
params['amount'] = 'gte.10000&amount=lte.50000' // R$ 100,00 a R$ 500,00
```

### Uso do HttpClient

As funções utilizam o `HttpClient` existente no projeto:

```typescript
const transactions = await httpClient.get<Transaction[]>(
  '/transactions',
  params,
)
```

## Exemplos Práticos

### 1. Transações de Alimentação

```typescript
const foodTransactions = await queryTransactions(userId, {
  eq: { category: 'alimentacao' },
  gte: {
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  order: { column: 'created_at', ascending: false },
})
```

### 2. Transferências Pendentes

```typescript
const pendingTransfers = await queryTransactions(userId, {
  eq: {
    transaction_type: 'transfer',
    status: 'pending',
  },
  order: { column: 'created_at', ascending: false },
})
```

### 3. Transações Acima de R$ 500

```typescript
const largeTransactions = await queryTransactions(userId, {
  gte: { amount: 50000 }, // 500 * 100 centavos
  order: { column: 'amount', ascending: false },
})
```

### 4. Busca por Descrição

```typescript
const marketTransactions = await queryTransactions(userId, {
  ilike: { description: 'mercado' },
  eq: { category: 'alimentacao' },
  order: { column: 'created_at', ascending: false },
})
```

## Estrutura da Tabela Transactions

```sql
-- Campos principais utilizados nos filtros
created_at: timestamp with time zone
transaction_type: enum (deposit, withdrawal, transfer, payment, fee)
status: enum (pending, completed, failed, cancelled)
amount: bigint (valor em centavos)
description: text
category: enum (alimentacao, transporte, saude, etc.)
sender_name: text
user_id: uuid
```

## Integração com React Query

O sistema utiliza React Query para cache e gerenciamento de estado das consultas:

```typescript
// Configuração automática de cache, retry e invalidação
const { data, isLoading, error, refetch } = useFilteredTransactions(
  filters,
  userId,
)
```

## Equivalência com Supabase JS SDK

```typescript
// Usando o SDK oficial (exemplo de equivalência)
const { data, error } = await supabase
  .from('transactions')
  .select('*')
  .eq('user_id', userId)
  .eq('category', 'alimentacao')
  .gte('created_at', '2024-01-01T00:00:00.000Z')
  .lte('created_at', '2024-12-31T23:59:59.999Z')
  .ilike('description', '%mercado%')
  .order('created_at', { ascending: false })

// Usando nossa implementação (equivalente)
const transactions = await queryTransactions(userId, {
  eq: { category: 'alimentacao' },
  gte: { created_at: '2024-01-01T00:00:00.000Z' },
  lte: { created_at: '2024-12-31T23:59:59.999Z' },
  ilike: { description: 'mercado' },
  order: { column: 'created_at', ascending: false },
})
```
