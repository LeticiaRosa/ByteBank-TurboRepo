import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import Header from '../components/Header'
import { SidebarProvider } from '@bytebank/ui'

export const Route = createRootRoute({
  component: () => (
    <SidebarProvider>
      <Header />
      <Outlet />
      <TanStackRouterDevtools />
    </SidebarProvider>
  ),
})
