import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Button,
} from '@bytebank/ui'
import { UserMenuItems } from './UserMenuItems'
import type { User } from '../types/user'

interface UserDropdownProps {
  user: User
  loading: boolean
  onSignOut: () => void
}

export const UserDropdown = ({
  user,
  loading,
  onSignOut,
}: UserDropdownProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getUserStatus = () => {
    if (user?.email_confirmed_at) {
      return 'Verificado'
    }
    return 'Pendente'
  }

  if (loading) {
    return <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.user_metadata?.avatar_url}
              alt={user.user_metadata?.full_name || user.email || ''}
            />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user.user_metadata?.full_name
                ? getInitials(user.user_metadata.full_name)
                : user.email?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-black">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.user_metadata?.full_name || 'Usuário'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              Status: {getUserStatus()}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <UserMenuItems onSignOut={onSignOut} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
