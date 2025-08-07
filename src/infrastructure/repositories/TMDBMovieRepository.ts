import { MovieRepository } from "../../domain/repositories/MovieRepository";
import { Movie, MovieDetails, Genre } from "../../domain/entities/Movie";
import { PaginatedResponse, MovieFilters } from "../../shared/types";
import { HttpClient } from "../api/httpClient";

export class TMDBMovieRepository implements MovieRepository {
  constructor(private httpClient: HttpClient) {}

  async searchMovies(filters: MovieFilters): Promise<PaginatedResponse<Movie>> {
    const params: Record<string, any> = {
      page: filters.page || 1,
    };

    if (filters.query) {
      params.query = filters.query;
    }

    if (filters.year) {
      params.primary_release_year = filters.year;
    }

    return this.httpClient.get<PaginatedResponse<Movie>>(
      "/search/movie",
      params
    );
  }

  async discoverMovies(
    filters: MovieFilters
  ): Promise<PaginatedResponse<Movie>> {
    const params: Record<string, any> = {
      page: filters.page || 1,
      sort_by: filters.sortBy || "popularity.desc",
    };

    if (filters.genre) {
      params.with_genres = filters.genre;
    }

    if (filters.year) {
      params.primary_release_year = filters.year;
    }

    if (filters.minRating) {
      params["vote_average.gte"] = filters.minRating;
    }

    return this.httpClient.get<PaginatedResponse<Movie>>(
      "/discover/movie",
      params
    );
  }

  async getMovieDetails(id: number): Promise<MovieDetails> {
    return this.httpClient.get<MovieDetails>(`/movie/${id}`);
  }

  async getGenres(): Promise<Genre[]> {
    const response = await this.httpClient.get<{ genres: Genre[] }>(
      "/genre/movie/list"
    );
    return response.genres;
  }

  async getPopularMovies(page: number = 1): Promise<PaginatedResponse<Movie>> {
    return this.httpClient.get<PaginatedResponse<Movie>>("/movie/popular", {
      page,
    });
  }
}
