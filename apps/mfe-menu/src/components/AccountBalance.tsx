import { useState } from 'react'
import { Eye, EyeOff, Button } from '@bytebank/ui'
import { useTransactions } from '../hooks'

interface AccountProps {
  showeye?: boolean
}

export function AccountBalance({ showeye = true }: AccountProps) {
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
    <div className="bg-card rounded-lg shadow-sm border-border border p-6">
      <div>
        <div className="flex fle-row justify-between">
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            Saldo Atual
          </h3>
          {showeye && (
            <div className="flex justify-end">
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
          )}
        </div>
        <p className="text-3xl font-bold text-primary">
          {' '}
          {isBalanceVisible ? formatBalance(primaryAccount.balance) : '••••••'}
        </p>
        <p className="text-sm text-muted-foreground mt-1">Conta Corrente</p>
      </div>
    </div>
  )
}
