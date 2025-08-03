import React, { useState, useEffect } from 'react'
import { useToast, Button } from '@bytebank/ui'
import {
  type CreateTransactionData,
  type BankAccount,
  type Transaction,
} from '../../hooks'
import { MoneyUtils } from '../../lib/transactions'

interface TransactionFormData {
  transaction_type: 'deposit' | 'withdrawal' | 'transfer' | 'payment' | 'fee'
  amount: string
  description: string
  to_account_number?: string
}

interface NewTransactionFormProps {
  primaryAccount: BankAccount | null | undefined
  bankAccounts: BankAccount[] | undefined
  isCreating: boolean
  onCreateTransaction: (data: CreateTransactionData) => Promise<any>
  // Props para modo de edição
  isEditing?: boolean
  editingTransaction?: Transaction | null
  isUpdating?: boolean
  onUpdateTransaction?: (
    transactionId: string,
    data: Partial<CreateTransactionData>,
  ) => Promise<any>
  onCancelEdit?: () => void
}

export function NewTransactionForm({
  primaryAccount,
  bankAccounts,
  isCreating,
  onCreateTransaction,
  isEditing = false,
  editingTransaction = null,
  isUpdating = false,
  onUpdateTransaction,
  onCancelEdit,
}: NewTransactionFormProps) {
  const toast = useToast()

  // Função para encontrar conta por ID (para modo de edição)
  const findAccountById = (accountId?: string) => {
    if (!accountId) return null
    return bankAccounts?.find((account) => account.id === accountId)
  }

  // Função para inicializar dados do formulário
  const getInitialFormData = (): TransactionFormData => {
    if (isEditing && editingTransaction) {
      // Encontrar conta de destino para obter o número
      const toAccount = findAccountById(editingTransaction.to_account_id)

      return {
        transaction_type: editingTransaction.transaction_type,
        amount: editingTransaction.amount.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        description: editingTransaction.description || '',
        to_account_number: toAccount?.account_number || '',
      }
    }

    return {
      transaction_type: 'deposit',
      amount: '',
      description: '',
      to_account_number: '',
    }
  }

  // Estado do formulário
  const [formData, setFormData] =
    useState<TransactionFormData>(getInitialFormData())

  const [errors, setErrors] = useState<Partial<TransactionFormData>>({})

  // Efeito para atualizar formulário quando transação em edição mudar
  useEffect(() => {
    setFormData(getInitialFormData())
    setErrors({}) // Limpar erros ao trocar de transação
  }, [editingTransaction, isEditing])
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
      const amountInCents = MoneyUtils.parseCurrencyToCents(formData.amount)
      const amount = MoneyUtils.centsToReais(amountInCents)

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

      if (isEditing && editingTransaction && onUpdateTransaction) {
        // Modo de edição - atualizar transação existente
        await onUpdateTransaction(editingTransaction.id, transactionData)

        // Chamar callback de cancelar edição para voltar ao modo normal
        if (onCancelEdit) {
          onCancelEdit()
        }
      } else {
        // Modo de criação - criar nova transação
        await onCreateTransaction(transactionData)

        // Limpar formulário após sucesso
        setFormData({
          transaction_type: 'deposit',
          amount: '',
          description: '',
          to_account_number: '',
        })
        setErrors({})
      }
    } catch (error) {
      console.error('Erro ao processar transação:', error)
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

  return (
    <div
      className={`bg-card rounded-lg shadow-sm border p-6 ${isEditing ? 'border-blue-200 dark:border-blue-800' : ''}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">
          {isEditing ? 'Editar Transação' : 'Nova Transação'}
        </h2>

        {/* Botão para cancelar edição */}
        {isEditing && onCancelEdit && (
          <Button
            type="button"
            onClick={onCancelEdit}
            variant="ghost"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancelar
          </Button>
        )}
      </div>

      {/* Indicador de modo de edição */}
      {isEditing && editingTransaction && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Editando transação:</strong>{' '}
            {editingTransaction.id.slice(-8)}
          </p>
        </div>
      )}

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
            className="w-full pl-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-card-foreground bg-card"
          >
            <option value="deposit" className="text-card-foreground">
              Depósito
            </option>
            <option value="withdrawal" className="text-card-foreground">
              Saque
            </option>
            <option value="transfer" className="text-card-foreground">
              Transferência
            </option>
            <option value="payment" className="text-card-foreground">
              Pagamento
            </option>
            <option value="fee" className="text-card-foreground">
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
            onChange={(e) => handleInputChange('description', e.target.value)}
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
              <strong>Conta de origem:</strong> {primaryAccount.account_number}
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

        <Button
          type="submit"
          disabled={isCreating || isUpdating}
          className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating || isUpdating
            ? 'Processando...'
            : isEditing
              ? 'Atualizar Transação'
              : 'Efetuar Transação'}
        </Button>
      </form>
    </div>
  )
}
