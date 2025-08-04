import React from 'react'
import { ExtractFilters, type FilterOptions } from './ExtractFilters'
import { useFilteredTransactions } from '../../hooks/useFilteredTransactions'
import type { Transaction, PaginationOptions } from '../../lib/transactions'

interface ExtractWithFiltersProps {
  userId: string
  pageSize?: number // Tamanho da página (padrão: 20)
}

export function ExtractWithFilters({
  userId,
  pageSize = 20,
}: ExtractWithFiltersProps) {
  const [filters, setFilters] = React.useState<FilterOptions>({
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

  const [currentPage, setCurrentPage] = React.useState(1)

  const pagination: PaginationOptions = {
    page: currentPage,
    pageSize,
  }

  // Usar o hook para buscar transações filtradas com paginação
  const {
    data: result,
    isLoading,
    error,
  } = useFilteredTransactions(filters, userId, pagination)

  const transactions = result?.data || []
  const paginationInfo = result?.pagination

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset para primeira página quando filtros mudam
  }

  const handleReset = () => {
    setFilters({
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
    setCurrentPage(1) // Reset para primeira página
  }

  const formatCurrency = (amountInCents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amountInCents / 100)
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-semibold">
            Erro ao carregar transações
          </h3>
          <p className="text-red-600">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <ExtractFilters
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      {/* Resultados */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              Transações
              {isLoading ? (
                <span className="text-sm text-gray-500 ml-2">
                  Carregando...
                </span>
              ) : (
                <span className="text-sm text-gray-500 ml-2">
                  ({transactions.length} de {paginationInfo?.total || 'muitas'}{' '}
                  encontrada
                  {(paginationInfo?.total || transactions.length) !== 1
                    ? 's'
                    : ''}
                  )
                </span>
              )}
            </h2>
            {paginationInfo && (
              <div className="text-sm text-gray-500">
                Página {paginationInfo.page} • {transactions.length} itens
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Carregando transações...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>Nenhuma transação encontrada com os filtros aplicados.</p>
          </div>
        ) : (
          <div className="divide-y">
            {transactions.map((transaction: Transaction) => (
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
                        {new Date(
                          transaction.created_at || '',
                        ).toLocaleDateString('pt-BR')}
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
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Controles de Paginação */}
        {paginationInfo &&
          (paginationInfo.hasNextPage || paginationInfo.hasPreviousPage) && (
            <div className="px-4 py-3 border-t bg-gray-50 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Mostrando {paginationInfo.from + 1} a {paginationInfo.to + 1} de{' '}
                {paginationInfo.total || 'muitos'} resultados
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!paginationInfo.hasPreviousPage}
                  className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Anterior
                </button>
                <span className="px-3 py-1 text-sm">
                  Página {paginationInfo.page}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!paginationInfo.hasNextPage}
                  className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Próxima
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  )
}

/*
Exemplo de uso:

import { ExtractWithFilters } from '../components/extrato/ExtractWithFilters'
import { useAuth } from '../hooks/useAuth'

export function ExtractPage() {
  const { user } = useAuth()
  
  if (!user) {
    return <div>Usuário não autenticado</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Extrato Bancário</h1>
      <ExtractWithFilters userId={user.id} pageSize={20} />
    </div>
  )
}
*/
