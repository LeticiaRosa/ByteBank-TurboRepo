import { useQuery } from '@tanstack/react-query'
import { bankAccountService, type BankAccount } from '../lib/transactions'
import { QUERY_KEYS, QUERY_CONFIG } from '../lib/query-config'

/**
 * Hook para listar todas as contas bancárias do usuário
 */
export function useBankAccounts() {
  return useQuery({
    queryKey: QUERY_KEYS.bankAccounts.lists(),
    queryFn: () => bankAccountService.getBankAccounts(),
    ...QUERY_CONFIG.bankAccounts,
    // Atualização automática mais frequente para saldos sempre atuais
    // refetchInterval: 5000, // 5 segundos
    // refetchIntervalInBackground: true,
    // refetchOnWindowFocus: true,
    // refetchOnMount: true,
  })
}

/**
 * Hook para obter a conta bancária principal do usuário
 */
export function usePrimaryBankAccount() {
  const { data: bankAccounts } = useBankAccounts()

  return useQuery({
    queryKey: QUERY_KEYS.bankAccounts.primary(),
    queryFn: () => bankAccountService.getPrimaryAccount(),
    enabled: !!bankAccounts && bankAccounts.length > 0,
    ...QUERY_CONFIG.bankAccounts,
    // Atualização automática mais frequente para saldo sempre atual
    // refetchInterval: 5000, // 5 segundos
    // refetchIntervalInBackground: true,
    // refetchOnWindowFocus: true,
    // refetchOnMount: true,
  })
}

/**
 * Hook para buscar uma conta por número
 */
export function useBankAccountByNumber(accountNumber?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.bankAccounts.byNumber(accountNumber || ''),
    queryFn: () => bankAccountService.getAccountByNumber(accountNumber!),
    enabled: !!accountNumber,
    ...QUERY_CONFIG.bankAccounts,
  })
}

export type { BankAccount }
