import { useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { MovieCard } from "../components/MovieCard";
import { SearchBar } from "../components/SearchBar";
import { MovieFilters } from "../components/MovieFilters";
import { Pagination } from "../components/Pagination";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useMovieSearchViewModel } from "../viewmodels/MovieSearchViewModel";
import {
  useSearchMoviesUseCase,
  useGetGenresUseCase,
} from "../../infrastructure/di/container";
import { Movie } from "../../domain/entities/Movie";

const PageContainer = styled.div`
  min-height: 100vh;
  background: #0a0a0a;
  color: #ffffff;
`;

const Header = styled.header`
  background: #1a1a1a;
  padding: 24px 0;
  border-bottom: 1px solid #333;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #ffd700;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #888;
  margin: 0;
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
`;

const MoviesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const ErrorMessage = styled.div`
  background: #2a1a1a;
  border: 1px solid #ff4444;
  border-radius: 8px;
  padding: 16px;
  margin: 24px 0;
  color: #ff6666;
  text-align: center;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 64px 24px;
  color: #888;
`;

const EmptyTitle = styled.h3`
  font-size: 24px;
  margin: 0 0 16px 0;
  color: #666;
`;

const EmptyText = styled.p`
  font-size: 16px;
  margin: 0;
`;

const ResultsInfo = styled.div`
  margin-bottom: 24px;
  color: #888;
  font-size: 14px;
`;

export const MovieSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const searchMoviesUseCase = useSearchMoviesUseCase();
  const getGenresUseCase = useGetGenresUseCase();

  const { state, actions } = useMovieSearchViewModel(
    searchMoviesUseCase,
    getGenresUseCase
  );

  useEffect(() => {
    // Carregar gêneros e filmes populares na inicialização
    const loadData = async () => {
      if (state.genres.length === 0) {
        await actions.loadGenres();
      }
      if (state.movies.length === 0 && !state.loading) {
        await actions.searchMovies();
      }
    };
    loadData();
  }, []); // Mantenha o array de dependências vazio para executar apenas uma vez

  const handleMovieClick = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
  };

  const handleSearch = (query: string) => {
    actions.updateFilters({ query });
    actions.searchMovies({ ...state.filters, query, page: 1 });
  };

  const handleFiltersChange = (newFilters: any) => {
    actions.updateFilters(newFilters);
    actions.searchMovies({ ...state.filters, ...newFilters, page: 1 });
  };

  const handlePageChange = (page: number) => {
    actions.changePage(page);
  };

  const handleResetFilters = () => {
    actions.resetFilters();
    actions.searchMovies({ page: 1, sortBy: "popularity.desc" });
  };

  return (
    <PageContainer>
      <Header>
        <HeaderContent>
          <img src="./src/assets/Cubos-Movies-Title.svg" alt="" />
          {/* <Subtitle>Descubra filmes incríveis</Subtitle> */}
        </HeaderContent>
      </Header>

      <MainContent>
        <SearchBar
          value={state.filters.query || ""}
          onSearch={handleSearch}
          placeholder="Pesquise por filmes"
        />

        <MovieFilters
          filters={state.filters}
          genres={state.genres}
          onFiltersChange={handleFiltersChange}
          onReset={handleResetFilters}
        />

        {state.error && <ErrorMessage>{state.error}</ErrorMessage>}

        {state.pagination.totalResults > 0 && (
          <ResultsInfo>
            {state.pagination.totalResults.toLocaleString("pt-BR")} filmes
            encontrados
          </ResultsInfo>
        )}

        {state.loading ? (
          <LoadingSpinner />
        ) : state.movies.length > 0 ? (
          <>
            <MoviesGrid>
              {state.movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={handleMovieClick}
                />
              ))}
            </MoviesGrid>

            <Pagination
              currentPage={state.pagination.currentPage}
              totalPages={Math.min(state.pagination.totalPages, 500)} // TMDB limita a 500 páginas
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          !state.loading && (
            <EmptyState>
              <EmptyTitle>Nenhum filme encontrado</EmptyTitle>
              <EmptyText>
                Tente ajustar os filtros ou fazer uma nova pesquisa
              </EmptyText>
            </EmptyState>
          )
        )}
      </MainContent>
    </PageContainer>
  );
};
