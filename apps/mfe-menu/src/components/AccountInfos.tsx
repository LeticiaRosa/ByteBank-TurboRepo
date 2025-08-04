import { useState } from 'react'
import { Eye, EyeOff, Button } from '@bytebank/ui'

interface AccountProps {
  title: string
  amount: number
  text?: string
  isLoadingAccounts: boolean
  showeye?: boolean
  colorType?: 'primary' | 'success' | 'destructive'
  formatType?: 'currency' | 'number'
}

export function AccountInfos({
  title,
  amount,
  text,
  isLoadingAccounts,
  showeye = true,
  colorType = 'primary',
  formatType = 'currency',
}: AccountProps) {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true)

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible)
  }

  const formatValue = (value: number) => {
    if (formatType === 'number') {
      return value.toLocaleString('pt-BR')
    }

    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  const getAmountColorClass = () => {
    switch (colorType) {
      case 'success':
        return 'text-green-600 dark:text-green-400'
      case 'destructive':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-primary'
    }
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
  if (amount < 0) {
    return null
  }

  return (
    <div className="bg-card rounded-lg shadow-sm border-border border p-6">
      <div>
        <div className="flex fle-row justify-between">
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            {title}
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
        <p className={`text-3xl font-bold ${getAmountColorClass()}`}>
          {isBalanceVisible ? formatValue(amount) : '••••••'}
        </p>
        <p className="text-sm text-muted-foreground mt-1">{text}</p>
      </div>
    </div>
  )
}
