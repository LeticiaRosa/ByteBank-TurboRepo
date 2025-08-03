import {
  useTransactionsList,
  useCreateTransaction,
  useTransaction as useTransactionDetail,
  type Transaction,
  type CreateTransactionData,
} from './useTransactionOperations'
import {
  useBankAccounts,
  usePrimaryBankAccount,
  type BankAccount,
} from './useBankAccounts'
import { transactionService } from '../lib/transactions'
import { useToast } from '@bytebank/ui'

// Interface do hook principal - combinando responsabilidades relacionadas
export interface UseTransactionsReturn {
  // Dados de transações
  transactions: Transaction[] | undefined
  isLoadingTransactions: boolean
  transactionsError: Error | null

  // Dados de contas bancárias
  bankAccounts: BankAccount[] | undefined
  primaryAccount: BankAccount | null | undefined
  isLoadingAccounts: boolean
  accountsError: Error | null

  // Estados de criação
  isCreating: boolean
  createTransactionError: Error | null

  // Ações
  createTransaction: (data: CreateTransactionData) => Promise<Transaction>
  refreshTransactions: () => void
  refreshBankAccounts: () => void

  // Funções de processamento de transações
  processTransaction: (
    transactionId: string,
    action?: 'complete' | 'fail',
    reason?: string,
  ) => Promise<void>
  reprocessPendingTransactions: () => Promise<void>

  // Função helper para transação específica
  getTransaction: (id: string) => {
    transaction: Transaction | undefined
    isLoading: boolean
    error: Error | null
  }
}

/**
 * Hook principal que combina todas as funcionalidades relacionadas a transações
 * Mantém compatibilidade com a API anterior enquanto usa os hooks especializados
 */
export function useTransactions(): UseTransactionsReturn {
  const toast = useToast()

  // Hooks especializados para transações
  const {
    data: transactions,
    isLoading: isLoadingTransactions,
    error: transactionsError,
    refetch: refreshTransactions,
  } = useTransactionsList()

  // Hooks especializados para contas bancárias
  const {
    data: bankAccounts,
    isLoading: isLoadingAccounts,
    error: accountsError,
    refetch: refreshBankAccounts,
  } = useBankAccounts()

  const { data: primaryAccount } = usePrimaryBankAccount()

  // Hook de criação de transação
  const {
    mutateAsync: createTransactionMutation,
    isPending: isCreating,
    error: createTransactionError,
  } = useCreateTransaction()

  // Função para processar uma transação específica
  const processTransaction = async (
    transactionId: string,
    action: 'complete' | 'fail' = 'complete',
    reason?: string,
  ) => {
    try {
      const result = await transactionService.processTransaction(
        transactionId,
        action,
        reason,
      )

      if (result.success) {
        toast.success('Transação processada', {
          description: result.message,
          duration: 3000,
        })

        // Atualizar a lista de transações para refletir as mudanças
        await refreshTransactions()
        await refreshBankAccounts() // Para atualizar saldos
      } else {
        toast.error('Falha no processamento', {
          description: result.message,
          duration: 5000,
        })
      }
    } catch (error) {
      console.error('Erro ao processar transação:', error)
      toast.error('Erro no processamento', {
        description:
          error instanceof Error ? error.message : 'Erro desconhecido',
        duration: 5000,
      })
      throw error
    }
  }

  // Função para reprocessar transações pendentes
  const reprocessPendingTransactions = async () => {
    try {
      await transactionService.reprocessPendingTransactions()

      toast.success('Reprocessamento concluído', {
        description: 'Transações pendentes foram reprocessadas',
        duration: 3000,
      })

      // Atualizar dados após reprocessamento
      await refreshTransactions()
      await refreshBankAccounts()
    } catch (error) {
      console.error('Erro ao reprocessar transações:', error)
      toast.error('Erro no reprocessamento', {
        description:
          error instanceof Error ? error.message : 'Erro desconhecido',
        duration: 5000,
      })
      throw error
    }
  }

  // Função helper para obter transação específica usando cache inteligente
  const getTransaction = (id: string) => {
    // Primeiro verifica se a transação já está na lista em cache
    const cachedTransaction = transactions?.find((t) => t.id === id)

    if (cachedTransaction) {
      return {
        transaction: cachedTransaction,
        isLoading: false,
        error: null,
      }
    }

    // Se não estiver no cache, usa o hook específico
    const { data: transaction, isLoading, error } = useTransactionDetail(id)

    return {
      transaction,
      isLoading,
      error: error as Error | null,
    }
  }

  return {
    // Dados de transações
    transactions,
    isLoadingTransactions,
    transactionsError: transactionsError as Error | null,

    // Dados de contas bancárias
    bankAccounts,
    primaryAccount,
    isLoadingAccounts,
    accountsError: accountsError as Error | null,

    // Estados de criação
    isCreating,
    createTransactionError: createTransactionError as Error | null,

    // Ações
    createTransaction: createTransactionMutation,
    refreshTransactions,
    refreshBankAccounts,

    // Funções de processamento
    processTransaction,
    reprocessPendingTransactions,

    // Helper
    getTransaction,
  }
}

// Hook específico para uma transação - agora usa o hook especializado
export function useTransaction(id: string) {
  return useTransactionDetail(id)
}

// Exports de tipos para compatibilidade
export type { Transaction, CreateTransactionData, BankAccount }
