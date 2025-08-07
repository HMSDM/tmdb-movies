import { MovieRepository } from '../repositories/MovieRepository'
import { Genre } from '../entities/Movie'

export class GetGenresUseCase {
  constructor(private movieRepository: MovieRepository) {}

  async execute(): Promise<Genre[]> {
    return this.movieRepository.getGenres()
  }
}

