import { type Transaction, type BankAccount } from '../../hooks'
import { Button } from '@bytebank/ui'

interface TransactionItemProps {
  transaction: Transaction
  primaryAccount: BankAccount | null | undefined
  onProcessTransaction: (
    transactionId: string,
    action: 'complete' | 'fail',
    reason?: string,
  ) => Promise<void>
  onEditTransaction?: (transaction: Transaction) => void
  onDeleteTransaction?: (transactionId: string) => Promise<void>
  onRefreshBankAccounts: () => Promise<void> | void
}

export function TransactionItem({
  transaction,
  primaryAccount,
  onProcessTransaction,
  onEditTransaction,
  onDeleteTransaction,
  onRefreshBankAccounts,
}: TransactionItemProps) {
  const isOutgoing = transaction.from_account_id === primaryAccount?.id
  const amount = transaction.amount

  // Para mostrar informações das contas, seria necessário fazer joins na API
  // Por enquanto, vamos usar apenas os IDs
  const otherAccountId = isOutgoing
    ? transaction.to_account_id
    : transaction.from_account_id

  const getTransactionIcon = (type: string, isOutgoing: boolean) => {
    switch (type) {
      case 'transfer':
        return isOutgoing ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16l-4-4m0 0l4-4m-4 4h18"
          />
        )
      case 'deposit':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        )
      case 'withdrawal':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 12H4"
          />
        )
      case 'payment':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 0h10a2 2 0 002-2v-2a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          />
        )
      case 'fee':
      default:
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        )
    }
  }

  const getTransactionColor = (type: string, isOutgoing: boolean) => {
    if (type === 'deposit' || (!isOutgoing && type === 'transfer')) {
      return 'text-chart-1'
    }
    return 'text-destructive'
  }

  const getTransactionBgColor = (type: string, isOutgoing: boolean) => {
    if (type === 'deposit' || (!isOutgoing && type === 'transfer')) {
      return 'bg-chart-1/10'
    }
    return 'bg-destructive/10'
  }

  const formatTransactionDescription = (
    type: string,
    isOutgoing: boolean,
    otherAccountId?: string,
  ) => {
    switch (type) {
      case 'transfer':
        return isOutgoing
          ? `Transferência para ${otherAccountId ? `***${otherAccountId.slice(-4)}` : 'Conta Externa'}`
          : `Transferência de ${otherAccountId ? `***${otherAccountId.slice(-4)}` : 'Conta Externa'}`
      case 'deposit':
        return 'Depósito'
      case 'withdrawal':
        return 'Saque'
      case 'payment':
        return 'Pagamento'
      case 'fee':
        return 'Taxa'
      default:
        return 'Transação'
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        className:
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        label: 'Pendente',
      },
      completed: {
        className:
          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        label: 'Concluída',
      },
      failed: {
        className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        label: 'Falhou',
      },
      cancelled: {
        className:
          'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
        label: 'Cancelada',
      },
    }

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.cancelled

    return (
      <span
        className={`text-xs px-2 py-1 rounded-full font-medium ${config.className}`}
      >
        {config.label}
      </span>
    )
  }

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
        )
      case 'failed':
        return (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        )
      case 'completed':
        return (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
        )
      default:
        return null
    }
  }

  const handleEditTransaction = () => {
    if (onEditTransaction) {
      onEditTransaction(transaction)
    }
  }

  const handleDeleteTransaction = async () => {
    if (onDeleteTransaction) {
      // Confirmar exclusão
      const confirmDelete = confirm(
        `Tem certeza que deseja excluir esta transação?\n\n` +
          `Tipo: ${formatTransactionDescription(transaction.transaction_type, isOutgoing, otherAccountId)}\n` +
          `Valor: ${transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n` +
          `Descrição: ${transaction.description}\n\n` +
          `Esta ação não pode ser desfeita.`,
      )

      if (confirmDelete) {
        await onDeleteTransaction(transaction.id)
        // Atualizar saldo imediatamente após excluir transação
        const refreshResult = onRefreshBankAccounts()
        if (refreshResult instanceof Promise) {
          await refreshResult
        }
      }
    }
  }

  return (
    <div className="flex items-center justify-between py-3 border-b border-border">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 ${getTransactionBgColor(transaction.transaction_type, isOutgoing)} rounded-full flex items-center justify-center relative`}
        >
          <svg
            className={`w-5 h-5 ${getTransactionColor(transaction.transaction_type, isOutgoing)}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {getTransactionIcon(transaction.transaction_type, isOutgoing)}
          </svg>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-foreground">
              {formatTransactionDescription(
                transaction.transaction_type,
                isOutgoing,
                otherAccountId,
              )}
            </p>

            {/* Badge de status */}
            {getStatusBadge(transaction.status)}

            {/* Indicador de editável */}
            {(transaction.status === 'pending' ||
              transaction.status === 'failed') &&
              onEditTransaction && (
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  • Editável
                </span>
              )}
          </div>
          <p className="text-sm text-muted-foreground">
            {transaction.description}
          </p>
          <p className="text-sm text-muted-foreground">
            {new Date(transaction.created_at).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`font-medium ${getTransactionColor(transaction.transaction_type, isOutgoing)}`}
        >
          {transaction.transaction_type === 'withdrawal' ||
          transaction.transaction_type === 'payment' ||
          transaction.transaction_type === 'fee'
            ? '-'
            : '+'}
          {amount.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </span>

        {/* Botões de ação */}
        <div className="flex gap-2">
          {/* Botão de editar - disponível para transações pending e failed */}
          {onEditTransaction && (
            <Button
              onClick={handleEditTransaction}
              size="sm"
              className="flex items-center gap-1 text-xs bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1.5 rounded-md transition-colors shadow-sm"
              title="Editar transação"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Editar
            </Button>
          )}

          {/* Botão de excluir - disponível para transações pending e failed */}
          {onDeleteTransaction && (
            <Button
              onClick={handleDeleteTransaction}
              size="sm"
              variant="destructive"
              className="flex items-center gap-1 text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90 px-3 py-1.5 rounded-md transition-colors shadow-sm"
              title="Excluir transação"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Excluir
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
