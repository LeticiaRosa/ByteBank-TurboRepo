import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useTransactions, type CreateTransactionData } from '../hooks'
import { type Transaction, MoneyUtils } from '../lib/transactions'
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
    processTransaction,
    reprocessPendingTransactions,
    refreshBankAccounts,
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

  // Efeito para atualizar saldo automaticamente quando há transações pendentes
  useEffect(() => {
    const hasPendingTransactions = transactions?.some(
      (t) => t.status === 'pending',
    )

    if (hasPendingTransactions) {
      // Atualizar contas bancárias a cada 10 segundos quando há transações pendentes
      const interval = setInterval(() => {
        refreshBankAccounts()
      }, 10000)

      return () => clearInterval(interval)
    }
  }, [transactions, refreshBankAccounts])
  // Função para validar o formulário
  const validateForm = (): boolean => {
    const newErrors: Partial<TransactionFormData> = {}

    // Validar valor usando MoneyUtils para parsing correto
    const amountInCents = MoneyUtils.parseCurrencyToCents(formData.amount)
    const amount = MoneyUtils.centsToReais(amountInCents)
    if (!formData.amount || amount <= 0) {
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

  // Função para formatar valor em moeda (para entrada do usuário)
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
    console.log(value)
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
      // Converter valor string para número usando MoneyUtils
      console.log('Valor original:', formData.amount)
      const amountInCents = MoneyUtils.parseCurrencyToCents(formData.amount)
      const amount = MoneyUtils.centsToReais(amountInCents)
      console.log('Valor convertido para reais:', amount)

      // Preparar dados da transação (amount já em reais, será convertido no service)
      const transactionData: CreateTransactionData = {
        transaction_type: formData.transaction_type,
        amount, // Valor em reais - será convertido para centavos no service
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

      // A atualização automática das contas bancárias agora é feita no hook useCreateTransaction
      // Não precisamos mais chamar refreshBankAccounts aqui

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
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-card-foreground bg-card"
              >
                <option value="deposit" className="text-card-foreground ">
                  Depósito
                </option>
                <option value="withdrawal" className="text-card-foreground ">
                  Saque
                </option>
                <option value="transfer" className="text-card-foreground ">
                  Transferência
                </option>
                <option value="payment" className="text-card-foreground ">
                  Pagamento
                </option>
                <option value="fee" className="text-card-foreground ">
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
                  <strong>Saldo disponível:</strong>{' '}
                  {primaryAccount.balance.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">
              Transações Recentes
            </h2>

            {/* Botão para reprocessar transações pendentes */}
            {transactions &&
              transactions.some((t) => t.status === 'pending') && (
                <button
                  onClick={async () => {
                    await reprocessPendingTransactions()
                    // Atualizar saldo imediatamente após reprocessar todas as transações
                    await refreshBankAccounts()
                  }}
                  className="text-sm bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-md transition-colors"
                  title="Reprocessar transações pendentes"
                >
                  Reprocessar Pendentes
                </button>
              )}
          </div>

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
                        className={`w-10 h-10 ${getTransactionBgColor(transaction.transaction_type, isOutgoing)} rounded-full flex items-center justify-center relative`}
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

                        {/* Indicador de status */}
                        {transaction.status === 'pending' && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                        )}
                        {transaction.status === 'failed' && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                        )}
                        {transaction.status === 'completed' && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                        )}
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
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              transaction.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : transaction.status === 'completed'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : transaction.status === 'failed'
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                            }`}
                          >
                            {transaction.status === 'pending' && 'Pendente'}
                            {transaction.status === 'completed' && 'Concluída'}
                            {transaction.status === 'failed' && 'Falhou'}
                            {transaction.status === 'cancelled' && 'Cancelada'}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {transaction.description}
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

                    <div className="flex items-center gap-3">
                      <span
                        className={`font-medium ${getTransactionColor(transaction.transaction_type, isOutgoing)}`}
                      >
                        {isOutgoing ||
                        transaction.transaction_type === 'withdrawal' ||
                        transaction.transaction_type === 'payment' ||
                        transaction.transaction_type === 'fee'
                          ? '-'
                          : '+'}
                        {amount.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </span>

                      {/* Botões de ação para transações pendentes */}
                      {transaction.status === 'pending' && (
                        <div className="flex gap-1">
                          <button
                            onClick={async () => {
                              await processTransaction(
                                transaction.id,
                                'complete',
                              )
                              // Atualizar saldo imediatamente após processar transação
                              await refreshBankAccounts()
                            }}
                            className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded transition-colors"
                            title="Processar transação"
                          >
                            ✓
                          </button>
                          <button
                            onClick={async () => {
                              await processTransaction(
                                transaction.id,
                                'fail',
                                'Falha manual',
                              )
                              // Atualizar saldo imediatamente após processar transação
                              await refreshBankAccounts()
                            }}
                            className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded transition-colors"
                            title="Marcar como falhou"
                          >
                            ✗
                          </button>
                        </div>
                      )}
                    </div>
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
