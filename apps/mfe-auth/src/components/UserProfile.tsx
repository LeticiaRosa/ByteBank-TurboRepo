import { useAuth } from '../hooks/useAuth'
import { lazy, Suspense } from 'react'

const MfeDashboard = lazy(() => import('dashboard/dashboard'))

export function UserProfile() {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  return (
    <Suspense fallback={<div>Carregando dashboard...</div>}>
      <MfeDashboard />
    </Suspense>
  )
}
