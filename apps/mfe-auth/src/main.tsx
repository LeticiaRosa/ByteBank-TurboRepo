import '@bytebank/ui/globals.css'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { Toaster } from '@bytebank/ui'

import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import reportWebVitals from './reportWebVitals.ts'

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

// Render the app
const rootElement = document.getElementById('app')

if (rootElement && !rootElement.hasChildNodes()) {
  const root = ReactDOM.createRoot(rootElement)

  root.render(
    <StrictMode>
      <ErrorBoundary>
        <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
          <RouterProvider router={router} />
          <Toaster />
        </TanStackQueryProvider.Provider>
      </ErrorBoundary>
    </StrictMode>,
  )
} else if (rootElement) {
  // Element exists but has content, clear and recreate
  rootElement.innerHTML = ''
  const root = ReactDOM.createRoot(rootElement)

  root.render(
    <StrictMode>
      <ErrorBoundary>
        <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
          <RouterProvider router={router} />
          <Toaster />
        </TanStackQueryProvider.Provider>
      </ErrorBoundary>
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
