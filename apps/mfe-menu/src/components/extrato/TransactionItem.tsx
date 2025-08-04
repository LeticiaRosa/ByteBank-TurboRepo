import { useState } from 'react'
import { Card, CardContent } from '@bytebank/ui'
import { type Transaction } from '../../hooks'

interface TransactionItemProps {
  transaction: Transaction
  onEdit?: (transaction: Transaction) => void
  onDelete?: (transactionId: string) => void
  onProcess?: (transactionId: string, action: 'complete' | 'fail') => void
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  const getTransactionTypeLabel = (type: string) => {
    const types = {
      deposit: 'Depósito',
      withdrawal: 'Saque',
      transfer: 'Transferência',
      payment: 'Pagamento',
      fee: 'Taxa',
    }
    return types[type as keyof typeof types] || type
  }

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'withdrawal':
      case 'fee':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'transfer':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'payment':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getAmountColor = (type: string) => {
    return type === 'deposit'
      ? 'text-green-600 dark:text-green-400'
      : 'text-red-600 dark:text-red-400'
  }

  const getAmountPrefix = (type: string) => {
    return type === 'deposit' ? '+' : '-'
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Ícone do tipo de transação */}
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              {transaction.transaction_type === 'deposit' && (
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {transaction.transaction_type === 'withdrawal' && (
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {transaction.transaction_type === 'transfer' && (
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {transaction.transaction_type === 'payment' && (
                <svg
                  className="w-5 h-5 text-orange-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path
                    fillRule="evenodd"
                    d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {transaction.transaction_type === 'fee' && (
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>

            {/* Informações da transação */}
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTransactionTypeColor(transaction.transaction_type)}`}
                >
                  {getTransactionTypeLabel(transaction.transaction_type)}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(transaction.status)}`}
                >
                  {transaction.status === 'completed' && 'Concluída'}
                  {transaction.status === 'pending' && 'Pendente'}
                  {transaction.status === 'failed' && 'Falhou'}
                  {transaction.status === 'cancelled' && 'Cancelada'}
                </span>
              </div>

              <h3 className="font-medium text-foreground">
                {transaction.description || 'Sem descrição'}
              </h3>

              <p className="text-sm text-muted-foreground">
                {formatDate(transaction.created_at)}
              </p>

              {transaction.reference_number && (
                <p className="text-xs text-muted-foreground">
                  Ref: {transaction.reference_number}
                </p>
              )}
            </div>
          </div>

          {/* Valor e ações */}
          <div className="text-right">
            <p
              className={`text-lg font-bold ${getAmountColor(transaction.transaction_type)}`}
            >
              {getAmountPrefix(transaction.transaction_type)}
              {formatAmount(transaction.amount)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
