import { createFileRoute } from '@tanstack/react-router'
import { AuthForm } from '../components/AuthForm'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ByteBank</h1>
          <p className="text-gray-600">Sistema de Autenticação</p>
        </div>
        <AuthForm />
      </div>
    </div>
  )
}
