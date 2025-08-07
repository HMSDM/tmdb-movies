import { Movie, MovieDetails, Genre } from "../entities/Movie";
import { PaginatedResponse, MovieFilters } from "../../shared/types";

export interface MovieRepository {
  searchMovies(filters: MovieFilters): Promise<PaginatedResponse<Movie>>;
  discoverMovies(filters: MovieFilters): Promise<PaginatedResponse<Movie>>;
  getMovieDetails(id: number): Promise<MovieDetails>;
  getGenres(): Promise<Genre[]>;
  getPopularMovies(page?: number): Promise<PaginatedResponse<Movie>>;
}
