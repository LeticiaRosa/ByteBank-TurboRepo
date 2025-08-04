import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  useToast,
} from '@bytebank/ui'
import { useTransactions, type Transaction } from '../hooks'
import { AccountInfos } from '../components'
import {
  TransactionItem,
  ExtractFilters,
  type FilterOptions,
} from '../components/extrato'

export const Route = createFileRoute('/extrato')({
  component: ExtractPage,
})

function ExtractPage() {
  const {
    transactions,
    isLoadingTransactions,
    deleteTransaction,
    processTransaction,
  } = useTransactions()

  const toast = useToast()

  const [filters, setFilters] = useState<FilterOptions>({
    dateFrom: '',
    dateTo: '',
    transactionType: '',
    status: '',
    minAmount: '',
    maxAmount: '',
    description: '',
    category: '',
    senderName: '',
  })

  // Funções de callback para o menu de ações
  const handleEditTransaction = async (transaction: Transaction) => {
    // Por enquanto, apenas mostra um toast
    toast.info('Editar transação', {
      description: `Edição da transação ${transaction.id.slice(-8)} será implementada em breve`,
      duration: 3000,
    })
  }

  const handleDeleteTransaction = async (transactionId: string) => {
    try {
      await deleteTransaction(transactionId)
      toast.success('Transação excluída', {
        description: 'A transação foi excluída com sucesso',
        duration: 3000,
      })
    } catch (error) {
      toast.error('Erro ao excluir', {
        description: 'Não foi possível excluir a transação',
        duration: 5000,
      })
    }
  }

  const handleProcessTransaction = async (
    transactionId: string,
    action: 'complete' | 'fail',
  ) => {
    try {
      await processTransaction(transactionId, action)
      toast.success('Transação processada', {
        description: `Transação ${action === 'complete' ? 'concluída' : 'marcada como falha'} com sucesso`,
        duration: 3000,
      })
    } catch (error) {
      toast.error('Erro ao processar', {
        description: 'Não foi possível processar a transação',
        duration: 5000,
      })
    }
  }

  // Função para criar data sem problemas de fuso horário
  const parseDate = (dateString: string): Date | null => {
    try {
      const [year, month, day] = dateString.split('-').map(Number)
      if (year && month && day) {
        return new Date(year, month - 1, day) // month is 0-indexed
      }
    } catch {
      // fallback
    }
    return null
  }

  // Filtrar transações baseado nos filtros aplicados
  const filteredTransactions = useMemo(() => {
    if (!transactions) return []

    return transactions.filter((transaction) => {
      // Filtro por data
      if (filters.dateFrom) {
        const transactionDate = new Date(transaction.created_at)
        const fromDate = parseDate(filters.dateFrom)
        if (!fromDate || transactionDate < fromDate) return false
      }

      if (filters.dateTo) {
        const transactionDate = new Date(transaction.created_at)
        const toDate = parseDate(filters.dateTo)
        if (toDate) {
          toDate.setHours(23, 59, 59, 999) // Final do dia no fuso horário local
          console.log('Transaction Date:', transaction.created_at)
          console.log('To Date:', toDate.toISOString())
          if (transactionDate > toDate) return false
        }
      }

      // Filtro por tipo
      if (
        filters.transactionType !== 'all' &&
        filters.transactionType &&
        transaction.transaction_type !== filters.transactionType
      ) {
        return false
      }

      // Filtro por status
      if (
        filters.status !== 'all' &&
        filters.status &&
        transaction.status !== filters.status
      ) {
        return false
      }

      // Filtro por valor mínimo
      if (filters.minAmount) {
        const minAmount = parseFloat(filters.minAmount)
        if (transaction.amount < minAmount) return false
      }

      // Filtro por valor máximo
      if (filters.maxAmount) {
        const maxAmount = parseFloat(filters.maxAmount)
        if (transaction.amount > maxAmount) return false
      }

      // Filtro por descrição
      if (filters.description) {
        const description = transaction.description?.toLowerCase() || ''
        const filterDescription = filters.description.toLowerCase()
        if (!description.includes(filterDescription)) return false
      }

      // Filtro por categoria
      if (
        filters.category !== 'all' &&
        filters.category &&
        transaction.category !== filters.category
      ) {
        return false
      }

      // Filtro por remetente
      if (filters.senderName) {
        const senderName = transaction.sender_name?.toLowerCase() || ''
        const filterSenderName = filters.senderName.toLowerCase()
        if (!senderName.includes(filterSenderName)) return false
      }

      return true
    })
  }, [transactions, filters])

  // Calcular estatísticas do período filtrado
  const periodStats = useMemo(() => {
    const totalTransactions = filteredTransactions.length
    const totalIncome = filteredTransactions
      .filter((t) => t.transaction_type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = filteredTransactions
      .filter((t) =>
        ['withdrawal', 'payment', 'fee', 'transfer'].includes(
          t.transaction_type,
        ),
      )
      .reduce((sum, t) => sum + t.amount, 0)

    const balance = totalIncome - totalExpenses

    return {
      totalTransactions,
      totalIncome,
      totalExpenses,
      balance,
    }
  }, [filteredTransactions])

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters)
  }

  const handleResetFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      transactionType: '',
      status: '',
      minAmount: '',
      maxAmount: '',
      description: '',
      category: '',
      senderName: '',
    })
  }

  const exportToCSV = () => {
    if (!filteredTransactions.length) return

    const headers = [
      'Data',
      'Tipo',
      'Descrição',
      'Valor',
      'Status',
      'Referência',
    ]
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map((transaction) =>
        [
          new Date(transaction.created_at).toLocaleDateString('pt-BR'),
          transaction.transaction_type,
          `"${transaction.description || ''}"`,
          transaction.amount.toString().replace('.', ','),
          transaction.status,
          transaction.reference_number || '',
        ].join(','),
      ),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute(
      'download',
      `extrato_${new Date().toISOString().split('T')[0]}.csv`,
    )
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Extrato</h1>
          <p className="text-muted-foreground">
            Acompanhe todas as suas transações financeiras
          </p>
        </div>
      </div>

      {/* Estatísticas do período */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AccountInfos
          title="Total de Transações"
          text="No período selecionado"
          isLoadingAccounts={isLoadingTransactions || !periodStats}
          amount={periodStats?.totalTransactions || 0}
          showeye={false}
          formatType="number"
        />

        <AccountInfos
          title="Receitas"
          text="No período selecionado"
          isLoadingAccounts={isLoadingTransactions || !periodStats}
          amount={periodStats?.totalIncome || 0}
          showeye={false}
          colorType="success"
        />

        <AccountInfos
          title="Gastos"
          text="No período selecionado"
          isLoadingAccounts={isLoadingTransactions || !periodStats}
          amount={periodStats?.totalExpenses || 0}
          showeye={false}
          colorType="destructive"
        />

        <AccountInfos
          title="Saldo do Período"
          text="Receitas - Gastos"
          isLoadingAccounts={isLoadingTransactions || !periodStats}
          amount={periodStats?.balance || 0}
          showeye={false}
          colorType={
            periodStats?.balance && periodStats.balance >= 0
              ? 'success'
              : 'destructive'
          }
        />
      </div>
      {/* Filtros */}
      <ExtractFilters
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Lista de transações */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Transações
              {filteredTransactions.length > 0 && (
                <span className="text-muted-foreground font-normal ml-2">
                  ({filteredTransactions.length}{' '}
                  {filteredTransactions.length === 1 ? 'item' : 'itens'})
                </span>
              )}
            </CardTitle>

            {filteredTransactions.length > 0 && (
              <Button
                variant="outline"
                onClick={exportToCSV}
                className="flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Exportar CSV
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoadingTransactions ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">
                Carregando transações...
              </p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="p-8 text-center">
              <svg
                className="w-12 h-12 text-muted-foreground mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhuma transação encontrada
              </h3>
              <p className="text-muted-foreground">
                {Object.values(filters).some((filter) => filter !== '')
                  ? 'Tente ajustar os filtros para encontrar mais transações.'
                  : 'Suas transações aparecerão aqui quando você começar a usar sua conta.'}
              </p>
            </div>
          ) : (
            <div className="">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="p-2">
                  <TransactionItem
                    transaction={transaction}
                    onEdit={handleEditTransaction}
                    onDelete={handleDeleteTransaction}
                    onProcess={handleProcessTransaction}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
