import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase, type User, type AuthError } from '../lib/supabase'
import type { AuthResponse, Session } from '@supabase/supabase-js'

const AUTH_KEYS = {
  user: ['auth', 'user'] as const,
  session: ['auth', 'session'] as const,
}

export interface AuthState {
  user: User | null
  loading: boolean
  error: AuthError | null
}

// Auth API functions
const authApi = {
  signIn: async (email: string, password: string): Promise<AuthResponse> => {
    return await supabase.auth.signInWithPassword({ email, password })
  },

  signUp: async (
    email: string,
    password: string,
    fullName?: string,
  ): Promise<AuthResponse> => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
  },

  signOut: async () => {
    return await supabase.auth.signOut()
  },

  getSession: async (): Promise<Session | null> => {
    const { data } = await supabase.auth.getSession()
    return data.session
  },

  getUser: async (): Promise<User | null> => {
    const { data } = await supabase.auth.getUser()
    return data.user as User | null
  },
}

export function useAuth() {
  const queryClient = useQueryClient()

  // Query para obter o usuário atual
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: AUTH_KEYS.user,
    queryFn: authApi.getUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  })

  // Mutations para autenticação
  const signInMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.signIn(email, password),
    onSuccess: (data) => {
      if (data.data.user) {
        queryClient.setQueryData(AUTH_KEYS.user, data.data.user)
        queryClient.invalidateQueries({ queryKey: AUTH_KEYS.session })
      }
    },
    onError: (error) => {
      console.error('Sign in error:', error)
    },
  })

  const signUpMutation = useMutation({
    mutationFn: ({
      email,
      password,
      fullName,
    }: {
      email: string
      password: string
      fullName?: string
    }) => authApi.signUp(email, password, fullName),
    onSuccess: (data) => {
      if (data.data.user) {
        queryClient.setQueryData(AUTH_KEYS.user, data.data.user)
        queryClient.invalidateQueries({ queryKey: AUTH_KEYS.session })
      }
    },
    onError: (error) => {
      console.error('Sign up error:', error)
    },
  })

  const signOutMutation = useMutation({
    mutationFn: authApi.signOut,
    onSuccess: () => {
      queryClient.setQueryData(AUTH_KEYS.user, null)
      queryClient.removeQueries({ queryKey: AUTH_KEYS.session })
    },
    onError: (error) => {
      console.error('Sign out error:', error)
    },
  })

  // Listen para mudanças de estado de autenticação
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        queryClient.setQueryData(AUTH_KEYS.user, session.user as User)
      } else if (event === 'SIGNED_OUT') {
        queryClient.setQueryData(AUTH_KEYS.user, null)
      }
    })

    return () => subscription.unsubscribe()
  }, [queryClient])

  // Helper functions
  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInMutation.mutateAsync({ email, password })

      if (result.error) {
        return {
          success: false,
          error: {
            message: result.error.message,
            status: result.error.status,
          },
        }
      }

      return { success: true, user: result.data.user }
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error?.message || 'Erro inesperado ao fazer login',
        },
      }
    }
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const result = await signUpMutation.mutateAsync({
        email,
        password,
        fullName,
      })

      if (result.error) {
        return {
          success: false,
          error: {
            message: result.error.message,
            status: result.error.status,
          },
        }
      }

      return { success: true, user: result.data.user }
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error?.message || 'Erro inesperado ao criar conta',
        },
      }
    }
  }

  const signOut = async () => {
    try {
      await signOutMutation.mutateAsync()
      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error?.message || 'Erro inesperado ao fazer logout',
        },
      }
    }
  }

  return {
    user,
    loading:
      userLoading ||
      signInMutation.isPending ||
      signUpMutation.isPending ||
      signOutMutation.isPending,
    error: userError ? { message: userError.message } : null,
    signIn,
    signUp,
    signOut,
  }
}
