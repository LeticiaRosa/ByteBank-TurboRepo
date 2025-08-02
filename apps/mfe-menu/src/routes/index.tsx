import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: () => (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">ByteBank Menu</h1>
      <p>Bem-vindo ao menu principal do ByteBank!</p>
    </div>
  ),
})
