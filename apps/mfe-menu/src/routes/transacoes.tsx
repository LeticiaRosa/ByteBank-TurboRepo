import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useTransactions, type CreateTransactionData } from '../hooks'
import { type Transaction } from '../lib/transactions'
import { useToast } from '@bytebank/ui'

export const Route = createFileRoute('/transacoes')({
  component: TransferenciasPage,
})

interface TransactionFormData {
  transaction_type: 'deposit' | 'withdrawal' | 'transfer' | 'payment' | 'fee'
  amount: string
  description: string
  to_account_number?: string
}

function TransferenciasPage() {
  const {
    transactions,
    bankAccounts,
    primaryAccount,
    isLoadingTransactions,
    isLoadingAccounts,
    createTransaction,
    isCreating,
  } = useTransactions()

  const toast = useToast()

  // Estado do formulário
  const [formData, setFormData] = useState<TransactionFormData>({
    transaction_type: 'deposit',
    amount: '',
    description: '',
    to_account_number: '',
  })

  const [errors, setErrors] = useState<Partial<TransactionFormData>>({})

  // Função para validar o formulário
  const validateForm = (): boolean => {
    const newErrors: Partial<TransactionFormData> = {}

    // Validar valor
    const amount = parseFloat(
      formData.amount.replace(/[^\d,.-]/g, '').replace(',', '.'),
    )
    if (!formData.amount || isNaN(amount) || amount <= 0) {
      newErrors.amount = 'Valor deve ser um número positivo'
    }

    // Validar descrição
    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória'
    }

    // Validar conta de destino para transferências
    if (
      formData.transaction_type === 'transfer' &&
      !formData.to_account_number?.trim()
    ) {
      newErrors.to_account_number =
        'Conta de destino é obrigatória para transferências'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Função para formatar valor em moeda
  const formatCurrency = (value: string): string => {
    // Remove tudo que não é dígito
    const cleanValue = value.replace(/\D/g, '')

    // Converte para número e formata
    const numberValue = parseInt(cleanValue) / 100

    return numberValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  // Função para lidar com mudanças no campo de valor
  const handleAmountChange = (value: string) => {
    const formatted = formatCurrency(value)
    setFormData((prev) => ({ ...prev, amount: formatted }))

    // Limpar erro se houver
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: undefined }))
    }
  }

  // Função para buscar conta por número
  const findAccountByNumber = (accountNumber: string) => {
    return bankAccounts?.find(
      (account) => account.account_number === accountNumber,
    )
  }

  // Função para submeter o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Erro de validação', {
        description: 'Verifique os campos obrigatórios',
        duration: 3000,
      })
      return
    }

    if (!primaryAccount) {
      toast.error('Erro', {
        description: 'Nenhuma conta bancária encontrada!',
        duration: 3000,
      })
      return
    }

    try {
      // Converter valor para número
      const amount = parseFloat(
        formData.amount.replace(/[^\d,.-]/g, '').replace(',', '.'),
      )

      // Preparar dados da transação
      const transactionData: CreateTransactionData = {
        transaction_type: formData.transaction_type,
        amount,
        description: formData.description,
        from_account_id: primaryAccount.id,
      }

      // Para transferências, buscar conta de destino
      if (
        formData.transaction_type === 'transfer' &&
        formData.to_account_number
      ) {
        const toAccount = findAccountByNumber(formData.to_account_number)
        if (!toAccount) {
          toast.error('Conta não encontrada', {
            description: 'A conta de destino informada não foi encontrada',
            duration: 5000,
          })
          return
        }
        transactionData.to_account_id = toAccount.id
      }

      // Criar transação
      await createTransaction(transactionData)

      // Limpar formulário após sucesso
      setFormData({
        transaction_type: 'deposit',
        amount: '',
        description: '',
        to_account_number: '',
      })
      setErrors({})
    } catch (error) {
      console.error('Erro ao criar transação:', error)
    }
  }

  // Função para lidar com mudanças nos campos
  const handleInputChange = (
    field: keyof TransactionFormData,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Limpar erro específico
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  if (isLoadingTransactions || isLoadingAccounts) {
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
        <div className="bg-card rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Nova Transação
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tipo de Transação */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Tipo de Transação *
              </label>
              <select
                value={formData.transaction_type}
                onChange={(e) =>
                  handleInputChange('transaction_type', e.target.value as any)
                }
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-card-foreground bg-background"
              >
                <option
                  value="deposit"
                  className="text-card-foreground bg-background"
                >
                  Depósito
                </option>
                <option
                  value="withdrawal"
                  className="text-card-foreground bg-background"
                >
                  Saque
                </option>
                <option
                  value="transfer"
                  className="text-card-foreground bg-background"
                >
                  Transferência
                </option>
                <option
                  value="payment"
                  className="text-card-foreground bg-background"
                >
                  Pagamento
                </option>
                <option
                  value="fee"
                  className="text-card-foreground bg-background"
                >
                  Taxa
                </option>
              </select>
            </div>

            {/* Valor */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Valor *
              </label>
              <input
                type="text"
                value={formData.amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="R$ 0,00"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring ${
                  errors.amount ? 'border-destructive' : 'border-border'
                }`}
              />
              {errors.amount && (
                <p className="text-destructive text-sm mt-1">{errors.amount}</p>
              )}
            </div>

            {/* Conta de Destino (apenas para transferências) */}
            {formData.transaction_type === 'transfer' && (
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">
                  Conta de Destino *
                </label>
                <input
                  type="text"
                  value={formData.to_account_number || ''}
                  onChange={(e) =>
                    handleInputChange('to_account_number', e.target.value)
                  }
                  placeholder="Digite o número da conta"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring ${
                    errors.to_account_number
                      ? 'border-destructive'
                      : 'border-border'
                  }`}
                />
                {errors.to_account_number && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.to_account_number}
                  </p>
                )}
              </div>
            )}

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Descrição *
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
                placeholder="Motivo da transação"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring ${
                  errors.description ? 'border-destructive' : 'border-border'
                }`}
              />
              {errors.description && (
                <p className="text-destructive text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Informações da conta */}
            {primaryAccount && (
              <div className="bg-muted/50 p-3 rounded-md">
                <p className="text-sm text-muted-foreground">
                  <strong>Conta de origem:</strong>{' '}
                  {primaryAccount.account_number}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Saldo disponível:</strong> R${' '}
                  {primaryAccount.balance.toFixed(2)}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isCreating}
              className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Processando...' : 'Efetuar Transação'}
            </button>
          </form>
        </div>

        {/* Histórico Recente */}
        <div className="bg-card rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Transações Recentes
          </h2>

          {isLoadingTransactions ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : transactions && transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction: Transaction) => {
                const isOutgoing =
                  transaction.from_account_id === primaryAccount?.id
                const amount = transaction.amount

                // Para mostrar informações das contas, seria necessário fazer joins na API
                // Por enquanto, vamos usar apenas os IDs
                const otherAccountId = isOutgoing
                  ? transaction.to_account_id
                  : transaction.from_account_id

                const getTransactionIcon = (
                  type: string,
                  isOutgoing: boolean,
                ) => {
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
                      return (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      )
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

                const getTransactionColor = (
                  type: string,
                  isOutgoing: boolean,
                ) => {
                  if (
                    type === 'deposit' ||
                    (!isOutgoing && type === 'transfer')
                  ) {
                    return 'text-chart-1'
                  }
                  return 'text-destructive'
                }

                const getTransactionBgColor = (
                  type: string,
                  isOutgoing: boolean,
                ) => {
                  if (
                    type === 'deposit' ||
                    (!isOutgoing && type === 'transfer')
                  ) {
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

                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between py-3 border-b border-border"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 ${getTransactionBgColor(transaction.transaction_type, isOutgoing)} rounded-full flex items-center justify-center`}
                      >
                        <svg
                          className={`w-5 h-5 ${getTransactionColor(transaction.transaction_type, isOutgoing)}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {getTransactionIcon(
                            transaction.transaction_type,
                            isOutgoing,
                          )}
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {formatTransactionDescription(
                            transaction.transaction_type,
                            isOutgoing,
                            otherAccountId,
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.created_at).toLocaleDateString(
                            'pt-BR',
                            {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            },
                          )}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`font-medium ${getTransactionColor(transaction.transaction_type, isOutgoing)}`}
                    >
                      {isOutgoing ||
                      transaction.transaction_type === 'withdrawal' ||
                      transaction.transaction_type === 'payment' ||
                      transaction.transaction_type === 'fee'
                        ? '-'
                        : '+'}
                      R$ {amount.toFixed(2)}
                    </span>
                  </div>
                )
              })}
            </div>
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
              <p className="text-muted-foreground">
                Nenhuma transação encontrada
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Suas transações aparecerão aqui após serem realizadas
              </p>
            </div>
          )}

          {transactions && transactions.length > 5 && (
            <button
              className="w-full mt-4 text-primary hover:text-primary/80 font-medium text-sm"
              onClick={() => {
                // Aqui você pode implementar navegação para uma página completa de transações
                console.log('Ver todas as transações')
              }}
            >
              Ver todas as transações ({transactions.length})
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
