import { DropdownMenuItem, DropdownMenuSeparator, useToast } from '@bytebank/ui'
import { ThemeToggle } from './ThemeToggle'
import { useAuth } from 'auth/useAuth'
import { getAuthUrl } from '../lib/config'

export const UserMenuItems = () => {
  const { signOut } = useAuth()
  const toast = useToast()

  const handleSignOut = async () => {
    try {
      const result = await signOut()
      if (result.success) {
        toast.success('Logout realizado com sucesso!', {
          description: 'Você foi desconectado da sua conta.',
          duration: 3000,
        })
        // onSignOut()
        // Redireciona para a tela de login
        window.location.href = getAuthUrl()
      } else {
        toast.error('Erro ao fazer logout', {
          description: result.error?.message || 'Ocorreu um erro inesperado.',
          duration: 5000,
        })
      }
    } catch (error: any) {
      toast.error('Erro inesperado', {
        description: error?.message || 'Não foi possível realizar o logout.',
        duration: 5000,
      })
    }
  }

  return (
    <>
      <DropdownMenuItem>
        <svg
          className="mr-2 h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        Perfil
      </DropdownMenuItem>
      <DropdownMenuItem>
        <svg
          className="mr-2 h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        Configurações
      </DropdownMenuItem>

      <ThemeToggle />

      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={handleSignOut}
        className="cursor-pointer text-destructive focus:text-destructive"
      >
        <svg
          className="mr-2 h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        Sair
      </DropdownMenuItem>
    </>
  )
}
