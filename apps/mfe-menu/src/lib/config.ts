/**
 * Obtém a URL do MFE de autenticação baseada no ambiente
 * @returns URL do MFE de autenticação
 */
export function getAuthUrl(): string {
  // Em produção, usa a variável de ambiente configurada
  if (import.meta.env.PROD) {
    return (
      import.meta.env.VITE_AUTH_MFE_URL ||
      'https://appbytebank-auth.netlify.app/'
    )
  }

  // Em desenvolvimento, usa localhost
  return 'http://localhost:3001'
}
