import { useEffect, useState, useRef } from "react";
import styled, { keyframes } from "styled-components";
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
import { SlidersVertical } from "lucide-react";

const barrelRoll = keyframes`
  0% {
    transform: perspective(1000px) rotateY(0);
  }
  100% {
    transform: perspective(1000px) rotateY(360deg);
  }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  background: #0a0a0a;
  color: #ffffff;

  &.barrel-roll {
    animation: ${barrelRoll} 1s linear;
  }
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

const SearchContainer = styled.div`
  justify-content: center;
  display: flex;
  align-items: center;
  width: 100%;
  gap: 16px;
  margin: 0 auto;
  padding: 32px 24px;
`;

const FilterButton = styled.button`
  background-color: #8e4ec6;
  border: 2px solid #b744f714;
  border-radius: 2px;
  color: #ffffff;
  padding: 16px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.4s ease;

  &:hover {
    background-color: #b744f714;
  }
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 32px;
  position: relative;
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
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [shouldRoll, setShouldRoll] = useState(false);
  const filtersRef = useRef<HTMLDivElement>(null);
  const pageContainerRef = useRef<HTMLDivElement>(null);

  const { state, actions } = useMovieSearchViewModel(
    searchMoviesUseCase,
    getGenresUseCase
  );

  useEffect(() => {
    const loadData = async () => {
      if (state.genres.length === 0) {
        await actions.loadGenres();
      }
      if (state.movies.length === 0 && !state.loading) {
        await actions.searchMovies();
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filtersRef.current &&
        !filtersRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest("button")
      ) {
        setIsFiltersOpen(false);
      }
    };

    if (isFiltersOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFiltersOpen]);

  useEffect(() => {
    if (shouldRoll && pageContainerRef.current) {
      const element = pageContainerRef.current;
      element.classList.add("barrel-roll");

      const handleAnimationEnd = () => {
        element.classList.remove("barrel-roll");
        setShouldRoll(false);
      };

      element.addEventListener("animationend", handleAnimationEnd);

      return () => {
        element.removeEventListener("animationend", handleAnimationEnd);
      };
    }
  }, [shouldRoll]);

  const handleMovieClick = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
  };

  const handleSearch = (query: string) => {
    actions.updateFilters({ query });
    actions.searchMovies({ ...state.filters, query, page: 1 });
    if (query.toLowerCase().trim() === "cubos") {
      setShouldRoll(true);
    }
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
    <PageContainer ref={pageContainerRef}>
      <Header>
        <HeaderContent>
          <img src="./src/assets/Cubos-Movies-Title.svg" alt="" />
        </HeaderContent>
      </Header>

      <MainContent>
        <SearchContainer>
          <SearchBar
            value={state.filters.query || ""}
            onSearch={handleSearch}
            placeholder="Pesquise por filmes"
          />
          <FilterButton onClick={() => setIsFiltersOpen(!isFiltersOpen)}>
            <SlidersVertical size={20} />
          </FilterButton>
        </SearchContainer>

        {isFiltersOpen && (
          <div ref={filtersRef}>
            <MovieFilters
              filters={state.filters}
              genres={state.genres}
              onFiltersChange={handleFiltersChange}
              onReset={handleResetFilters}
            />
          </div>
        )}

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
                  genres={state.genres}
                  onClick={handleMovieClick}
                />
              ))}
            </MoviesGrid>

            <Pagination
              currentPage={state.pagination.currentPage}
              totalPages={Math.min(state.pagination.totalPages, 500)}
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
