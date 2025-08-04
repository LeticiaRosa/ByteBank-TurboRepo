import { useQuery } from '@tanstack/react-query'
import { getFilteredTransactions, queryTransactions } from '../lib/transactions'
import type { FilterOptions } from '../components/extrato/ExtractFilters'
import type { PaginationOptions } from '../lib/transactions'
import { QUERY_KEYS, QUERY_CONFIG } from '../lib/query-config'

/**
 * Hook para buscar transações filtradas usando React Query
 * @param filters - Filtros aplicados
 * @param userId - ID do usuário
 * @param pagination - Opções de paginação
 * @param enabled - Se a query deve ser executada
 */
export function useFilteredTransactions(
  filters: FilterOptions,
  userId: string,
  pagination?: PaginationOptions,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: [...QUERY_KEYS.transactions.list(filters), userId, pagination],
    queryFn: () => getFilteredTransactions(filters, userId, pagination),
    enabled: enabled && !!userId,
    ...QUERY_CONFIG.transactions,
  })
}

/**
 * Hook para buscar transações usando query customizada
 * @param userId - ID do usuário
 * @param options - Opções de filtro customizadas
 * @param enabled - Se a query deve ser executada
 */
export function useCustomTransactionQuery(
  userId: string,
  options?: Parameters<typeof queryTransactions>[1],
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: [...QUERY_KEYS.transactions.list(options), userId],
    queryFn: () => queryTransactions(userId, options),
    enabled: enabled && !!userId,
    ...QUERY_CONFIG.transactions,
  })
}
