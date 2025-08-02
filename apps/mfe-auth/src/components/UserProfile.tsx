import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  useAuthToast,
} from '@bytebank/ui'
import { useAuth } from '../hooks/useAuth'
import { lazy, Suspense } from 'react'

const MfeDashboard = lazy(() => import('dashboard/dashboard'))

export function UserProfile() {
  const { user, signOut, loading } = useAuth()
  const toast = useAuthToast()

  const handleLogout = async () => {
    try {
      const result = await signOut()
      if (result.success) {
        toast.logoutSuccess()
      } else {
        toast.logoutError()
      }
    } catch (error) {
      toast.unexpectedError()
    }
  }

  if (!user) {
    return null
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Bem-vindo!</CardTitle>
        <CardDescription>Você está logado como {user.email}</CardDescription>
      </CardHeader>
      <Suspense fallback={<div>Carregando dashboard...</div>}>
        <MfeDashboard />
      </Suspense>
      <CardContent>
        <Button
          onClick={handleLogout}
          className="w-full"
          variant="outline"
          disabled={loading}
        >
          {loading ? 'Saindo...' : 'Logout'}
        </Button>
      </CardContent>
    </Card>
  )
}
