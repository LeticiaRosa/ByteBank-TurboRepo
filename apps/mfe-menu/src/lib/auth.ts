// Serviço de autenticação - responsabilidade única para gerenciar tokens e usuários
export class AuthService {
  private static instance: AuthService

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  /**
   * Obtém o token de autenticação do localStorage
   * Centraliza a lógica de busca do token em diferentes formatos
   */
  public getAuthToken(): string | null {
    try {
      // Verifica várias possíveis chaves onde o Supabase pode armazenar o token
      const possibleKeys = [
        'sb-access-token',
        'supabase.auth.token',
        'sb-auth-token',
      ]

      for (const key of possibleKeys) {
        const item = localStorage.getItem(key)
        if (item) {
          try {
            const parsed = JSON.parse(item)
            if (parsed.access_token) {
              return parsed.access_token
            }
            if (parsed.session?.access_token) {
              return parsed.session.access_token
            }
          } catch {
            // Se não é JSON, assume que é o token direto
            if (item && item.length > 20) {
              return item
            }
          }
        }
      }

      // Verifica todas as chaves que começam com 'sb-'
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('sb-') && key.includes('auth')) {
          const item = localStorage.getItem(key)
          if (item) {
            try {
              const parsed = JSON.parse(item)
              if (parsed.access_token) {
                return parsed.access_token
              }
            } catch {
              // Ignora erros de parsing
            }
          }
        }
      }

      return null
    } catch (error) {
      console.error('Erro ao obter token de autenticação:', error)
      return null
    }
  }

  /**
   * Decodifica o JWT token para obter informações do usuário
   */
  public decodeToken(
    token: string,
  ): { sub: string; [key: string]: any } | null {
    try {
      const tokenParts = token.split('.')
      if (tokenParts.length !== 3) {
        throw new Error('Token JWT inválido')
      }

      const payload = JSON.parse(atob(tokenParts[1]))
      return payload
    } catch (error) {
      console.error('Erro ao decodificar token:', error)
      return null
    }
  }

  /**
   * Obtém o ID do usuário atual do token
   */
  public getCurrentUserId(): string | null {
    const token = this.getAuthToken()
    if (!token) return null

    const payload = this.decodeToken(token)
    return payload?.sub || null
  }

  /**
   * Verifica se o usuário está autenticado
   */
  public isAuthenticated(): boolean {
    const token = this.getAuthToken()
    if (!token) return false

    const payload = this.decodeToken(token)
    if (!payload) return false

    // Verifica se o token não expirou
    const currentTime = Date.now() / 1000
    return payload.exp > currentTime
  }
}

// Export da instância singleton
export const authService = AuthService.getInstance()
