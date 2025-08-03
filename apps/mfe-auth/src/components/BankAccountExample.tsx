import { useAuth } from '../hooks/useAuth'

export function BankAccountExample() {
  const { user, createBankAccount, loading } = useAuth()

  const handleCreateBankAccount = async () => {
    try {
      const result = await createBankAccount({
        account_type: 'savings', // Conta poupança
        balance: 0, // Saldo inicial
        currency: 'BRL',
      })

      if (result.success) {
        console.log('Conta bancária criada:', result.bankAccount)
        alert('Conta bancária criada com sucesso!')
      } else {
        console.error('Erro:', result.error)
        alert(`Erro ao criar conta: ${result.error?.message}`)
      }
    } catch (error) {
      console.error('Erro inesperado:', error)
      alert('Erro inesperado ao criar conta bancária')
    }
  }

  if (!user) {
    return <div>Usuário não autenticado</div>
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        Exemplo de Criação de Conta Bancária
      </h2>

      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Usuário Logado</h3>
        <p>ID: {user.id}</p>
        <p>Email: {user.email}</p>
        <p>Nome: {user.user_metadata?.full_name || 'Não informado'}</p>
      </div>

      <button
        onClick={handleCreateBankAccount}
        disabled={loading}
        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
      >
        {loading ? 'Criando...' : 'Criar Conta Poupança'}
      </button>

      <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
        <h4 className="font-semibold mb-2">ℹ️ Informação:</h4>
        <p>
          Quando um usuário se cadastra na aplicação, uma conta corrente é
          criada automaticamente. Este botão permite criar contas adicionais
          (como poupança ou empresarial).
        </p>
      </div>
    </div>
  )
}
