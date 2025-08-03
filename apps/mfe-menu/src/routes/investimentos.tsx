import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/investimentos')({
  component: InvestimentosPage,
})

function InvestimentosPage() {
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-foreground mb-6">Investimentos</h1>

      {/* Resumo dos Investimentos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Patrimônio Total
          </h3>
          <p className="text-3xl font-bold text-primary">R$ 15.480,20</p>
          <p className="text-sm text-chart-1 mt-1">+8,5% este mês</p>
        </div>

        <div className="bg-card rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Rendimento Mensal
          </h3>
          <p className="text-3xl font-bold text-chart-1">R$ 1.204,50</p>
          <p className="text-sm text-muted-foreground mt-1">CDI: 98,5%</p>
        </div>

        <div className="bg-card rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Aplicações Ativas
          </h3>
          <p className="text-3xl font-bold text-primary">8</p>
          <p className="text-sm text-muted-foreground mt-1">
            Produtos diferentes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meus Investimentos */}
        <div className="bg-card rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Meus Investimentos
          </h2>

          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-foreground">
                    CDB Banco ByteBank
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Vencimento: 15/12/2025
                  </p>
                </div>
                <span className="text-chart-1 font-medium">+2,1%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">R$ 5.000,00</span>
                <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                  110% CDI
                </span>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-foreground">
                    Tesouro Selic 2026
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Liquidez diária
                  </p>
                </div>
                <span className="text-chart-1 font-medium">+1,8%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">R$ 3.200,00</span>
                <span className="text-sm bg-accent text-accent-foreground px-2 py-1 rounded">
                  Tesouro
                </span>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-foreground">
                    Fundo Renda Fixa
                  </h4>
                  <p className="text-sm text-muted-foreground">Baixo risco</p>
                </div>
                <span className="text-chart-1 font-medium">+1,5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">R$ 2.800,00</span>
                <span className="text-sm bg-secondary text-secondary-foreground px-2 py-1 rounded">
                  Fundo
                </span>
              </div>
            </div>
          </div>

          <button className="w-full mt-4 text-primary hover:text-primary/90 font-medium text-sm">
            Ver todos os investimentos
          </button>
        </div>

        {/* Oportunidades */}
        <div className="bg-card rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Oportunidades
          </h2>

          <div className="space-y-4">
            <div className="border border-primary rounded-lg p-4 bg-primary/10">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-foreground">
                    LCI Banco ByteBank
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Isento de IR - Mín: R$ 1.000
                  </p>
                </div>
                <span className="text-primary font-bold">105% CDI</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Prazo: 720 dias • Liquidez no vencimento
              </p>
              <button className="w-full bg-primary text-white py-2 px-4 rounded text-sm hover:bg-primary/90 transition-colors">
                Investir Agora
              </button>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-foreground">CDB Prefixado</h4>
                  <p className="text-sm text-muted-foreground">
                    Proteção contra inflação
                  </p>
                </div>
                <span className="text-primary font-bold">12,5% a.a.</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Prazo: 1080 dias • Mín: R$ 5.000
              </p>
              <button className="w-full border border-primary text-primary py-2 px-4 rounded text-sm hover:bg-primary/10 transition-colors">
                Saiba Mais
              </button>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-foreground">
                    Fundo Multimercado
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Diversificação automática
                  </p>
                </div>
                <span className="text-accent font-bold">CDI + 3%</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Liquidez: D+30 • Mín: R$ 500
              </p>
              <button className="w-full border border-accent text-accent py-2 px-4 rounded text-sm hover:bg-accent/10 transition-colors">
                Saiba Mais
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
