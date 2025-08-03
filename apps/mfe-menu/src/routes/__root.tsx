import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import DashboardLayout from '../components/DashboardLayout'

export const Route = createRootRoute({
  component: () => (
    <>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
      <TanStackRouterDevtools />
    </>
  ),
})
