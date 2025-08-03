import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a singleton QueryClient to prevent multiple instances
let queryClientInstance: QueryClient | null = null

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  })
}

export function getContext() {
  if (!queryClientInstance) {
    queryClientInstance = createQueryClient()
  }

  return {
    queryClient: queryClientInstance,
  }
}

export function Provider({
  children,
  queryClient,
}: {
  children: React.ReactNode
  queryClient: QueryClient
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
