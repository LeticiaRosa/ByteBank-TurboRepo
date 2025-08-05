import { type Transaction, type BankAccount } from '../../hooks'
import { useFilteredTransactions } from '../../hooks/useFilteredTransactions'
import { TransactionItem } from './TransactionItem'
import { Button, ScrollArea } from '@bytebank/ui'
import { useState, useEffect } from 'react'
import { authService } from '../../lib/auth'

interface RecentTransactionsProps {
  primaryAccount: BankAccount | null | undefined
  onProcessTransaction: (
    transactionId: string,
    action: 'complete' | 'fail',
    reason?: string,
  ) => Promise<void>
  onEditTransaction?: (transaction: Transaction) => void
  onDeleteTransaction?: (transactionId: string) => Promise<void>
  onReprocessPendingTransactions: () => Promise<void>
  onRefreshBankAccounts: () => Promise<void> | void
}

export function RecentTransactions({
  primaryAccount,
  onProcessTransaction,
  onEditTransaction,
  onDeleteTransaction,
  onReprocessPendingTransactions,
  onRefreshBankAccounts,
}: RecentTransactionsProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([])
  const userId = authService.getCurrentUserId()

  // Calcular data de 2 semanas atrás para transações recentes
  const twoWeeksAgo = new Date()
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
  const dateFrom = twoWeeksAgo.toISOString().split('T')[0]

  // Buscar transações recentes (5 por página)
  const { data: result, isLoading: isLoadingTransactions } =
    useFilteredTransactions(
      {
        dateFrom,
        dateTo: '',
        transactionType: '',
        status: '',
        minAmount: '',
        maxAmount: '',
        description: '',
        category: '',
        senderName: '',
      },
      userId || '',
      { page: currentPage, pageSize: 5 },
    )

  // Atualizar a lista de transações quando novos dados chegarem
  useEffect(() => {
    if (result?.data) {
      if (currentPage === 1) {
        // Primeira página - substitui todas as transações
        setAllTransactions(result.data)
      } else {
        // Páginas subsequentes - adiciona às transações existentes
        setAllTransactions((prev) => {
          const newTransactions = result.data.filter(
            (newTx) => !prev.some((existingTx) => existingTx.id === newTx.id),
          )
          return [...prev, ...newTransactions]
        })
      }
    }
  }, [result?.data, currentPage])

  const handleReprocessAllPending = async () => {
    await onReprocessPendingTransactions()
    // Atualizar saldo imediatamente após reprocessar todas as transações
    const refreshResult = onRefreshBankAccounts()
    if (refreshResult instanceof Promise) {
      await refreshResult
    }
  }

  const handleLoadMoreTransactions = () => {
    setCurrentPage((prev) => prev + 1)
  }

  // Verificar se há mais transações para carregar
  const hasMoreTransactions =
    result?.pagination &&
    result.pagination.total &&
    currentPage < Math.ceil(result.pagination.total / 5)

  if (isLoadingTransactions) {
    return (
      <div className="bg-card rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Transações Recentes
        </h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">
          Transações Recentes
        </h2>

        {/* Botão para reprocessar transações pendentes */}
        {allTransactions &&
          allTransactions.some((t: Transaction) => t.status === 'pending') && (
            <Button
              onClick={handleReprocessAllPending}
              size="sm"
              className="text-sm bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-md transition-colors"
              title="Reprocessar transações pendentes"
            >
              Reprocessar Pendentes
            </Button>
          )}
      </div>

      {allTransactions && allTransactions.length > 0 ? (
        <ScrollArea className="h-142">
          <div className="space-y-3 pr-4">
            {allTransactions.map((transaction: Transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                primaryAccount={primaryAccount}
                onProcessTransaction={onProcessTransaction}
                onEditTransaction={onEditTransaction}
                onDeleteTransaction={onDeleteTransaction}
                onRefreshBankAccounts={onRefreshBankAccounts}
              />
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg
              className="w-8 h-8 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <p className="text-muted-foreground">Nenhuma transação encontrada</p>
          <p className="text-sm text-muted-foreground mt-1">
            Suas transações aparecerão aqui após serem realizadas
          </p>
        </div>
      )}

      {/* Botão para carregar mais transações */}
      {hasMoreTransactions && (
        <Button
          variant="ghost"
          className="w-full mt-4 text-primary hover:text-primary/80 font-medium text-sm"
          onClick={handleLoadMoreTransactions}
          disabled={isLoadingTransactions}
        >
          {isLoadingTransactions ? 'Carregando...' : 'Carregar mais transações'}
        </Button>
      )}
    </div>
  )
}
