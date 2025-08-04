import { useState } from 'react'
import {
  Button,
  Input,
  Card,
  CardContent,
  DatePicker,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@bytebank/ui'

export interface FilterOptions {
  dateFrom: string
  dateTo: string
  transactionType: string
  status: string
  minAmount: string
  maxAmount: string
  description: string
  category: string
  senderName: string
}

interface ExtractFiltersProps {
  onFilterChange: (filters: FilterOptions) => void
  onReset: () => void
}

// Exemplo de uso das funções de filtro com sintaxe similar ao Supabase:
//
// import { getFilteredTransactions, queryTransactions } from '../../lib/transactions'
//
// // 1. Usando getFilteredTransactions com os filtros do componente:
// const transactions = await getFilteredTransactions(filters, userId)
//
// // 2. Usando queryTransactions para queries personalizadas (sintaxe similar ao Supabase):
//
// // Equivalente a: supabase.from('transactions').eq('category', 'alimentacao')
// const foodTransactions = await queryTransactions(userId, {
//   eq: { category: 'alimentacao' }
// })
//
// // Equivalente a: supabase.from('transactions').eq('category', 'teste').gte('amount', 1000)
// const testTransactions = await queryTransactions(userId, {
//   eq: { category: 'teste' },
//   gte: { amount: 1000 }
// })
//
// // Query complexa - equivalente a:
// // supabase.from('transactions')
// //   .eq('category', 'alimentacao')
// //   .eq('status', 'completed')
// //   .gte('created_at', '2024-01-01T00:00:00.000Z')
// //   .lte('created_at', '2024-12-31T23:59:59.999Z')
// //   .ilike('description', '%mercado%')
// //   .order('created_at', { ascending: false })
// const complexQuery = await queryTransactions(userId, {
//   eq: { category: 'alimentacao', status: 'completed' },
//   gte: { created_at: '2024-01-01T00:00:00.000Z' },
//   lte: { created_at: '2024-12-31T23:59:59.999Z' },
//   ilike: { description: 'mercado' },
//   order: { column: 'created_at', ascending: false }
// })

export function ExtractFilters({
  onFilterChange,
  onReset,
}: ExtractFiltersProps) {
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

  const [isExpanded, setIsExpanded] = useState(false)

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
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
    onReset()
  }

  const getToday = () => {
    return new Date().toISOString().split('T')[0]
  }

  const applyQuickFilter = (days: number) => {
    const today = new Date()
    const pastDate = new Date()
    pastDate.setDate(today.getDate() - days)

    const newFilters = {
      ...filters,
      dateFrom: pastDate.toISOString().split('T')[0],
      dateTo: today.toISOString().split('T')[0],
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Linha superior com busca e botão de expandir filtros */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full sm:max-w-md">
              <Input
                placeholder="Buscar por descrição..."
                value={filters.description}
                onChange={(e) =>
                  handleFilterChange('description', e.target.value)
                }
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsExpanded(!isExpanded)}
                className="whitespace-nowrap"
              >
                {isExpanded ? 'Menos Filtros' : 'Mais Filtros'}
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                className="whitespace-nowrap"
              >
                Limpar
              </Button>
            </div>
          </div>

          {/* Filtros rápidos */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyQuickFilter(7)}
            >
              Últimos 7 dias
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyQuickFilter(30)}
            >
              Últimos 30 dias
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyQuickFilter(90)}
            >
              Últimos 90 dias
            </Button>
          </div>

          {/* Filtros expandidos */}
          {isExpanded && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t">
              {/* Período personalizado */}

              <DatePicker
                text="Data inicial"
                value={filters.dateFrom}
                onChange={(value) => handleFilterChange('dateFrom', value)}
                placeholder="Selecionar data inicial"
                max={getToday()}
              />

              <DatePicker
                text="Data final"
                value={filters.dateTo}
                onChange={(value) => handleFilterChange('dateTo', value)}
                placeholder="Selecionar data final"
                max={getToday()}
              />

              {/* Tipo de transação */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Tipo
                </label>
                <Select
                  value={filters.transactionType || undefined}
                  onValueChange={(value) =>
                    handleFilterChange('transactionType', value || '')
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todos os tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="deposit">Depósito</SelectItem>
                    <SelectItem value="withdrawal">Saque</SelectItem>
                    <SelectItem value="transfer">Transferência</SelectItem>
                    <SelectItem value="payment">Pagamento</SelectItem>
                    <SelectItem value="fee">Taxa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Status
                </label>
                <Select
                  value={filters.status || undefined}
                  onValueChange={(value) =>
                    handleFilterChange('status', value || '')
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="completed">Concluída</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="failed">Falhou</SelectItem>
                    <SelectItem value="cancelled">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Categoria */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Categoria
                </label>
                <Select
                  value={filters.category || undefined}
                  onValueChange={(value) =>
                    handleFilterChange('category', value || '')
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todas as categorias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    <SelectItem value="alimentacao">Alimentação</SelectItem>
                    <SelectItem value="transporte">Transporte</SelectItem>
                    <SelectItem value="saude">Saúde</SelectItem>
                    <SelectItem value="educacao">Educação</SelectItem>
                    <SelectItem value="entretenimento">
                      Entretenimento
                    </SelectItem>
                    <SelectItem value="compras">Compras</SelectItem>
                    <SelectItem value="casa">Casa</SelectItem>
                    <SelectItem value="trabalho">Trabalho</SelectItem>
                    <SelectItem value="investimentos">Investimentos</SelectItem>
                    <SelectItem value="viagem">Viagem</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Remetente */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Remetente
                </label>
                <Input
                  placeholder="Nome do remetente..."
                  value={filters.senderName}
                  onChange={(e) =>
                    handleFilterChange('senderName', e.target.value)
                  }
                />
              </div>

              {/* Valor mínimo */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Valor mínimo
                </label>
                <Input
                  type="number"
                  placeholder="R$ 0,00"
                  value={filters.minAmount}
                  onChange={(e) =>
                    handleFilterChange('minAmount', e.target.value)
                  }
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Valor máximo */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Valor máximo
                </label>
                <Input
                  type="number"
                  placeholder="R$ 0,00"
                  value={filters.maxAmount}
                  onChange={(e) =>
                    handleFilterChange('maxAmount', e.target.value)
                  }
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
