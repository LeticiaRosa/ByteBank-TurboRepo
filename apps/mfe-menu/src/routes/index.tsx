import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Início</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Card de Saldo */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Saldo Atual
          </h3>
          <p className="text-3xl font-bold text-teal-600">R$ 2.580,45</p>
          <p className="text-sm text-gray-500 mt-1">Conta Corrente</p>
        </div>

        {/* Card de Receitas */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Receitas do Mês
          </h3>
          <p className="text-3xl font-bold text-green-600">R$ 3.200,00</p>
          <p className="text-sm text-gray-500 mt-1">+12% vs mês anterior</p>
        </div>

        {/* Card de Gastos */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Gastos do Mês
          </h3>
          <p className="text-3xl font-bold text-red-600">R$ 1.450,20</p>
          <p className="text-sm text-gray-500 mt-1">-5% vs mês anterior</p>
        </div>
      </div>

      {/* Seção de Ações Rápidas */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Ações Rápidas
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <svg
              className="h-8 w-8 text-teal-600 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            <span className="text-sm font-medium">Transferir</span>
          </button>

          <button className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <svg
              className="h-8 w-8 text-teal-600 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="text-sm font-medium">Pagar</span>
          </button>

          <button className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <svg
              className="h-8 w-8 text-teal-600 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            <span className="text-sm font-medium">Investir</span>
          </button>

          <button className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <svg
              className="h-8 w-8 text-teal-600 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span className="text-sm font-medium">Extrato</span>
          </button>
        </div>
      </div>
    </div>
  )
}
