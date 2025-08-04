import { authService } from './auth'

// Configurações para upload de arquivos
const RECEIPT_BUCKET = 'byte-bank'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/pdf',
]

/**
 * Faz upload de um comprovante para o Storage do Supabase
 * @param file - Arquivo a ser enviado
 * @param transactionId - ID da transação para organizar os arquivos
 * @param userId - ID do usuário para organizar os arquivos
 * @returns URL pública do arquivo ou null em caso de erro
 */
export async function uploadReceipt(
  file: File,
  transactionId: string,
  userId: string,
): Promise<{ url: string | null; error: string | null }> {
  try {
    // Validar tamanho do arquivo
    if (file.size > MAX_FILE_SIZE) {
      return {
        url: null,
        error: 'Arquivo muito grande. Tamanho máximo: 5MB',
      }
    }

    // Validar tipo do arquivo
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        url: null,
        error: 'Tipo de arquivo não permitido. Tipos aceitos: JPG, PNG, PDF',
      }
    }

    // Gerar nome único para o arquivo
    const fileExtension = file.name.split('.').pop()
    const fileName = `receipts/${userId}/${transactionId}/${Date.now()}.${fileExtension}`

    // Preparar FormData para upload
    const formData = new FormData()
    formData.append('file', file)

    // Obter token de autenticação
    const token = authService.getAuthToken()
    if (!token) {
      return {
        url: null,
        error: 'Token de autenticação não encontrado',
      }
    }

    // Fazer upload usando fetch diretamente para o Supabase Storage
    const baseUrl = import.meta.env.VITE_SUPABASE_URL
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    const uploadResponse = await fetch(
      `${baseUrl}/storage/v1/object/${RECEIPT_BUCKET}/${fileName}`,
      {
        method: 'POST',
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    )

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      console.error('Erro no upload:', errorText)
      return {
        url: null,
        error: `Erro no upload: ${uploadResponse.statusText}`,
      }
    }

    // Construir URL pública do arquivo
    const publicUrl = `${baseUrl}/storage/v1/object/public/${RECEIPT_BUCKET}/${fileName}`

    return {
      url: publicUrl,
      error: null,
    }
  } catch (error) {
    console.error('Erro no upload do comprovante:', error)
    return {
      url: null,
      error: 'Erro interno no upload do arquivo',
    }
  }
}

/**
 * Remove um comprovante do Storage do Supabase
 * @param receiptUrl - URL do comprovante a ser removido
 * @returns true se removido com sucesso, false caso contrário
 */
export async function deleteReceipt(receiptUrl: string): Promise<boolean> {
  try {
    // Extrair o caminho do arquivo da URL
    const url = new URL(receiptUrl)
    const pathParts = url.pathname.split(
      `/storage/v1/object/public/${RECEIPT_BUCKET}/`,
    )

    if (pathParts.length !== 2) {
      console.error('URL do comprovante inválida:', receiptUrl)
      return false
    }

    const filePath = pathParts[1]

    // Obter token de autenticação
    const token = authService.getAuthToken()
    if (!token) {
      console.error('Token de autenticação não encontrado')
      return false
    }

    // Remover arquivo do storage usando fetch
    const baseUrl = import.meta.env.VITE_SUPABASE_URL
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    const deleteResponse = await fetch(
      `${baseUrl}/storage/v1/object/${RECEIPT_BUCKET}/${filePath}`,
      {
        method: 'DELETE',
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (!deleteResponse.ok) {
      const errorText = await deleteResponse.text()
      console.error('Erro ao remover comprovante:', errorText)
      return false
    }

    return true
  } catch (error) {
    console.error('Erro ao processar remoção do comprovante:', error)
    return false
  }
}

/**
 * Lista todos os comprovantes de um usuário
 * @param userId - ID do usuário
 * @returns Lista de arquivos do usuário
 */
export async function listUserReceipts(userId: string) {
  try {
    // Obter token de autenticação
    const token = authService.getAuthToken()
    if (!token) {
      console.error('Token de autenticação não encontrado')
      return []
    }

    // Listar arquivos do storage usando fetch
    const baseUrl = import.meta.env.VITE_SUPABASE_URL
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    const listResponse = await fetch(
      `${baseUrl}/storage/v1/object/list/${RECEIPT_BUCKET}?prefix=receipts/${userId}&limit=100&offset=0&sortBy=created_at&order=desc`,
      {
        method: 'GET',
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (!listResponse.ok) {
      const errorText = await listResponse.text()
      console.error('Erro ao listar comprovantes:', errorText)
      return []
    }

    const data = await listResponse.json()
    return data || []
  } catch (error) {
    console.error('Erro ao processar listagem de comprovantes:', error)
    return []
  }
}

/**
 * Valida se um arquivo é válido para upload
 * @param file - Arquivo a ser validado
 * @returns objeto com resultado da validação
 */
export function validateReceiptFile(file: File): {
  isValid: boolean
  error?: string
} {
  // Validar tamanho
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: 'Arquivo muito grande. Tamanho máximo: 5MB',
    }
  }

  // Validar tipo
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'Tipo de arquivo não permitido. Tipos aceitos: JPG, PNG, PDF',
    }
  }

  return { isValid: true }
}
