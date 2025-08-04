import { Button } from '@bytebank/ui'

export interface PaginationProps {
  currentPage: number
  totalPages?: number
  totalItems?: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  showInfo?: boolean
  showFirstLast?: boolean
  maxVisiblePages?: number
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showInfo = true,
  showFirstLast = true,
  maxVisiblePages = 5,
}: PaginationProps) {
  // Calcular número total de páginas se não fornecido
  const calculatedTotalPages =
    totalPages || (totalItems ? Math.ceil(totalItems / itemsPerPage) : 1)

  // Se só há uma página, não mostrar paginação
  if (calculatedTotalPages <= 1) {
    return null
  }

  // Calcular range de páginas visíveis
  const getVisiblePages = () => {
    const pages = []
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(
      calculatedTotalPages,
      startPage + maxVisiblePages - 1,
    )

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  const visiblePages = getVisiblePages()
  const hasPrevious = currentPage > 1
  const hasNext = currentPage < calculatedTotalPages

  // Calcular informações dos itens
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(
    currentPage * itemsPerPage,
    totalItems || currentPage * itemsPerPage,
  )

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
      {/* Informações dos resultados */}
      {showInfo && (
        <div className="text-sm text-muted-foreground">
          {totalItems ? (
            <>
              Mostrando {startItem} a {endItem} de {totalItems} resultados
            </>
          ) : (
            <>
              Página {currentPage} de {calculatedTotalPages}
            </>
          )}
        </div>
      )}

      {/* Controles de paginação */}
      <div className="flex items-center gap-2">
        {/* Primeira página */}
        {showFirstLast && currentPage > 2 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
              className="px-3"
            >
              1
            </Button>
            {currentPage > 3 && (
              <span className="text-muted-foreground px-2">...</span>
            )}
          </>
        )}

        {/* Página anterior */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevious}
          className="px-3"
        >
          Anterior
        </Button>

        {/* Páginas numeradas */}
        {visiblePages.map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPageChange(page)}
            className="px-3"
          >
            {page}
          </Button>
        ))}

        {/* Próxima página */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext}
          className="px-3"
        >
          Próxima
        </Button>

        {/* Última página */}
        {showFirstLast && currentPage < calculatedTotalPages - 1 && (
          <>
            {currentPage < calculatedTotalPages - 2 && (
              <span className="text-muted-foreground px-2">...</span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(calculatedTotalPages)}
              className="px-3"
            >
              {calculatedTotalPages}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

// Componente simplificado para casos mais básicos
export interface SimplePaginationProps {
  currentPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  onPageChange: (page: number) => void
  itemCount?: number
  totalCount?: number
}

export function SimplePagination({
  currentPage,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
  itemCount,
  totalCount,
}: SimplePaginationProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="text-sm text-muted-foreground">
        {totalCount && itemCount ? (
          <>
            Página {currentPage} • {itemCount} de {totalCount} itens
          </>
        ) : (
          <>Página {currentPage}</>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPreviousPage}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
        >
          Próxima
        </Button>
      </div>
    </div>
  )
}

/*
Exemplos de uso:

// Paginação completa com todas as funcionalidades
<Pagination
  currentPage={currentPage}
  totalItems={1500}
  itemsPerPage={20}
  onPageChange={setCurrentPage}
  showInfo={true}
  showFirstLast={true}
  maxVisiblePages={5}
/>

// Paginação simples
<SimplePagination
  currentPage={currentPage}
  hasNextPage={hasNextPage}
  hasPreviousPage={hasPreviousPage}
  onPageChange={setCurrentPage}
  itemCount={20}
  totalCount={1500}
/>
*/
