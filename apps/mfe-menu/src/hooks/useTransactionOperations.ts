import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@bytebank/ui'
import {
  transactionService,
  type Transaction,
  type CreateTransactionData,
} from '../lib/transactions'
import { QUERY_KEYS, QUERY_CONFIG } from '../lib/query-config'

/**
 * Hook para listar transações do usuário
 */
export function useTransactionsList() {
  return useQuery({
    queryKey: QUERY_KEYS.transactions.list(),
    queryFn: () => transactionService.getTransactions(),
    ...QUERY_CONFIG.transactions,
  })
}

/**
 * Hook para buscar uma transação específica
 */
export function useTransaction(id?: string) {
  const toast = useToast()

  return useQuery({
    queryKey: QUERY_KEYS.transactions.detail(id || ''),
    queryFn: () => transactionService.getTransaction(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutos para transações específicas
    retry: (failureCount, error) => {
      if (error.message.includes('Token de autenticação')) {
        toast.error('Sessão expirada', {
          description: 'Faça login novamente para continuar.',
        })
        return false
      }
      return failureCount < 3
    },
  })
}

/**
 * Hook para criar transações
 */
export function useCreateTransaction() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (data: CreateTransactionData) =>
      transactionService.createTransaction(data),

    onSuccess: async (newTransaction) => {
      // Atualiza a lista de transações no cache
      queryClient.setQueryData<Transaction[]>(
        QUERY_KEYS.transactions.list(),
        (oldData) => {
          if (!oldData) return [newTransaction]
          return [newTransaction, ...oldData]
        },
      )

      // Mostra toast de sucesso
      toast.success('Transação criada com sucesso!', {
        description: `Transação de ${newTransaction.transaction_type} no valor de ${newTransaction.amount.toLocaleString(
          'pt-BR',
          {
            style: 'currency',
            currency: 'BRL',
          },
        )}`,
        duration: 3000,
      })

      // Força o refetch IMEDIATO e FORÇADO das contas bancárias para atualizar saldos
      await Promise.all([
        queryClient.refetchQueries({
          queryKey: QUERY_KEYS.bankAccounts.all,
          type: 'active',
        }),
        queryClient.refetchQueries({
          queryKey: QUERY_KEYS.bankAccounts.lists(),
          type: 'active',
        }),
        queryClient.refetchQueries({
          queryKey: QUERY_KEYS.bankAccounts.primary(),
          type: 'active',
        }),
      ])

      // Invalida queries relacionadas para garantir sincronização futura
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions.all })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bankAccounts.all })
    },

    onError: (error: Error) => {
      console.error('Erro ao criar transação:', error)

      // Toast de erro mais específico
      if (error.message.includes('Token de autenticação')) {
        toast.error('Sessão expirada', {
          description: 'Faça login novamente para continuar.',
          duration: 5000,
        })
      } else {
        toast.error('Erro ao criar transação', {
          description: error.message || 'Tente novamente em alguns instantes.',
          duration: 5000,
        })
      }
    },
  })
}

export type { Transaction, CreateTransactionData }
