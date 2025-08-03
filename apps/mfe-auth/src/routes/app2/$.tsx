import { createFileRoute } from '@tanstack/react-router'
import { Suspense, lazy } from 'react'

const DashboardApp = lazy(() => import('dashboard/dashboard'))

export const Route = createFileRoute('/app2/$')({
  component: () => (
    <div>
      {/* <h2>Redirecionando para Dashboard...</h2> */}
      <Suspense fallback={<div>Carregando Dashboard...</div>}>
        <DashboardApp />
      </Suspense>
      {/* <p>
        Se não redirecionar, clique <a href="/app2/dashboard">aqui</a>.
      </p> */}
        
    </div>
  ),
})
