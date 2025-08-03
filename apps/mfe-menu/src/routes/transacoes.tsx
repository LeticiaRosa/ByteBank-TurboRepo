import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/transacoes')({
  component: TransferenciasPage,
})

function TransferenciasPage() {
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-foreground mb-6">Transações</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário de Transações */}
        <div className="bg-card rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Nova Transação
          </h2>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Tipo de Transação
              </label>
              <select className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Transferência</option>
                <option>Depósito</option>
                <option>Pagamento de Boleto</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Valor
              </label>
              <input
                type="text"
                placeholder="R$ 0,00"
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Conta de Destino
              </label>
              <input
                type="text"
                placeholder="Digite a conta ou CPF/CNPJ"
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Descrição (opcional)
              </label>
              <input
                type="text"
                placeholder="Motivo da transferência"
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors font-medium"
            >
              Efetuar Transação
            </button>
          </form>
        </div>

        {/* Histórico Recente */}
        <div className="bg-card rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Transações Recentes
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-destructive"
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
                </div>
                <div>
                  <p className="font-medium text-foreground">João Silva</p>
                  <p className="text-sm text-muted-foreground">Hoje, 14:30</p>
                </div>
              </div>
              <span className="text-destructive font-medium">-R$ 250,00</span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-chart-1/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-chart-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16l-4-4m0 0l4-4m-4 4h18"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-foreground">Maria Santos</p>
                  <p className="text-sm text-muted-foreground">Ontem, 09:15</p>
                </div>
              </div>
              <span className="text-chart-1 font-medium">+R$ 500,00</span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-destructive"
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
                </div>
                <div>
                  <p className="font-medium text-foreground">Pedro Oliveira</p>
                  <p className="text-sm text-muted-foreground">25/07, 16:45</p>
                </div>
              </div>
              <span className="text-destructive font-medium">-R$ 120,00</span>
            </div>
          </div>

          <button className="w-full mt-4 text-primary hover:text-primary/80 font-medium text-sm">
            Ver todas as transações
          </button>
        </div>
      </div>
    </div>
  )
}
