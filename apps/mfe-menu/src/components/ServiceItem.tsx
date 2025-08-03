import { Button } from '@bytebank/ui'

export interface ServiceItemProps {
  icon: React.ReactNode
  title: string
  description: string
  details: string
  buttonText: string
  buttonVariant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
  iconBgColor?: string
  buttonColor?: string
  onButtonClick?: () => void
}

export function ServiceItem({
  icon,
  title,
  description,
  details,
  buttonText,
  buttonVariant = 'default',
  iconBgColor = 'bg-primary/10',
  buttonColor,
  onButtonClick,
}: ServiceItemProps) {
  // Determinar a classe do botão baseada na variant e cor customizada
  const getButtonClassName = () => {
    if (buttonVariant === 'destructive') {
      return 'w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors'
    }

    if (buttonColor) {
      return `w-full ${buttonColor} text-white py-2 px-4 rounded hover:${buttonColor}/90 transition-colors`
    }

    return 'w-full'
  }

  return (
    <div className="flex flex-col rounded-lg shadow-sm border p-6 justify-between ">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}
          >
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <p className="text-muted-foreground text-sm mb-4">{details}</p>
      </div>

      <Button
        variant={buttonVariant}
        className={getButtonClassName()}
        onClick={onButtonClick}
      >
        {buttonText}
      </Button>
    </div>
  )
}
