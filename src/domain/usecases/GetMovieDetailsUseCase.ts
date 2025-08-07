import { MovieRepository } from '../repositories/MovieRepository'
import { MovieDetails } from '../entities/Movie'

export class GetMovieDetailsUseCase {
  constructor(private movieRepository: MovieRepository) {}

  async execute(id: number): Promise<MovieDetails> {
    return this.movieRepository.getMovieDetails(id)
  }
}

