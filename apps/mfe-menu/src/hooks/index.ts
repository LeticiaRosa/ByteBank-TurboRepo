export { useTheme } from './useTheme'

// Hooks principais (mantidos para compatibilidade)
export {
  useTransactions,
  useTransaction,
  type Transaction,
  type CreateTransactionData,
  type BankAccount,
} from './useTransactions'

// Hooks especializados
export {
  useTransactionsList,
  useCreateTransaction,
} from './useTransactionOperations'

export {
  useBankAccounts,
  usePrimaryBankAccount,
  useBankAccountByNumber,
} from './useBankAccounts'
