export const API_CONFIG = {
  BASE_URL:
    import.meta.env.VITE_TMDB_BASE_URL || "https://api.themoviedb.org/3",
  API_KEY: import.meta.env.VITE_TMDB_API_KEY,
  IMAGE_BASE_URL: "https://image.tmdb.org/t/p",
};

// Validação das variáveis de ambiente
export const validateApiConfig = (): void => {
  if (!import.meta.env.VITE_TMDB_API_KEY) {
    throw new Error(
      "❌ Chave da API não encontrada. Crie um arquivo .env com VITE_TMDB_API_KEY"
    );
  }
};
