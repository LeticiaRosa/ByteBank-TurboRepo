import { useState } from 'react'
import { Button, Input, Card, CardContent, DatePicker } from '@bytebank/ui'

export interface FilterOptions {
  dateFrom: string
  dateTo: string
  transactionType: string
  status: string
  minAmount: string
  maxAmount: string
  description: string
}

interface ExtractFiltersProps {
  onFilterChange: (filters: FilterOptions) => void
  onReset: () => void
}

export function ExtractFilters({
  onFilterChange,
  onReset,
}: ExtractFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    dateFrom: '',
    dateTo: '',
    transactionType: '',
    status: '',
    minAmount: '',
    maxAmount: '',
    description: '',
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
      transactionType: '',
      status: '',
      minAmount: '',
      maxAmount: '',
      description: '',
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
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
                <select
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-card text-foreground"
                  value={filters.transactionType}
                  onChange={(e) =>
                    handleFilterChange('transactionType', e.target.value)
                  }
                >
                  <option value="">Todos os tipos</option>
                  <option value="deposit">Depósito</option>
                  <option value="withdrawal">Saque</option>
                  <option value="transfer">Transferência</option>
                  <option value="payment">Pagamento</option>
                  <option value="fee">Taxa</option>
                </select>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-card text-foreground"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">Todos os status</option>
                  <option value="completed">Concluída</option>
                  <option value="pending">Pendente</option>
                  <option value="failed">Falhou</option>
                  <option value="cancelled">Cancelada</option>
                </select>
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
