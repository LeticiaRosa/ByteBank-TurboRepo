import React, { useEffect, useState } from 'react'
import { ExtractFilters, type FilterOptions } from './ExtractFilters'
import {
  getFilteredTransactions,
  queryTransactions,
  type Transaction,
} from '../../lib/transactions'

// Exemplo prático de como usar os filtros com sintaxe similar ao Supabase

interface ExtractPageExampleProps {
  userId: string
}

export function ExtractPageExample({ userId }: ExtractPageExampleProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    dateFrom: '',
    dateTo: '',
    transactionType: 'all',
    status: 'all',
    minAmount: '',
    maxAmount: '',
    description: '',
    category: 'all',
    senderName: '',
  })

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Função para aplicar filtros usando getFilteredTransactions
  const applyFilters = async (newFilters: FilterOptions) => {
    setLoading(true)
    setError(null)

    try {
      // Usar a função de filtros integrada
      const result = await getFilteredTransactions(newFilters, userId)
      setTransactions(result)
    } catch (err) {
      setError('Erro ao carregar transações')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Exemplos de queries personalizadas usando queryTransactions
  const loadSpecificQueries = async () => {
    try {
      // 1. Equivalente a: supabase.from('transactions').eq('category', 'teste')
      const testTransactions = await queryTransactions(userId, {
        eq: { category: 'teste' },
      })
      console.log('Transações de teste:', testTransactions)

      // 2. Equivalente a: supabase.from('transactions').eq('category', 'alimentacao').gte('amount', 5000)
      const expensiveFoodTransactions = await queryTransactions(userId, {
        eq: { category: 'alimentacao' },
        gte: { amount: 5000 }, // Maior que R$ 50,00 (em centavos)
      })
      console.log(
        'Transações de alimentação acima de R$ 50:',
        expensiveFoodTransactions,
      )

      // 3. Query complexa - equivalente ao Supabase SDK:
      // const { data, error } = await supabase
      //   .from('transactions')
      //   .eq('status', 'completed')
      //   .gte('created_at', '2024-01-01T00:00:00.000Z')
      //   .lte('created_at', '2024-12-31T23:59:59.999Z')
      //   .ilike('description', '%salário%')
      //   .order('created_at', { ascending: false })
      //   .limit(10)
      const salaryTransactions = await queryTransactions(userId, {
        eq: { status: 'completed' },
        gte: { created_at: '2024-01-01T00:00:00.000Z' },
        lte: { created_at: '2024-12-31T23:59:59.999Z' },
        ilike: { description: 'salário' },
        order: { column: 'created_at', ascending: false },
        limit: 10,
      })
      console.log(
        'Últimas 10 transações de salário em 2024:',
        salaryTransactions,
      )

      // 4. Buscar transferências pendentes
      const pendingTransfers = await queryTransactions(userId, {
        eq: {
          transaction_type: 'transfer',
          status: 'pending',
        },
        order: { column: 'created_at', ascending: false },
      })
      console.log('Transferências pendentes:', pendingTransfers)
    } catch (error) {
      console.error('Erro nas queries personalizadas:', error)
    }
  }

  // Aplicar filtros quando eles mudarem
  useEffect(() => {
    applyFilters(filters)
  }, [filters, userId])

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters)
  }

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      dateFrom: '',
      dateTo: '',
      transactionType: 'all',
      status: 'all',
      minAmount: '',
      maxAmount: '',
      description: '',
      category: 'all',
      senderName: '',
    }
    setFilters(resetFilters)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Extrato Bancário</h1>

        {/* Botão para testar queries personalizadas */}
        <div className="mb-4">
          <button
            onClick={loadSpecificQueries}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Testar Queries Personalizadas (ver console)
          </button>
        </div>

        {/* Componente de filtros */}
        <ExtractFilters
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />
      </div>

      {/* Resultados */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">
            Transações Filtradas
            {!loading && (
              <span className="text-sm text-gray-500 ml-2">
                ({transactions.length} encontrada
                {transactions.length !== 1 ? 's' : ''})
              </span>
            )}
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Carregando transações...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>Nenhuma transação encontrada com os filtros aplicados.</p>
          </div>
        ) : (
          <div className="divide-y">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium capitalize">
                        {transaction.transaction_type}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : transaction.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : transaction.status === 'failed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </div>
                    <p className="text-gray-900 font-medium mt-1">
                      {transaction.description || 'Sem descrição'}
                    </p>
                    {transaction.sender_name && (
                      <p className="text-sm text-gray-500">
                        De: {transaction.sender_name}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>Categoria: {transaction.category || 'Outros'}</span>
                      <span>
                        {new Date(transaction.created_at).toLocaleDateString(
                          'pt-BR',
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-lg font-semibold ${
                        transaction.transaction_type === 'deposit'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {transaction.transaction_type === 'deposit' ? '+' : '-'}
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(transaction.amount / 100)}{' '}
                      {/* Valor em centavos */}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/*
EXEMPLOS DE USO DAS FUNÇÕES DE FILTRO:

1. Filtro simples por categoria (equivalente ao Supabase):
   
   // Supabase SDK:
   const { data, error } = await supabase
     .from('transactions')
     .eq('category', 'teste')
   
   // Nossa implementação:
   const transactions = await queryTransactions(userId, {
     eq: { category: 'teste' }
   })

2. Filtro por múltiplos campos:
   
   // Supabase SDK:
   const { data, error } = await supabase
     .from('transactions')
     .eq('category', 'alimentacao')
     .eq('status', 'completed')
     .gte('amount', 1000)
   
   // Nossa implementação:
   const transactions = await queryTransactions(userId, {
     eq: { category: 'alimentacao', status: 'completed' },
     gte: { amount: 1000 }
   })

3. Filtro com range de datas:
   
   // Supabase SDK:
   const { data, error } = await supabase
     .from('transactions')
     .gte('created_at', '2024-01-01T00:00:00.000Z')
     .lte('created_at', '2024-12-31T23:59:59.999Z')
   
   // Nossa implementação:
   const transactions = await queryTransactions(userId, {
     gte: { created_at: '2024-01-01T00:00:00.000Z' },
     lte: { created_at: '2024-12-31T23:59:59.999Z' }
   })

4. Busca textual case-insensitive:
   
   // Supabase SDK:
   const { data, error } = await supabase
     .from('transactions')
     .ilike('description', '%mercado%')
   
   // Nossa implementação:
   const transactions = await queryTransactions(userId, {
     ilike: { description: 'mercado' }
   })

5. Ordenação e limite:
   
   // Supabase SDK:
   const { data, error } = await supabase
     .from('transactions')
     .order('created_at', { ascending: false })
     .limit(10)
   
   // Nossa implementação:
   const transactions = await queryTransactions(userId, {
     order: { column: 'created_at', ascending: false },
     limit: 10
   })
*/
