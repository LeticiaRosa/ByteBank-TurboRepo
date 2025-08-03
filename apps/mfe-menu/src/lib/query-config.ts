// Configuração centralizada das chaves e configurações do React Query
export const QUERY_KEYS = {
  // Transações
  transactions: {
    all: ['transactions'] as const,
    lists: () => [...QUERY_KEYS.transactions.all, 'list'] as const,
    list: (filters?: any) =>
      [...QUERY_KEYS.transactions.lists(), { filters }] as const,
    details: () => [...QUERY_KEYS.transactions.all, 'detail'] as const,
    detail: (id: string) => [...QUERY_KEYS.transactions.details(), id] as const,
  },

  // Contas bancárias
  bankAccounts: {
    all: ['bank_accounts'] as const,
    lists: () => [...QUERY_KEYS.bankAccounts.all, 'list'] as const,
    primary: () => [...QUERY_KEYS.bankAccounts.all, 'primary'] as const,
    byNumber: (accountNumber: string) =>
      [...QUERY_KEYS.bankAccounts.all, 'by-number', accountNumber] as const,
  },

  // Usuário/Auth
  auth: {
    all: ['auth'] as const,
    user: () => [...QUERY_KEYS.auth.all, 'user'] as const,
    session: () => [...QUERY_KEYS.auth.all, 'session'] as const,
  },
} as const

// Configurações padrão para queries
export const QUERY_CONFIG = {
  // Configurações para transações
  transactions: {
    staleTime: 1000 * 60 * 2, // 2 minutos
    gcTime: 1000 * 60 * 5, // 5 minutos (anteriormente cacheTime)
    retry: (failureCount: number, error: any) => {
      if (error.message.includes('Token de autenticação')) {
        return false
      }
      return failureCount < 3
    },
  },

  // Configurações para contas bancárias
  bankAccounts: {
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
    retry: (failureCount: number, error: any) => {
      if (error.message.includes('Token de autenticação')) {
        return false
      }
      return failureCount < 3
    },
  },

  // Configurações para auth
  auth: {
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
    retry: false,
  },
} as const
