import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@bytebank/ui'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
} from 'recharts'
import { useDashboardData } from '../hooks'

const chartConfig = {
  saldo: {
    label: 'Saldo',
    color: 'var(--blue-7)',
  },
  receitas: {
    label: 'Receitas',
    color: 'var(--chart-1)',
  },
  gastos: {
    label: 'Gastos',
    color: 'var(--chart-9)',
  },
} satisfies ChartConfig

const expensesConfig = {
  alimentacao: {
    label: 'Alimentação',
    color: 'red',
  },
  transporte: {
    label: 'Transporte',
    color: 'red',
  },
  casa: {
    label: 'Moradia',
    color: 'red',
  },
  entretenimento: {
    label: 'Lazer',
    color: 'red',
  },
  outros: {
    label: 'Outros',
    color: 'red',
  },
  viagem: {
    label: 'Viagem',
    color: 'red',
  },
  investimentos: {
    label: 'Investimentos',
    color: 'red',
  },
  saude: {
    label: 'Saúde',
    color: 'red',
  },
  educacao: {
    label: 'Educação',
    color: 'red',
  },
  compras: {
    label: 'Compras',
    color: 'red',
  },
  trabalho: {
    label: 'Trabalho',
    color: 'red',
  },
} satisfies ChartConfig

// Helper para converter centavos para reais
const formatCurrency = (cents: number) => {
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function DashboardCharts() {
  const { monthlyBalanceData, expensesCategoryData, isLoading, hasError } =
    useDashboardData()

  // Preparar dados para os gráficos
  const chartData = monthlyBalanceData.map((item) => ({
    month: item.month_label,
    saldo: item.saldo / 100, // Converter centavos para reais
    receitas: item.receitas / 100,
    gastos: item.gastos / 100,
  }))

  const expensesData = expensesCategoryData.map((item) => ({
    category: item.category,
    label: item.label,
    value: item.value / 100, // Converter centavos para reais
    fill: `var(--blue-${Math.floor(Math.random() * 11) + 1})`, // Cor aleatória para cada categoria
  }))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">
            Carregando dados dos gráficos...
          </p>
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-sm text-destructive">
            Erro ao carregar dados dos gráficos.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Tente recarregar a página.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Seção de Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Gráfico de Evolução Financeira */}
        <div className="bg-card rounded-lg shadow-sm border-border border p-6">
          <h2 className="text-xl font-semibold text-card-foreground mb-4">
            Evolução Financeira (Últimos Meses)
          </h2>
          {chartData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  type="monotone"
                  dataKey="saldo"
                  stroke="var(--color-saldo)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-saldo)' }}
                />
                <Line
                  type="monotone"
                  dataKey="receitas"
                  stroke="var(--color-receitas)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-receitas)' }}
                />
                <Line
                  type="monotone"
                  dataKey="gastos"
                  stroke="var(--color-gastos)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-gastos)' }}
                />
              </LineChart>
            </ChartContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Nenhum dado financeiro disponível
            </div>
          )}
        </div>

        {/* Gráfico de Distribuição de Gastos */}
        <div className="bg-card rounded-lg shadow-sm border-border border p-6">
          <h2 className="text-xl font-semibold text-card-foreground mb-4">
            Distribuição de Gastos por Categoria
          </h2>
          {expensesData.length > 0 ? (
            <ChartContainer
              config={expensesConfig}
              className="h-[300px] w-full"
            >
              <PieChart>
                <Pie
                  data={expensesData}
                  dataKey="value"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ label, value }) =>
                    `${label}: ${formatCurrency(value * 100)}`
                  }
                />
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="label" />}
                />
              </PieChart>
            </ChartContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Nenhuma despesa categorizada no período
            </div>
          )}
        </div>
      </div>

      {/* Gráfico de Barras - Comparativo Mensal */}
      <div className="bg-card rounded-lg shadow-sm border-border border p-6 mb-8">
        <h2 className="text-xl font-semibold text-card-foreground mb-4">
          Comparativo Mensal: Receitas vs Gastos
        </h2>
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="receitas"
                fill="var(--color-receitas)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="gastos"
                fill="var(--color-gastos)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="h-[400px] flex items-center justify-center text-muted-foreground">
            Nenhum dado financeiro disponível para comparação
          </div>
        )}
      </div>
    </>
  )
}
