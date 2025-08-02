import { createClient } from '@supabase/supabase-js'
import { clientEnv } from '@bytebank/env'
import type { Database } from './database.types'

export const supabase = createClient<Database>(
  clientEnv.VITE_SUPABASE_URL,
  clientEnv.VITE_SUPABASE_ANON_KEY,
)

export type User = {
  id: string
  email: string
  user_metadata?: {
    full_name?: string
  }
}

export type AuthError = {
  message: string
  status?: number
}
