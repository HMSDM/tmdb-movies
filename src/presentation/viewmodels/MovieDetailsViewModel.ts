import { useState, useCallback } from 'react'
import { MovieDetails } from '../../domain/entities/Movie'
import { GetMovieDetailsUseCase } from '../../domain/usecases/GetMovieDetailsUseCase'

export interface MovieDetailsViewModelState {
  movie: MovieDetails | null
  loading: boolean
  error: string | null
}

export const useMovieDetailsViewModel = (
  getMovieDetailsUseCase: GetMovieDetailsUseCase
) => {
  const [state, setState] = useState<MovieDetailsViewModelState>({
    movie: null,
    loading: false,
    error: null
  })

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }))
  }, [])

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }))
  }, [])

  const loadMovieDetails = useCallback(async (id: number) => {
    setLoading(true)
    setError(null)

    try {
      const movie = await getMovieDetailsUseCase.execute(id)
      setState(prev => ({ ...prev, movie }))
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao carregar detalhes do filme')
    } finally {
      setLoading(false)
    }
  }, [getMovieDetailsUseCase, setLoading, setError])

  const clearMovie = useCallback(() => {
    setState(prev => ({ ...prev, movie: null, error: null }))
  }, [])

  return {
    state,
    actions: {
      loadMovieDetails,
      clearMovie,
      setError
    }
  }
}

