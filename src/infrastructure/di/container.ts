import { FetchHttpClient } from '../api/httpClient'
import { TMDBMovieRepository } from '../repositories/TMDBMovieRepository'
import { SearchMoviesUseCase } from '../../domain/usecases/SearchMoviesUseCase'
import { GetMovieDetailsUseCase } from '../../domain/usecases/GetMovieDetailsUseCase'
import { GetGenresUseCase } from '../../domain/usecases/GetGenresUseCase'
import { API_CONFIG } from '../config/apiConfig'

// Container simples para injeção de dependências
class DIContainer {
  private instances = new Map<string, any>()

  register<T>(key: string, factory: () => T): void {
    this.instances.set(key, factory)
  }

  get<T>(key: string): T {
    const factory = this.instances.get(key)
    if (!factory) {
      throw new Error(`Dependência não encontrada: ${key}`)
    }
    return factory()
  }
}

// Configuração do container
export const container = new DIContainer()

// Registrar dependências
container.register('httpClient', () => 
  new FetchHttpClient(API_CONFIG.BASE_URL, API_CONFIG.API_KEY)
)

container.register('movieRepository', () => 
  new TMDBMovieRepository(container.get('httpClient'))
)

container.register('searchMoviesUseCase', () => 
  new SearchMoviesUseCase(container.get('movieRepository'))
)

container.register('getMovieDetailsUseCase', () => 
  new GetMovieDetailsUseCase(container.get('movieRepository'))
)

container.register('getGenresUseCase', () => 
  new GetGenresUseCase(container.get('movieRepository'))
)

// Hooks para facilitar o uso nos componentes
export const useSearchMoviesUseCase = () => container.get<SearchMoviesUseCase>('searchMoviesUseCase')
export const useGetMovieDetailsUseCase = () => container.get<GetMovieDetailsUseCase>('getMovieDetailsUseCase')
export const useGetGenresUseCase = () => container.get<GetGenresUseCase>('getGenresUseCase')

