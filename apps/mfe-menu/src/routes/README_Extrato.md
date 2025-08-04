# Página de Extrato

## Descrição

Página dedicada ao extrato financeiro completo da conta, exibindo todas as transações com filtros avançados e estatísticas do período.

## Funcionalidades Implementadas

### 1. **Exibição do Saldo Atual**

- Uso do componente `AccountInfos` no header
- Mostra o saldo da conta corrente
- Inclui botão de olho para ocultar/mostrar valor

### 2. **Estatísticas do Período**

Quatro cards usando `AccountInfos` com cores apropriadas:

- **Total de Transações**: Formato numérico simples
- **Receitas**: Verde, soma dos depósitos
- **Gastos**: Vermelho, soma de saques/pagamentos/taxas/transferências
- **Saldo do Período**: Verde/vermelho baseado em positivo/negativo

### 3. **Filtros Avançados**

- Data (de/até)
- Tipo de transação
- Status da transação
- Valor mínimo/máximo
- Descrição (busca por texto)

### 4. **Lista de Transações**

- Exibição detalhada de cada transação
- Componente `TransactionItem` reutilizável
- Estados de loading e empty state

### 5. **Exportação**

- Botão para exportar dados em CSV
- Inclui apenas transações filtradas
- Nome do arquivo com data atual

## Melhorias no AccountInfos

### Nova propriedade `formatType`

```typescript
formatType?: 'currency' | 'number'
```

- `currency` (padrão): Formata como moeda (R$ 1.234,56)
- `number`: Formata como número simples (1.234)

### Exemplo de uso

```typescript
// Para valores monetários
<AccountInfos
  title="Receitas do Mês"
  amount={3200.50}
  formatType="currency"  // Padrão
  colorType="success"
/>

// Para contadores
<AccountInfos
  title="Total de Transações"
  amount={45}
  formatType="number"
  colorType="primary"
/>
```

## Estrutura de Arquivos

```
src/routes/extrato.tsx              # Página principal
src/components/extrato/
├── index.ts                        # Exports
├── TransactionItem.tsx             # Item individual da lista
└── ExtractFilters.tsx              # Componente de filtros
```

## Navegação

- Adicionado link "Extrato" na sidebar
- Ícone de documento para representar extrato
- Posicionado entre "Transações" e "Investimentos"

## Integração com Hooks Existentes

- `useTransactions`: Busca transações e conta principal
- Filtros aplicados em tempo real via `useMemo`
- Cálculos de estatísticas automáticos

## Estados Tratados

- **Loading**: Skeleton/spinner durante carregamento
- **Empty**: Mensagem quando não há transações
- **Filtered Empty**: Mensagem específica quando filtros não retornam resultados
- **Error**: Tratamento via sistema de toast existente

## Responsividade

- Grid adaptável: 1 coluna (mobile) → 4 colunas (desktop)
- Header flexível com stack vertical em mobile
- Cards de estatísticas responsivos

## Benefícios

1. **Reutilização**: Usa `AccountInfos` existente de forma consistente
2. **Performance**: Filtros aplicados via memoização
3. **UX**: Estados claros e feedback visual adequado
4. **Exportação**: Facilita relatórios externos
5. **Filtros**: Busca granular para encontrar transações específicas
