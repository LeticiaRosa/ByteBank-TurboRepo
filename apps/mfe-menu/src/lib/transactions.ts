import { httpClient } from './http-client'
import { authService } from './auth'
import type { FilterOptions } from '../components/extrato/ExtractFilters'

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
export type TransactionCategory =
  | 'alimentacao'
  | 'transporte'
  | 'saude'
  | 'educacao'
  | 'entretenimento'
  | 'compras'
  | 'casa'
  | 'trabalho'
  | 'investimentos'
  | 'viagem'
  | 'outros'

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
  category: TransactionCategory
  sender_name?: string
  receipt_url?: string // URL do comprovante de pagamento
}

export interface CreateTransactionData {
  from_account_id?: string
  to_account_id?: string
  transaction_type: 'deposit' | 'withdrawal' | 'transfer' | 'payment' | 'fee'
  amount: number // Valor em centavos (ex: 2500 = R$ 25,00)
  description?: string
  metadata?: any
  category?: TransactionCategory
  sender_name?: string
  receipt_file?: File // Arquivo de comprovante (opcional)
}

export interface PaginationOptions {
  page?: number // Página atual (começa em 1)
  pageSize?: number // Tamanho da página
  from?: number // Índice inicial (usado com to)
  to?: number // Índice final (usado com from)
}

export interface PaginatedResult<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total?: number
    from: number
    to: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

/**
 * Busca transações com filtros aplicados e paginação
 * @param filters - Objeto com filtros aplicados
 * @param userId - ID do usuário para filtrar transações
 * @param pagination - Opções de paginação
 * @returns Lista de transações filtradas com informações de paginação
 */
export async function getFilteredTransactions(
  filters: FilterOptions,
  userId: string,
  pagination?: PaginationOptions,
): Promise<PaginatedResult<Transaction>> {
  try {
    // Configuração padrão de paginação
    const defaultPageSize = 20
    const page = pagination?.page ?? 1
    const pageSize = pagination?.pageSize ?? defaultPageSize

    // Calcular range baseado na página ou usar from/to fornecidos
    let from: number, to: number
    if (pagination?.from !== undefined && pagination?.to !== undefined) {
      from = pagination.from
      to = pagination.to
    } else {
      from = (page - 1) * pageSize
      to = from + pageSize - 1
    }

    // Construir parâmetros de query baseados nos filtros
    const params: Record<string, string> = {
      user_id: `eq.${userId}`,
      select: '*',
    }

    // Aplicar paginação usando limit e offset
    // Equivalente a: .range(from, to) mas usando PostgREST limit/offset syntax
    params['limit'] = pageSize.toString()
    params['offset'] = from.toString()

    // Filtro por período - usar and para combinar filtros de data
    if (filters.dateFrom && filters.dateTo) {
      params['created_at'] =
        `gte.${filters.dateFrom}T00:00:00.000Z&created_at=lte.${filters.dateTo}T23:59:59.999Z`
    } else if (filters.dateFrom) {
      params['created_at'] = `gte.${filters.dateFrom}T00:00:00.000Z`
    } else if (filters.dateTo) {
      params['created_at'] = `lte.${filters.dateTo}T23:59:59.999Z`
    }

    // Filtro por tipo de transação
    if (
      filters.transactionType &&
      filters.transactionType !== 'all' &&
      filters.transactionType.trim() !== ''
    ) {
      params['transaction_type'] = `eq.${filters.transactionType}`
    }

    // Filtro por status
    if (
      filters.status &&
      filters.status !== 'all' &&
      filters.status.trim() !== ''
    ) {
      params['status'] = `eq.${filters.status}`
    }

    // Filtro por categoria
    if (
      filters.category &&
      filters.category !== 'all' &&
      filters.category.trim() !== ''
    ) {
      params['category'] = `eq.${filters.category}`
    }

    // Filtro por valor - usar and para combinar filtros de valor
    if (
      filters.minAmount &&
      filters.minAmount.trim() !== '' &&
      filters.maxAmount &&
      filters.maxAmount.trim() !== ''
    ) {
      const minAmountCents = Math.round(parseFloat(filters.minAmount) * 100)
      const maxAmountCents = Math.round(parseFloat(filters.maxAmount) * 100)
      params['amount'] = `gte.${minAmountCents}&amount=lte.${maxAmountCents}`
    } else if (filters.minAmount && filters.minAmount.trim() !== '') {
      const minAmountCents = Math.round(parseFloat(filters.minAmount) * 100)
      params['amount'] = `gte.${minAmountCents}`
    } else if (filters.maxAmount && filters.maxAmount.trim() !== '') {
      const maxAmountCents = Math.round(parseFloat(filters.maxAmount) * 100)
      params['amount'] = `lte.${maxAmountCents}`
    }

    // Filtro por descrição (busca textual case-insensitive)
    if (filters.description && filters.description.trim() !== '') {
      params['description'] = `ilike.%${filters.description}%`
    }

    // Filtro por nome do remetente (busca textual case-insensitive)
    if (filters.senderName && filters.senderName.trim() !== '') {
      params['sender_name'] = `ilike.%${filters.senderName}%`
    }

    // Ordenar por data de criação (mais recente primeiro)
    params['order'] = 'created_at.desc'

    // Fazer a requisição usando o httpClient
    const transactions = await httpClient.get<Transaction[]>(
      '/transactions',
      params,
    )

    // Para obter o total de registros, fazer uma query separada com count
    // Reutilizar os mesmos filtros, mas sem paginação, ordem e select
    const countParams = { ...params }
    delete countParams['limit']
    delete countParams['offset']
    delete countParams['order']
    delete countParams['select']
    countParams['select'] = 'count'

    let total: number | undefined
    try {
      const countResult = await httpClient.get<Array<{ count: number }>>(
        '/transactions',
        countParams,
      )
      total = countResult?.[0]?.count ?? 0
    } catch (error) {
      console.warn('Erro ao obter contagem total:', error)
      // Se não conseguir obter o total, continue sem ele
    }

    // Preparar resultado paginado
    const result: PaginatedResult<Transaction> = {
      data: transactions || [],
      pagination: {
        page,
        pageSize,
        total,
        from,
        to: Math.min(to, from + (transactions?.length ?? 0) - 1),
        hasNextPage: total
          ? to < total - 1
          : (transactions?.length ?? 0) === pageSize,
        hasPreviousPage: from > 0,
      },
    }

    return result
  } catch (error) {
    console.error('Erro ao buscar transações filtradas:', error)
    throw new Error('Erro ao carregar transações')
  }
}

/**
 * Função auxiliar para construir query complexa usando sintaxe similar ao Supabase JS SDK
 * Exemplo de uso equivalente ao:
 * const { data, error } = await supabase
 *   .from('transactions')
 *   .select('*')
 *   .eq('user_id', userId)
 *   .gte('created_at', dateFrom)
 *   .lte('created_at', dateTo)
 *   .eq('category', 'alimentacao')
 *   .range(0, 19) // Convertido para limit=20&offset=0
 *   .order('created_at', { ascending: false })
 */
export async function queryTransactions(
  userId: string,
  options?: {
    select?: string
    eq?: Record<string, any>
    gte?: Record<string, any>
    lte?: Record<string, any>
    like?: Record<string, string>
    ilike?: Record<string, string>
    order?: { column: string; ascending?: boolean }
    limit?: number
    range?: { from: number; to: number } // Paginação usando range
  },
): Promise<Transaction[]> {
  try {
    const params: Record<string, string> = {
      user_id: `eq.${userId}`,
    }

    // Select fields
    if (options?.select) {
      params['select'] = options.select
    } else {
      params['select'] = '*'
    }

    // Equal filters
    if (options?.eq) {
      Object.entries(options.eq).forEach(([key, value]) => {
        params[key] = `eq.${value}`
      })
    }

    // Greater than or equal filters
    if (options?.gte) {
      Object.entries(options.gte).forEach(([key, value]) => {
        params[key] = `gte.${value}`
      })
    }

    // Less than or equal filters
    if (options?.lte) {
      Object.entries(options.lte).forEach(([key, value]) => {
        if (params[key]) {
          params[key] = `${params[key]}&${key}=lte.${value}`
        } else {
          params[key] = `lte.${value}`
        }
      })
    }

    // Like filters (case-sensitive)
    if (options?.like) {
      Object.entries(options.like).forEach(([key, value]) => {
        params[key] = `like.%${value}%`
      })
    }

    // iLike filters (case-insensitive)
    if (options?.ilike) {
      Object.entries(options.ilike).forEach(([key, value]) => {
        params[key] = `ilike.%${value}%`
      })
    }

    // Range (paginação) - tem precedência sobre limit
    if (options?.range) {
      const pageSize = options.range.to - options.range.from + 1
      params['limit'] = pageSize.toString()
      params['offset'] = options.range.from.toString()
    } else if (options?.limit) {
      // Limit - equivalente a .limit(n)
      params['limit'] = options.limit.toString()
    }

    // Order
    if (options?.order) {
      const direction = options.order.ascending === false ? 'desc' : 'asc'
      params['order'] = `${options.order.column}.${direction}`
    } else {
      // Default order by created_at desc
      params['order'] = 'created_at.desc'
    }

    const transactions = await httpClient.get<Transaction[]>(
      '/transactions',
      params,
    )
    return transactions || []
  } catch (error) {
    console.error('Erro ao buscar transações:', error)
    throw new Error('Erro ao carregar transações')
  }
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
   * Lista transações do usuário autenticado com limitação
   * @returns Transações com valores convertidos para reais
   */
  public async getTransactions(): Promise<Transaction[]> {
    const userId = authService.getCurrentUserId()
    if (!userId) {
      throw new Error('Usuário não autenticado')
    }

    const transactions = await httpClient.get<Transaction[]>('/transactions', {
      select: '*',
      user_id: `eq.${userId}`, // FILTRO CRÍTICO: apenas transações do usuário
      order: 'created_at.desc',
      limit: '50', // Limitar a 50 transações recentes para performance
    })

    // Converter valores de centavos para reais
    return transactions.map((transaction) => ({
      ...transaction,
      amount: MoneyUtils.centsToReais(transaction.amount),
    }))
  }

  /**
   * Busca uma transação específica por ID do usuário autenticado
   * @returns Transação com valor convertido para reais
   */
  public async getTransaction(id: string): Promise<Transaction> {
    const userId = authService.getCurrentUserId()
    if (!userId) {
      throw new Error('Usuário não autenticado')
    }

    const transactions = await httpClient.get<Transaction[]>('/transactions', {
      id: `eq.${id}`,
      user_id: `eq.${userId}`, // FILTRO CRÍTICO: apenas transações do usuário
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

    // Extrair arquivo de comprovante dos dados
    const { receipt_file, ...transactionPayload } = data

    // Converter valor de reais para centavos antes de salvar
    const transactionData = {
      ...transactionPayload,
      amount: MoneyUtils.reaisToCents(data.amount), // Converter para centavos
      user_id: userId,
      currency: 'BRL',
      status: 'completed' as const, // Transações são criadas como completed automaticamente
    }

    // Criar a transação primeiro
    const transaction = await httpClient.post<Transaction>(
      '/transactions',
      transactionData,
      {
        returnRepresentation: true,
      },
    )

    // Se há um arquivo de comprovante, fazer upload
    let finalTransaction = transaction
    if (receipt_file) {
      try {
        const { uploadReceipt } = await import('./file-upload')
        const { url: receiptUrl, error: uploadError } = await uploadReceipt(
          receipt_file,
          transaction.id,
          userId,
        )

        if (uploadError) {
          console.error('Erro no upload do comprovante:', uploadError)
          // Não falhar a transação por erro no upload, apenas log
        } else if (receiptUrl) {
          // Atualizar a transação com a URL do comprovante
          const updatedTransaction = await httpClient.patch<Transaction>(
            `/transactions?id=eq.${transaction.id}`,
            { receipt_url: receiptUrl },
            {
              returnRepresentation: true,
            },
          )
          finalTransaction = Array.isArray(updatedTransaction)
            ? updatedTransaction[0]
            : updatedTransaction
        }
      } catch (uploadError) {
        console.error('Erro no processo de upload:', uploadError)
        // Não falhar a transação por erro no upload
      }
    }

    // Converter valor de volta para reais na resposta
    return {
      ...finalTransaction,
      amount: MoneyUtils.centsToReais(finalTransaction.amount),
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

    // Extrair arquivo de comprovante dos dados
    const { receipt_file, ...transactionPayload } = data

    // Preparar dados para atualização
    const updateData: any = { ...transactionPayload }

    // Converter valor para centavos se fornecido
    if (data.amount !== undefined) {
      updateData.amount = MoneyUtils.reaisToCents(data.amount)
    }

    // Atualizar a transação primeiro
    const transaction = await httpClient.patch<Transaction>(
      `/transactions?id=eq.${transactionId}&user_id=eq.${userId}`,
      updateData,
      {
        returnRepresentation: true,
      },
    )

    let finalTransaction = Array.isArray(transaction)
      ? transaction[0]
      : transaction

    // Se há um arquivo de comprovante, fazer upload
    if (receipt_file) {
      try {
        const { uploadReceipt } = await import('./file-upload')
        const { url: receiptUrl, error: uploadError } = await uploadReceipt(
          receipt_file,
          transactionId,
          userId,
        )

        if (uploadError) {
          console.error('Erro no upload do comprovante:', uploadError)
          // Não falhar a atualização por erro no upload, apenas log
        } else if (receiptUrl) {
          // Atualizar a transação com a URL do comprovante
          const updatedTransaction = await httpClient.patch<Transaction>(
            `/transactions?id=eq.${transactionId}&user_id=eq.${userId}`,
            { receipt_url: receiptUrl },
            {
              returnRepresentation: true,
            },
          )
          finalTransaction = Array.isArray(updatedTransaction)
            ? updatedTransaction[0]
            : updatedTransaction
        }
      } catch (uploadError) {
        console.error('Erro no processo de upload:', uploadError)
        // Não falhar a atualização por erro no upload
      }
    }

    // Converter valor de volta para reais na resposta
    return {
      ...finalTransaction,
      amount: MoneyUtils.centsToReais(finalTransaction.amount),
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
   * Reprocessa transações pendentes do usuário autenticado
   */
  public async reprocessPendingTransactions(): Promise<void> {
    try {
      const userId = authService.getCurrentUserId()
      if (!userId) {
        throw new Error('Usuário não autenticado')
      }

      const pendingTransactions = await httpClient.get<Transaction[]>(
        '/transactions',
        {
          status: 'eq.pending',
          user_id: `eq.${userId}`, // FILTRO CRÍTICO: apenas transações do usuário
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
   * Lista todas as contas bancárias ativas do usuário autenticado
   * @returns Contas com saldos convertidos para reais
   */
  public async getBankAccounts(): Promise<BankAccount[]> {
    const userId = authService.getCurrentUserId()
    if (!userId) {
      throw new Error('Usuário não autenticado')
    }

    const accounts = await httpClient.get<BankAccount[]>('/bank_accounts', {
      select: '*',
      user_id: `eq.${userId}`, // FILTRO CRÍTICO: apenas contas do usuário
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
   * Busca uma conta pelo número do usuário autenticado
   * @returns Conta com saldo convertido para reais
   */
  public async getAccountByNumber(
    accountNumber: string,
  ): Promise<BankAccount | null> {
    const userId = authService.getCurrentUserId()
    if (!userId) {
      throw new Error('Usuário não autenticado')
    }

    const accounts = await httpClient.get<BankAccount[]>('/bank_accounts', {
      account_number: `eq.${accountNumber}`,
      user_id: `eq.${userId}`, // FILTRO CRÍTICO: apenas contas do usuário
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
