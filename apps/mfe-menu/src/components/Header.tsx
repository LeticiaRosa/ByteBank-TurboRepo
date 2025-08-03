import { Logo } from './Logo'
import { UserDropdown } from './UserDropdown'
import type { User } from '../types/user'
import { useAuth } from 'auth/useAuth'

export default function Header() {
  const { user: usuario } = useAuth()

  console.log('User data:', usuario)
  // Dados fake do usuário
  const user: User = {
    user_metadata: {
      full_name: 'João Silva',
      avatar_url:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
    email: 'joao.silva@email.com',
    email_confirmed_at: '2024-01-01T00:00:00.000Z',
  }
  const loading = false

  const signOut = () => {
    console.log('Fazendo logout...')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        {/* Logo Section */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* User Avatar with Dropdown */}
        <div className="flex items-center">
          <UserDropdown user={user} loading={loading} onSignOut={signOut} />
        </div>
      </div>
    </header>
  )
}
