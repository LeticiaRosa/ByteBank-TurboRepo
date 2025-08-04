import { Outlet, createRootRoute } from '@tanstack/react-router'

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
    </>
  ),
})
