import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import DashboardLayout from '../components/DashboardLayout'
import { AuthGuard } from '../components/AuthGuard'

export const Route = createRootRoute({
  component: () => (
    <>
      <AuthGuard>
        <DashboardLayout>
          <Outlet />
        </DashboardLayout>
      </AuthGuard>
      <TanStackRouterDevtools />
    </>
  ),
})
