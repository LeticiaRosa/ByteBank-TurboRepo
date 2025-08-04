import { useQuery } from '@tanstack/react-query'
import { httpClient } from '../lib/http-client'

// Tipos para os dados do dashboard
export interface MonthlyBalanceData {
  month_label: string
  month_number: number
  receitas: number
  gastos: number
  saldo: number
}

export interface ExpensesCategoryData {
  category: string
  label: string
  value: number
}

export interface UserAccountData {
  id: string
  account_number: string
  account_type: string
  balance: number
  is_active: boolean
  user_id: string
}

// Hook para buscar dados da evolução financeira mensal
export function useMonthlyBalanceData() {
  return useQuery({
    queryKey: ['monthly-financial-summary'],
    queryFn: async (): Promise<MonthlyBalanceData[]> => {
      const data = await httpClient.get<MonthlyBalanceData[]>(
        '/monthly_financial_summary',
      )
      return data
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 5 * 60 * 1000, // Refetch a cada 5 minutos
  })
}

// Hook para buscar dados de gastos por categoria
export function useExpensesByCategory() {
  return useQuery({
    queryKey: ['expenses-by-category'],
    queryFn: async (): Promise<ExpensesCategoryData[]> => {
      const data = await httpClient.get<ExpensesCategoryData[]>(
        '/expenses_by_category',
      )
      return data
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 5 * 60 * 1000, // Refetch a cada 5 minutos
  })
}

// Hook para buscar dados das contas do usuário
export function useUserAccounts() {
  return useQuery({
    queryKey: ['user-accounts-summary'],
    queryFn: async (): Promise<UserAccountData[]> => {
      const data = await httpClient.get<UserAccountData[]>(
        '/user_accounts_summary',
      )
      return data
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
    refetchInterval: 2 * 60 * 1000, // Refetch a cada 2 minutos
  })
}

// Hook combinado para o dashboard com todos os dados
export function useDashboardData() {
  const monthlyBalance = useMonthlyBalanceData()
  const expensesByCategory = useExpensesByCategory()
  const userAccounts = useUserAccounts()

  return {
    // Dados da evolução financeira
    monthlyBalanceData: monthlyBalance.data ?? [],
    isLoadingMonthlyBalance: monthlyBalance.isLoading,
    monthlyBalanceError: monthlyBalance.error,

    // Dados de gastos por categoria
    expensesCategoryData: expensesByCategory.data ?? [],
    isLoadingExpenses: expensesByCategory.isLoading,
    expensesError: expensesByCategory.error,

    // Dados das contas do usuário
    userAccountsData: userAccounts.data ?? [],
    isLoadingAccounts: userAccounts.isLoading,
    accountsError: userAccounts.error,

    // Estados gerais
    isLoading:
      monthlyBalance.isLoading ||
      expensesByCategory.isLoading ||
      userAccounts.isLoading,
    hasError:
      monthlyBalance.error || expensesByCategory.error || userAccounts.error,

    // Funções de refetch
    refetchAll: () => {
      monthlyBalance.refetch()
      expensesByCategory.refetch()
      userAccounts.refetch()
    },
  }
}
