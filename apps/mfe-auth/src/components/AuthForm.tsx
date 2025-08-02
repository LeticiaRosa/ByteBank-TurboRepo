import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { SignIn } from './SignIn'
import { SignUp } from './SignUp'
import { UserProfile } from './UserProfile'

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const { user } = useAuth()

  const toggleMode = () => setIsSignUp(!isSignUp)

  if (user) {
    return <UserProfile />
  }

  return isSignUp ? (
    <SignUp onToggleMode={toggleMode} />
  ) : (
    <SignIn onToggleMode={toggleMode} />
  )
}
