import { useState } from 'react'
import { Eye, EyeOff, Button } from '@bytebank/ui'
import { useTransactions } from '../hooks'

export function AccountBalance() {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true)
  const { primaryAccount, isLoadingAccounts } = useTransactions()

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible)
  }

  const formatBalance = (balance: number) => {
    return balance.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  if (isLoadingAccounts) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled>
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  if (!primaryAccount) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <div className="text-sm text-muted-foreground">
        <span className="text-xs">Saldo:</span>
        <div className="font-medium text-foreground">
          {isBalanceVisible ? formatBalance(primaryAccount.balance) : '••••••'}
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleBalanceVisibility}
        className="h-8 w-8 p-0 hover:bg-muted/50"
        title={isBalanceVisible ? 'Ocultar saldo' : 'Mostrar saldo'}
      >
        {isBalanceVisible ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}
