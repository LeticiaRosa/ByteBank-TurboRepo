import { createFileRoute } from '@tanstack/react-router'
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
import { AccountInfos } from '../components'
import { useTransactions, useMonthlyFinancialSummary } from '../hooks'

export const Route = createFileRoute('/')({
  component: HomePage,
})

// Dados para os gráficos
const monthlyBalanceData = [
  { month: 'Jan', saldo: 2100, receitas: 2800, gastos: 1200 },
  { month: 'Fev', saldo: 2300, receitas: 3000, gastos: 1300 },
  { month: 'Mar', saldo: 2150, receitas: 2900, gastos: 1400 },
  { month: 'Abr', saldo: 2450, receitas: 3100, gastos: 1350 },
  { month: 'Mai', saldo: 2580, receitas: 3200, gastos: 1450 },
]

const expensesData = [
  {
    category: 'alimentacao',
    label: 'Alimentação',
    value: 450,
    fill: 'var(--chart-1)',
  },
  {
    category: 'transporte',
    label: 'Transporte',
    value: 320,
    fill: 'var(--chart-2)',
  },
  { category: 'moradia', label: 'Moradia', value: 680, fill: 'var(--chart-3)' },
  { category: 'lazer', label: 'Lazer', value: 180, fill: 'var(--chart-4)' },
  { category: 'outros', label: 'Outros', value: 120, fill: 'var(--chart-5)' },
]

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
    color: 'var(--chart-1)',
  },
  transporte: {
    label: 'Transporte',
    color: 'var(--chart-2)',
  },
  moradia: {
    label: 'Moradia',
    color: 'var(--chart-3)',
  },
  lazer: {
    label: 'Lazer',
    color: 'var(--chart-4)',
  },
  outros: {
    label: 'Outros',
    color: 'var(--chart-5)',
  },
} satisfies ChartConfig

function HomePage() {
  const { primaryAccount, isLoadingAccounts } = useTransactions()
  const {
    monthlyRevenue,
    monthlyExpenses,
    revenueGrowth,
    expensesGrowth,
    isLoading: isLoadingFinancialSummary,
  } = useMonthlyFinancialSummary()
  return (
    <div className="w-full space-y-6">
      <h1 className="text-3xl font-bold text-foreground mb-6">Início</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <AccountInfos
          title="Saldo Principal"
          text="Conta Corrente"
          isLoadingAccounts={isLoadingAccounts}
          amount={(primaryAccount?.balance as number) || 0}
          showeye={false}
        />

        {/* Card de Receitas */}
        <AccountInfos
          title="Receitas do Mês"
          text={`${revenueGrowth} vs mês anterior`}
          isLoadingAccounts={isLoadingFinancialSummary}
          amount={monthlyRevenue}
          showeye={false}
          colorType="success"
        />

        {/* Card de Gastos */}
        <AccountInfos
          title="Gastos do Mês"
          text={`${expensesGrowth} vs mês anterior`}
          isLoadingAccounts={isLoadingFinancialSummary}
          amount={monthlyExpenses}
          showeye={false}
          colorType="destructive"
        />
      </div>

      {/* Seção de Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Gráfico de Evolução Financeira */}
        <div className="bg-card rounded-lg shadow-sm border-border border p-6">
          <h2 className="text-xl font-semibold text-card-foreground mb-4">
            Evolução Financeira (Últimos 5 Meses)
          </h2>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <LineChart data={monthlyBalanceData}>
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
        </div>

        {/* Gráfico de Distribuição de Gastos */}
        <div className="bg-card rounded-lg shadow-sm border-border border p-6">
          <h2 className="text-xl font-semibold text-card-foreground mb-4">
            Distribuição de Gastos por Categoria
          </h2>
          <ChartContainer config={expensesConfig} className="h-[300px] w-full">
            <PieChart>
              <Pie
                data={expensesData}
                dataKey="value"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ label, value }) => `${label}: R$ ${value}`}
              />
              <ChartTooltip content={<ChartTooltipContent nameKey="label" />} />
            </PieChart>
          </ChartContainer>
        </div>
      </div>

      {/* Gráfico de Barras - Comparativo Mensal */}
      <div className="bg-card rounded-lg shadow-sm border-border border p-6 mb-8">
        <h2 className="text-xl font-semibold text-card-foreground mb-4">
          Comparativo Mensal: Receitas vs Gastos
        </h2>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <BarChart data={monthlyBalanceData}>
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
      </div>
    </div>
  )
}
