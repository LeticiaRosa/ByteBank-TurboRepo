import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useTransactions, type Transaction } from '../hooks'
import {
  NewTransactionForm,
  RecentTransactions,
} from '../components/transactions'

export const Route = createFileRoute('/transacoes')({
  component: TransferenciasPage,
})

function TransferenciasPage() {
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null)

  const {
    bankAccounts,
    primaryAccount,
    isLoadingAccounts,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    processTransaction,
    reprocessPendingTransactions,
    refreshBankAccounts,
    isCreating,
    isUpdating,
  } = useTransactions()

  // Função para lidar com a edição de transações
  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction)
  }

  // Função para cancelar a edição
  const handleCancelEdit = () => {
    setEditingTransaction(null)
  }

  if (isLoadingAccounts) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando transações...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-foreground mb-6">Transações</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário de Transações */}
        <NewTransactionForm
          primaryAccount={primaryAccount}
          bankAccounts={bankAccounts}
          isCreating={isCreating}
          onCreateTransaction={createTransaction}
          isEditing={!!editingTransaction}
          editingTransaction={editingTransaction}
          isUpdating={isUpdating}
          onUpdateTransaction={updateTransaction}
          onCancelEdit={handleCancelEdit}
        />

        {/* Histórico Recente */}
        <RecentTransactions
          primaryAccount={primaryAccount}
          onProcessTransaction={processTransaction}
          onEditTransaction={handleEditTransaction}
          onDeleteTransaction={deleteTransaction}
          onReprocessPendingTransactions={reprocessPendingTransactions}
          onRefreshBankAccounts={refreshBankAccounts}
        />
      </div>
    </div>
  )
}
