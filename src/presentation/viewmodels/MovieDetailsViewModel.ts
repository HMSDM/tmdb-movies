import { useState, useCallback } from "react";
import { MovieDetails } from "../../domain/entities/Movie";
import { GetMovieDetailsUseCase } from "../../domain/usecases/GetMovieDetailsUseCase";

export interface MovieDetailsViewModelState {
  movie: MovieDetails | null;
  loading: boolean;
  error: string | null;
}

export const useMovieDetailsViewModel = (
  getMovieDetailsUseCase: GetMovieDetailsUseCase
) => {
  const [movieInfo, setMovieInfo] = useState<MovieDetailsViewModelState>({
    movie: null,
    loading: false,
    error: null,
  });

  const setLoading = useCallback((loading: boolean) => {
    setMovieInfo((prev) => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setMovieInfo((prev) => ({ ...prev, error }));
  }, []);

  const loadMovieDetails = useCallback(
    async (id: number) => {
      setLoading(true);
      setError(null);

      try {
        const movie = await getMovieDetailsUseCase.execute(id);
        setMovieInfo((prev) => ({ ...prev, movie }));
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Erro ao carregar detalhes do filme"
        );
      } finally {
        setLoading(false);
      }
    },
    [getMovieDetailsUseCase, setLoading, setError]
  );

  const clearMovie = useCallback(() => {
    setMovieInfo((prev) => ({ ...prev, movie: null, error: null }));
  }, []);

  return {
    movieInfo,
    actions: {
      loadMovieDetails,
      clearMovie,
      setError,
    },
  };
};
