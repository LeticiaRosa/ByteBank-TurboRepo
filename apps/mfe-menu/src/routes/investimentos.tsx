import { createFileRoute } from '@tanstack/react-router'
import DashboardLayout from '../components/DashboardLayout'

export const Route = createFileRoute('/investimentos')({
  component: InvestimentosPage,
})

function InvestimentosPage() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Investimentos</h1>

        {/* Resumo dos Investimentos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Patrimônio Total
            </h3>
            <p className="text-3xl font-bold text-teal-600">R$ 15.480,20</p>
            <p className="text-sm text-green-600 mt-1">+8,5% este mês</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Rendimento Mensal
            </h3>
            <p className="text-3xl font-bold text-green-600">R$ 1.204,50</p>
            <p className="text-sm text-gray-500 mt-1">CDI: 98,5%</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aplicações Ativas
            </h3>
            <p className="text-3xl font-bold text-blue-600">8</p>
            <p className="text-sm text-gray-500 mt-1">Produtos diferentes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Meus Investimentos */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Meus Investimentos
            </h2>

            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      CDB Banco ByteBank
                    </h4>
                    <p className="text-sm text-gray-500">
                      Vencimento: 15/12/2025
                    </p>
                  </div>
                  <span className="text-green-600 font-medium">+2,1%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">R$ 5.000,00</span>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                    110% CDI
                  </span>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Tesouro Selic 2026
                    </h4>
                    <p className="text-sm text-gray-500">Liquidez diária</p>
                  </div>
                  <span className="text-green-600 font-medium">+1,8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">R$ 3.200,00</span>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Tesouro
                  </span>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Fundo Renda Fixa
                    </h4>
                    <p className="text-sm text-gray-500">Baixo risco</p>
                  </div>
                  <span className="text-green-600 font-medium">+1,5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">R$ 2.800,00</span>
                  <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    Fundo
                  </span>
                </div>
              </div>
            </div>

            <button className="w-full mt-4 text-teal-600 hover:text-teal-700 font-medium text-sm">
              Ver todos os investimentos
            </button>
          </div>

          {/* Oportunidades */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Oportunidades
            </h2>

            <div className="space-y-4">
              <div className="border border-teal-200 rounded-lg p-4 bg-teal-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      LCI Banco ByteBank
                    </h4>
                    <p className="text-sm text-gray-600">
                      Isento de IR - Mín: R$ 1.000
                    </p>
                  </div>
                  <span className="text-teal-600 font-bold">105% CDI</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Prazo: 720 dias • Liquidez no vencimento
                </p>
                <button className="w-full bg-teal-600 text-white py-2 px-4 rounded text-sm hover:bg-teal-700 transition-colors">
                  Investir Agora
                </button>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">CDB Prefixado</h4>
                    <p className="text-sm text-gray-600">
                      Proteção contra inflação
                    </p>
                  </div>
                  <span className="text-blue-600 font-bold">12,5% a.a.</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Prazo: 1080 dias • Mín: R$ 5.000
                </p>
                <button className="w-full border border-blue-600 text-blue-600 py-2 px-4 rounded text-sm hover:bg-blue-50 transition-colors">
                  Saiba Mais
                </button>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Fundo Multimercado
                    </h4>
                    <p className="text-sm text-gray-600">
                      Diversificação automática
                    </p>
                  </div>
                  <span className="text-purple-600 font-bold">CDI + 3%</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Liquidez: D+30 • Mín: R$ 500
                </p>
                <button className="w-full border border-purple-600 text-purple-600 py-2 px-4 rounded text-sm hover:bg-purple-50 transition-colors">
                  Saiba Mais
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
