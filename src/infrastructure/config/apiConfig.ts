export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3',
  API_KEY: import.meta.env.VITE_TMDB_API_KEY || 'demo_key',
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p'
}

// Validação das variáveis de ambiente
export const validateApiConfig = (): void => {
  if (!API_CONFIG.API_KEY || API_CONFIG.API_KEY === 'demo_key') {
    console.warn('⚠️ TMDB API Key não configurada. Defina VITE_TMDB_API_KEY no arquivo .env')
  }
}

