import { createFileRoute } from '@tanstack/react-router'
import { AccountInfos, DashboardCharts } from '../components'
import { useTransactions, useMonthlyFinancialSummary } from '../hooks'

export const Route = createFileRoute('/')({
  component: HomePage,
})

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

      <DashboardCharts />
    </div>
  )
}
