import { authService } from './auth'

// Configuração do cliente HTTP para Supabase
export class HttpClient {
  private static instance: HttpClient
  private baseUrl: string
  private anonKey: string

  private constructor() {
    this.baseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321'
    this.anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'
  }

  public static getInstance(): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient()
    }
    return HttpClient.instance
  }

  /**
   * Headers padrão para requisições autenticadas
   */
  private getAuthHeaders(): Record<string, string> {
    const token = authService.getAuthToken()
    if (!token) {
      throw new Error('Token de autenticação não encontrado')
    }

    return {
      apikey: this.anonKey,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  }

  /**
   * Requisição GET genérica
   */
  public async get<T>(
    endpoint: string,
    params?: Record<string, string>,
  ): Promise<T> {
    let url = `${this.baseUrl}/rest/v1${endpoint}`

    if (params) {
      const searchParams = new URLSearchParams(params)
      url += `?${searchParams.toString()}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `Erro na requisição GET: ${response.statusText} - ${errorText}`,
      )
    }

    return response.json()
  }

  /**
   * Requisição POST genérica
   */
  public async post<T>(
    endpoint: string,
    data: any,
    options?: { returnRepresentation?: boolean },
  ): Promise<T> {
    const headers: Record<string, string> = {
      ...this.getAuthHeaders(),
    } as Record<string, string>

    if (options?.returnRepresentation) {
      headers['Prefer'] = 'return=representation'
    }

    const response = await fetch(`${this.baseUrl}/rest/v1${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `Erro na requisição POST: ${response.statusText} - ${errorText}`,
      )
    }

    const result = await response.json()
    return Array.isArray(result) ? result[0] : result
  }

  /**
   * Requisição PUT genérica
   */
  public async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}/rest/v1${endpoint}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `Erro na requisição PUT: ${response.statusText} - ${errorText}`,
      )
    }

    // Verificar se há conteúdo na resposta antes de tentar fazer parse do JSON
    const contentLength = response.headers.get('content-length')
    const contentType = response.headers.get('content-type')

    // Se não há conteúdo ou content-length é 0, retornar undefined
    if (contentLength === '0' || response.status === 204) {
      return undefined as T
    }

    // Se há content-type de JSON, tentar fazer parse
    if (contentType && contentType.includes('application/json')) {
      const text = await response.text()
      return text ? JSON.parse(text) : (undefined as T)
    }

    // Para outros casos, retornar undefined
    return undefined as T
  }

  /**
   * Requisição PATCH genérica (recomendada para atualizações no Supabase)
   */
  public async patch<T>(
    endpoint: string,
    data: any,
    options?: { returnRepresentation?: boolean },
  ): Promise<T> {
    const headers: Record<string, string> = {
      ...this.getAuthHeaders(),
    } as Record<string, string>

    if (options?.returnRepresentation) {
      headers['Prefer'] = 'return=representation'
    }

    const response = await fetch(`${this.baseUrl}/rest/v1${endpoint}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `Erro na requisição PATCH: ${response.statusText} - ${errorText}`,
      )
    }

    // Verificar se há conteúdo na resposta antes de tentar fazer parse do JSON
    const contentLength = response.headers.get('content-length')
    const contentType = response.headers.get('content-type')

    // Se não há conteúdo ou content-length é 0, retornar undefined
    if (contentLength === '0' || response.status === 204) {
      return undefined as T
    }

    // Se há content-type de JSON, tentar fazer parse
    if (contentType && contentType.includes('application/json')) {
      const text = await response.text()
      if (text) {
        const result = JSON.parse(text)
        return Array.isArray(result) ? result[0] : result
      }
    }

    // Para outros casos, retornar undefined
    return undefined as T
  }

  /**
   * Requisição DELETE genérica
   */
  public async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}/rest/v1${endpoint}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `Erro na requisição DELETE: ${response.statusText} - ${errorText}`,
      )
    }

    // Verificar se há conteúdo na resposta antes de tentar fazer parse do JSON
    const contentLength = response.headers.get('content-length')
    const contentType = response.headers.get('content-type')

    // Se não há conteúdo ou content-length é 0, retornar undefined
    if (contentLength === '0' || response.status === 204) {
      return undefined as T
    }

    // Se há content-type de JSON, tentar fazer parse
    if (contentType && contentType.includes('application/json')) {
      const text = await response.text()
      return text ? JSON.parse(text) : (undefined as T)
    }

    // Para outros casos, retornar undefined
    return undefined as T
  }
}

// Export da instância singleton
export const httpClient = HttpClient.getInstance()
