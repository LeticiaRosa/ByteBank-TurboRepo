import { DropdownMenuItem, Switch } from '@bytebank/ui'
import { useTheme } from '../hooks/useTheme'

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <DropdownMenuItem className="flex items-center justify-between cursor-pointer">
      <div className="flex items-center">
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
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
        Tema escuro
      </div>
      <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
    </DropdownMenuItem>
  )
}
