import { useState, useCallback } from "react";
import { Movie, Genre } from "../../domain/entities/Movie";
import { MovieFilters, PaginatedResponse } from "../../shared/types";
import { SearchMoviesUseCase } from "../../domain/usecases/SearchMoviesUseCase";
import { GetGenresUseCase } from "../../domain/usecases/GetGenresUseCase";

export interface MovieSearchViewModelState {
  movies: Movie[];
  genres: Genre[];
  filters: MovieFilters;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalResults: number;
  };
  loading: boolean;
  error: string | null;
}

export const useMovieSearchViewModel = (
  searchMoviesUseCase: SearchMoviesUseCase,
  getGenresUseCase: GetGenresUseCase
) => {
  const [movieSearchInfo, setMovieSearchInfo] =
    useState<MovieSearchViewModelState>({
      movies: [],
      genres: [],
      filters: {
        page: 1,
        sortBy: "popularity.desc",
      },
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalResults: 0,
      },
      loading: false,
      error: null,
    });

  const setLoading = useCallback((loading: boolean) => {
    setMovieSearchInfo((prev) => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setMovieSearchInfo((prev) => ({ ...prev, error }));
  }, []);

  const updateFilters = useCallback((newFilters: Partial<MovieFilters>) => {
    setMovieSearchInfo((prev) => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters, page: 1 },
    }));
  }, []);

  const searchMovies = useCallback(
    async (filters?: MovieFilters) => {
      const searchFilters = filters || movieSearchInfo.filters;
      setLoading(true);
      setError(null);

      try {
        const response: PaginatedResponse<Movie> =
          await searchMoviesUseCase.execute(searchFilters);

        setMovieSearchInfo((prev) => ({
          ...prev,
          movies: response.results,
          pagination: {
            currentPage: response.page,
            totalPages: response.total_pages,
            totalResults: response.total_results,
          },
          filters: searchFilters,
        }));
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Erro ao buscar filmes"
        );
      } finally {
        setLoading(false);
      }
    },
    [searchMoviesUseCase, setLoading, setError]
  );

  const loadGenres = useCallback(async () => {
    try {
      const genres = await getGenresUseCase.execute();
      setMovieSearchInfo((prev) => ({ ...prev, genres }));
    } catch (error) {
      console.error("Erro ao carregar gêneros:", error);
    }
  }, [getGenresUseCase]);

  const changePage = useCallback(
    async (page: number) => {
      const newFilters = { ...movieSearchInfo.filters, page };
      await searchMovies(newFilters);
    },
    [movieSearchInfo.filters, searchMovies]
  );

  const resetFilters = useCallback(() => {
    const defaultFilters: MovieFilters = {
      page: 1,
      sortBy: "popularity.desc",
    };
    setMovieSearchInfo((prev) => ({
      ...prev,
      filters: defaultFilters,
    }));
  }, []);

  return {
    movieSearchInfo,
    actions: {
      searchMovies,
      loadGenres,
      updateFilters,
      changePage,
      resetFilters,
      setError,
    },
  };
};
