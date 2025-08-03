import { createFileRoute } from '@tanstack/react-router'
import { AuthForm } from '../components/AuthForm'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return <AuthForm />
}
