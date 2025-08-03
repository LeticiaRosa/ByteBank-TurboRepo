import { httpClient } from './http-client'
import { authService } from './auth'

// Tipos de dados
export interface Transaction {
  id: string
  from_account_id?: string
  to_account_id?: string
  user_id: string
  transaction_type: 'deposit' | 'withdrawal' | 'transfer' | 'payment' | 'fee'
  amount: number
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
  amount: number
  description?: string
  metadata?: any
}

export interface BankAccount {
  id: string
  user_id: string
  account_number: string
  account_type: 'checking' | 'savings' | 'business'
  balance: number
  currency: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// Serviço de transações - responsabilidade única para operações de transação
export class TransactionService {
  /**
   * Lista todas as transações do usuário autenticado
   */
  public async getTransactions(): Promise<Transaction[]> {
    return httpClient.get<Transaction[]>('/transactions', {
      select: '*',
      order: 'created_at.desc',
    })
  }

  /**
   * Busca uma transação específica por ID
   */
  public async getTransaction(id: string): Promise<Transaction> {
    const transactions = await httpClient.get<Transaction[]>('/transactions', {
      id: `eq.${id}`,
      select: '*',
    })

    if (!transactions || transactions.length === 0) {
      throw new Error('Transação não encontrada')
    }

    return transactions[0]
  }

  /**
   * Cria uma nova transação
   */
  public async createTransaction(
    data: CreateTransactionData,
  ): Promise<Transaction> {
    const userId = authService.getCurrentUserId()
    if (!userId) {
      throw new Error('Usuário não autenticado')
    }

    const transactionData = {
      ...data,
      user_id: userId,
      currency: 'BRL',
      status: 'pending' as const,
    }

    return httpClient.post<Transaction>('/transactions', transactionData, {
      returnRepresentation: true,
    })
  }
}

// Serviço de contas bancárias - responsabilidade única para operações de conta
export class BankAccountService {
  /**
   * Lista todas as contas bancárias ativas do usuário
   */
  public async getBankAccounts(): Promise<BankAccount[]> {
    return httpClient.get<BankAccount[]>('/bank_accounts', {
      select: '*',
      is_active: 'eq.true',
      order: 'created_at.desc',
    })
  }

  /**
   * Obtém a conta bancária principal do usuário (primeira conta ativa)
   */
  public async getPrimaryAccount(): Promise<BankAccount | null> {
    const accounts = await this.getBankAccounts()
    return accounts.length > 0 ? accounts[0] : null
  }

  /**
   * Busca uma conta pelo número
   */
  public async getAccountByNumber(
    accountNumber: string,
  ): Promise<BankAccount | null> {
    const accounts = await httpClient.get<BankAccount[]>('/bank_accounts', {
      account_number: `eq.${accountNumber}`,
      is_active: 'eq.true',
      select: '*',
    })

    return accounts.length > 0 ? accounts[0] : null
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
}

export const bankAccountsApi = {
  getBankAccounts: () => bankAccountService.getBankAccounts(),
  getPrimaryAccount: () => bankAccountService.getPrimaryAccount(),
}
