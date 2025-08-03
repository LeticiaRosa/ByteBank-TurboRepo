import { StrictMode } from 'react'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { Toaster } from '@bytebank/ui'
import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider.tsx'
import { routeTree } from './routeTree.gen'
import '@bytebank/ui/globals.css'
import { ThemeProvider } from './providers/theme.tsx'

// Create a new router instance
const TanStackQueryProviderContext = TanStackQueryProvider.getContext()

const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProviderContext,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

interface AppRouterProps {
  basePath?: string
  enableDevtools?: boolean
}

const AppRouter: React.FC<AppRouterProps> = () => {
  // Se precisar de basePath diferente, recrie o router
  const routerInstance = createRouter({
    routeTree,
    context: {
      ...TanStackQueryProviderContext,
    },
    basepath: 'app2',
    defaultPreload: 'intent',
    scrollRestoration: true,
    defaultStructuralSharing: true,
    defaultPreloadStaleTime: 0,
  })

  return (
    <StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
          <RouterProvider router={routerInstance} />
          <Toaster />
        </TanStackQueryProvider.Provider>
      </ThemeProvider>
    </StrictMode>
  )
}

export default AppRouter
