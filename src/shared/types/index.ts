// Tipos básicos compartilhados
export interface PaginatedResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export interface ApiError {
  status_code: number
  status_message: string
  success: boolean
}

// Filtros de pesquisa
export interface MovieFilters {
  query?: string
  genre?: string
  year?: number
  sortBy?: string
  minRating?: number
  page?: number
}

// Opções de ordenação
export type SortOption = 
  | 'popularity.desc'
  | 'popularity.asc'
  | 'vote_average.desc'
  | 'vote_average.asc'
  | 'primary_release_date.desc'
  | 'primary_release_date.asc'
  | 'title.asc'
  | 'title.desc'

