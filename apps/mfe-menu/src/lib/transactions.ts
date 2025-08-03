import { httpClient } from './http-client'
import { authService } from './auth'

// Funções utilitárias para conversão monetária
export const MoneyUtils = {
  /**
   * Converte reais para centavos
   * @param reais Valor em reais (ex: 25.50)
   * @returns Valor em centavos (ex: 2550)
   */
  reaisToCents: (reais: number): number => {
    return Math.round(reais * 100)
  },

  /**
   * Converte centavos para reais
   * @param cents Valor em centavos (ex: 2550)
   * @returns Valor em reais (ex: 25.50)
   */
  centsToReais: (cents: number): number => {
    return cents / 100
  },

  /**
   * Formata valor em centavos para string em reais
   * @param cents Valor em centavos (ex: 2550)
   * @returns String formatada (ex: "R$ 25,50")
   */
  formatCents: (cents: number): string => {
    const reais = MoneyUtils.centsToReais(cents)
    return reais.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  },

  /**
   * Converte string de moeda para centavos
   * @param currencyString String como "R$ 25,50" ou "25,50"
   * @returns Valor em centavos (ex: 2550)
   */
  parseCurrencyToCents: (currencyString: string): number => {
    // Remove símbolos de moeda e espaços
    const cleanValue = currencyString
      .replace(/[R$\s]/g, '')
      .replace(/\./g, '') // Remove pontos (milhares)
      .replace(',', '.') // Converte vírgula para ponto decimal

    const reais = parseFloat(cleanValue)
    return isNaN(reais) ? 0 : MoneyUtils.reaisToCents(reais)
  },
}

// Tipos de dados
export interface Transaction {
  id: string
  from_account_id?: string
  to_account_id?: string
  user_id: string
  transaction_type: 'deposit' | 'withdrawal' | 'transfer' | 'payment' | 'fee'
  amount: number // Valor em centavos (ex: 2500 = R$ 25,00)
  currency: string
  description?: string
  reference_number?: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  processed_at?: string
  created_at: string
  updated_at: string
  metadata?: any
}

export interface CreateTransactionData {
  from_account_id?: string
  to_account_id?: string
  transaction_type: 'deposit' | 'withdrawal' | 'transfer' | 'payment' | 'fee'
  amount: number // Valor em centavos (ex: 2500 = R$ 25,00)
  description?: string
  metadata?: any
}

export interface BankAccount {
  id: string
  user_id: string
  account_number: string
  account_type: 'checking' | 'savings' | 'business'
  balance: number // Saldo em centavos (ex: 10000 = R$ 100,00)
  currency: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// Serviço de transações - responsabilidade única para operações de transação
export class TransactionService {
  /**
   * Lista todas as transações do usuário autenticado
   * @returns Transações com valores convertidos para reais
   */
  public async getTransactions(): Promise<Transaction[]> {
    const transactions = await httpClient.get<Transaction[]>('/transactions', {
      select: '*',
      order: 'created_at.desc',
    })

    // Converter valores de centavos para reais
    return transactions.map((transaction) => ({
      ...transaction,
      amount: MoneyUtils.centsToReais(transaction.amount),
    }))
  }

  /**
   * Busca uma transação específica por ID
   * @returns Transação com valor convertido para reais
   */
  public async getTransaction(id: string): Promise<Transaction> {
    const transactions = await httpClient.get<Transaction[]>('/transactions', {
      id: `eq.${id}`,
      select: '*',
    })

    if (!transactions || transactions.length === 0) {
      throw new Error('Transação não encontrada')
    }

    const transaction = transactions[0]

    // Converter valor de centavos para reais
    return {
      ...transaction,
      amount: MoneyUtils.centsToReais(transaction.amount),
    }
  }

  /**
   * Cria uma nova transação
   * @param data Dados da transação (amount deve ser em reais, será convertido para centavos)
   */
  public async createTransaction(
    data: CreateTransactionData,
  ): Promise<Transaction> {
    const userId = authService.getCurrentUserId()
    if (!userId) {
      throw new Error('Usuário não autenticado')
    }
    // Converter valor de reais para centavos antes de salvar
    const transactionData = {
      ...data,
      amount: MoneyUtils.reaisToCents(data.amount), // Converter para centavos
      user_id: userId,
      currency: 'BRL',
      status: 'completed' as const, // Transações são criadas como completed automaticamente
    }

    const transaction = await httpClient.post<Transaction>(
      '/transactions',
      transactionData,
      {
        returnRepresentation: true,
      },
    )

    // Converter valor de volta para reais na resposta
    return {
      ...transaction,
      amount: MoneyUtils.centsToReais(transaction.amount),
    }
  }

  /**
   * Edita uma transação existente
   * @param transactionId ID da transação a ser editada
   * @param data Dados atualizados da transação (amount deve ser em reais, será convertido para centavos)
   */
  public async updateTransaction(
    transactionId: string,
    data: Partial<CreateTransactionData>,
  ): Promise<Transaction> {
    const userId = authService.getCurrentUserId()
    if (!userId) {
      throw new Error('Usuário não autenticado')
    }

    // Preparar dados para atualização
    const updateData: any = { ...data }

    // Converter valor para centavos se fornecido
    if (data.amount !== undefined) {
      updateData.amount = MoneyUtils.reaisToCents(data.amount)
    }

    const transaction = await httpClient.put<Transaction>(
      `/transactions?id=eq.${transactionId}`,
      updateData,
    )

    // Converter valor de volta para reais na resposta
    return {
      ...transaction,
      amount: MoneyUtils.centsToReais(transaction.amount),
    }
  }

  /**
   * Exclui uma transação
   * @param transactionId ID da transação a ser excluída
   */
  public async deleteTransaction(transactionId: string): Promise<void> {
    try {
      const userId = authService.getCurrentUserId()
      if (!userId) {
        throw new Error('Usuário não autenticado')
      }

      // Verificar se a transação pertence ao usuário antes de excluir
      const transaction = await this.getTransaction(transactionId)
      if (!transaction) {
        throw new Error('Transação não encontrada')
      }

      // Fazer a exclusão
      await httpClient.delete(
        `/transactions?id=eq.${transactionId}&user_id=eq.${userId}`,
      )
    } catch (error) {
      console.error('Erro ao excluir transação:', error)
      throw error
    }
  }

  /**
   * Processa uma transação pendente (marca como completed ou failed)
   */
  public async processTransaction(
    transactionId: string,
    action: 'complete' | 'fail' = 'complete',
    reason?: string,
  ): Promise<{
    success: boolean
    status: string
    message: string
    processedAt: string
  }> {
    try {
      // Obter a URL base do projeto
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      if (!supabaseUrl) {
        throw new Error('URL do Supabase não configurada')
      }

      // Chamar a Edge Function
      const response = await fetch(
        `${supabaseUrl}/functions/v1/process-transaction`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authService.getAuthToken()}`,
          },
          body: JSON.stringify({
            transactionId,
            action,
            reason,
          }),
        },
      )

      if (!response.ok) {
        throw new Error(
          `Falha na requisição: ${response.status} ${response.statusText}`,
        )
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Erro ao processar transação:', error)
      throw new Error(
        `Falha ao processar transação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      )
    }
  }

  /**
   * Reprocessa transações pendentes (útil para casos de falha)
   */
  public async reprocessPendingTransactions(): Promise<void> {
    try {
      const pendingTransactions = await httpClient.get<Transaction[]>(
        '/transactions',
        {
          status: 'eq.pending',
          select: 'id',
        },
      )

      const processPromises = pendingTransactions.map((transaction) =>
        this.processTransaction(transaction.id).catch((error) => {
          console.error(
            `Erro ao reprocessar transação ${transaction.id}:`,
            error,
          )
          return null
        }),
      )

      await Promise.all(processPromises)
    } catch (error) {
      console.error('Erro ao reprocessar transações pendentes:', error)
      throw error
    }
  }
}

// Serviço de contas bancárias - responsabilidade única para operações de conta
export class BankAccountService {
  /**
   * Lista todas as contas bancárias ativas do usuário
   * @returns Contas com saldos convertidos para reais
   */
  public async getBankAccounts(): Promise<BankAccount[]> {
    const accounts = await httpClient.get<BankAccount[]>('/bank_accounts', {
      select: '*',
      is_active: 'eq.true',
      order: 'created_at.desc',
    })

    // Converter saldos de centavos para reais
    return accounts.map((account) => ({
      ...account,
      balance: MoneyUtils.centsToReais(account.balance),
    }))
  }

  /**
   * Obtém a conta bancária principal do usuário (primeira conta ativa)
   * @returns Conta com saldo convertido para reais
   */
  public async getPrimaryAccount(): Promise<BankAccount | null> {
    const accounts = await this.getBankAccounts()
    return accounts.length > 0 ? accounts[0] : null
  }

  /**
   * Busca uma conta pelo número
   * @returns Conta com saldo convertido para reais
   */
  public async getAccountByNumber(
    accountNumber: string,
  ): Promise<BankAccount | null> {
    const accounts = await httpClient.get<BankAccount[]>('/bank_accounts', {
      account_number: `eq.${accountNumber}`,
      is_active: 'eq.true',
      select: '*',
    })

    if (accounts.length === 0) {
      return null
    }

    const account = accounts[0]

    // Converter saldo de centavos para reais
    return {
      ...account,
      balance: MoneyUtils.centsToReais(account.balance),
    }
  }
}

// Exports das instâncias dos serviços
export const transactionService = new TransactionService()
export const bankAccountService = new BankAccountService()

// APIs mantidas para compatibilidade (deprecated - usar os serviços diretamente)
export const transactionsApi = {
  getTransactions: () => transactionService.getTransactions(),
  createTransaction: (data: CreateTransactionData) =>
    transactionService.createTransaction(data),
  getTransaction: (id: string) => transactionService.getTransaction(id),
  updateTransaction: (id: string, data: Partial<CreateTransactionData>) =>
    transactionService.updateTransaction(id, data),
  deleteTransaction: (id: string) => transactionService.deleteTransaction(id),
}

export const bankAccountsApi = {
  getBankAccounts: () => bankAccountService.getBankAccounts(),
  getPrimaryAccount: () => bankAccountService.getPrimaryAccount(),
}
