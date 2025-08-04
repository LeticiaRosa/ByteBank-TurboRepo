// Recomendações para otimização adicional

/* 
1. ÍNDICES NO BANCO DE DADOS:
CREATE INDEX idx_transactions_user_created ON transactions(user_id, created_at DESC);
CREATE INDEX idx_transactions_user_status ON transactions(user_id, status);
CREATE INDEX idx_bank_accounts_user_active ON bank_accounts(user_id, is_active);

2. IMPLEMENTAR CACHE:
- Usar React Query com staleTime para reduzir requisições
- Cache de contas bancárias (raramente mudam)
- Invalidação inteligente do cache

3. PAGINAÇÃO INTELIGENTE:
- Usar cursor-based pagination para grandes volumes
- Implementar scroll infinito apenas quando necessário
- Limitar resultados padrão a 10-20 registros

4. LAZY LOADING:
- Carregar transações apenas quando necessário
- Usar Suspense para melhor UX
- Implementar skeleton loading

5. MONITORING:
- Adicionar logs de performance
- Monitorar requisições lentas
- Alertas para consultas sem filtro de usuário
*/

export const PERFORMANCE_TIPS = {
  // Configurações recomendadas para React Query
  QUERY_DEFAULTS: {
    staleTime: 5 * 60 * 1000, // 5 minutos para contas bancárias
    cacheTime: 10 * 60 * 1000, // 10 minutos
  },
  
  // Limites de paginação
  PAGINATION_LIMITS: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 50,
    RECENT_TRANSACTIONS: 5,
  },
  
  // Throttling para atualizações
  THROTTLE_TIMES: {
    SEARCH: 300, // ms
    AUTO_REFRESH: 30000, // 30s
  }
}
