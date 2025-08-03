import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/outros-servicos')({
  component: OutrosServicosPage,
})

function OutrosServicosPage() {
  return (
    <div className="max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Outros Serviços</h1>

      {/* Grid de Serviços */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Cartões */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Cartões</h3>
              <p className="text-sm text-gray-500">Gerencie seus cartões</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Consulte faturas, altere limites e solicite novos cartões.
          </p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
            Acessar
          </button>
        </div>

        {/* Empréstimos */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Empréstimos</h3>
              <p className="text-sm text-gray-500">Simule e contrate</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Taxas especiais e aprovação rápida para clientes ByteBank.
          </p>
          <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors">
            Simular
          </button>
        </div>

        {/* Seguros */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Seguros</h3>
              <p className="text-sm text-gray-500">Proteja o que importa</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Seguro de vida, auto, residencial e muito mais.
          </p>
          <button className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors">
            Contratar
          </button>
        </div>

        {/* PIX */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">PIX</h3>
              <p className="text-sm text-gray-500">
                Transferências instantâneas
              </p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Gerencie suas chaves PIX e faça transferências 24h.
          </p>
          <button className="w-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 transition-colors">
            Configurar
          </button>
        </div>

        {/* Pagamentos */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red-600"
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
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Pagamentos</h3>
              <p className="text-sm text-gray-500">Boletos e contas</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Pague boletos, contas de luz, água, telefone e muito mais.
          </p>
          <button className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors">
            Pagar Conta
          </button>
        </div>

        {/* Atendimento */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-teal-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Atendimento</h3>
              <p className="text-sm text-gray-500">Suporte 24/7</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Chat, telefone ou agendamento presencial.
          </p>
          <button className="w-full bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition-colors">
            Falar Conosco
          </button>
        </div>
      </div>

      {/* Seção de Recados e Notificações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Notificações
          </h2>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Nova funcionalidade PIX
                </p>
                <p className="text-xs text-gray-600">
                  Agora você pode programar transferências PIX
                </p>
                <p className="text-xs text-gray-500 mt-1">Há 2 horas</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Fatura do cartão disponível
                </p>
                <p className="text-xs text-gray-600">
                  Vencimento em 15/08/2025
                </p>
                <p className="text-xs text-gray-500 mt-1">Ontem</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Promoção especial
                </p>
                <p className="text-xs text-gray-600">
                  Taxa zero para novos investimentos
                </p>
                <p className="text-xs text-gray-500 mt-1">3 dias atrás</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Configurações Rápidas
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">
                  Notificações por email
                </p>
                <p className="text-sm text-gray-500">
                  Receba avisos importantes
                </p>
              </div>
              <button className="w-12 h-6 bg-teal-600 rounded-full relative">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Notificações push</p>
                <p className="text-sm text-gray-500">Alerts no celular</p>
              </div>
              <button className="w-12 h-6 bg-gray-300 rounded-full relative">
                <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1"></div>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Resumo mensal</p>
                <p className="text-sm text-gray-500">Relatório por email</p>
              </div>
              <button className="w-12 h-6 bg-teal-600 rounded-full relative">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
              </button>
            </div>

            <button className="w-full mt-4 text-teal-600 hover:text-teal-700 font-medium text-sm border border-teal-600 py-2 px-4 rounded hover:bg-teal-50 transition-colors">
              Ver todas as configurações
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
