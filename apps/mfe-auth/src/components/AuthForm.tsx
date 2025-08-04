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
    <div className="flex flex-col items-center justify-center min-h-screen">
      <SignUp onToggleMode={toggleMode} />
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <SignIn onToggleMode={toggleMode} />
    </div>
  )
}
