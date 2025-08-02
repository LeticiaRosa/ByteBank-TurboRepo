import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { Toaster } from '@bytebank/ui'

import { SharedContextProvider } from './shared/SharedContext'
import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider.tsx'
import { router } from './router'

import reportWebVitals from './reportWebVitals.ts'
import '@bytebank/ui/globals.css'

// Get context for SharedContextProvider
const TanStackQueryProviderContext = TanStackQueryProvider.getContext()

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <SharedContextProvider
        queryClient={TanStackQueryProviderContext.queryClient}
      >
        <RouterProvider router={router} />
        <Toaster />
      </SharedContextProvider>
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
