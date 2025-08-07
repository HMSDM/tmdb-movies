import { MovieRepository } from '../repositories/MovieRepository'
import { Movie } from '../entities/Movie'
import { PaginatedResponse, MovieFilters } from '../../shared/types'

export class SearchMoviesUseCase {
  constructor(private movieRepository: MovieRepository) {}

  async execute(filters: MovieFilters): Promise<PaginatedResponse<Movie>> {
    // Se há uma query de texto, usa search, senão usa discover
    if (filters.query && filters.query.trim()) {
      return this.movieRepository.searchMovies(filters)
    } else {
      return this.movieRepository.discoverMovies(filters)
    }
  }
}

