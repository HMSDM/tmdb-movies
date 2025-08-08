import { SlidersVertical, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { Movie } from "../../domain/entities/Movie";
import {
  useGetGenresUseCase,
  useSearchMoviesUseCase,
} from "../../infrastructure/di/container";
import { SortOption } from "../../shared/types";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { MovieCard } from "../components/MovieCard";
import { MovieFilters } from "../components/MovieFilters";
import { Pagination } from "../components/Pagination";
import { SearchBar } from "../components/SearchBar";
import { useMovieSearchViewModel } from "../viewmodels/MovieSearchViewModel";

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

export const Header = styled.header`
  background: #121113;
  padding: 24px 0;
  border-bottom: 1px solid #f1e6fd30;
`;

export const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  text-align: center;
`;

const SearchContainer = styled.div`
  position: relative;
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
  margin: 0 auto;
  padding: 0 24px 32px;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url(./src/assets/backgropund-krists-luhaers-unsplash.png);
    background-size: cover;
    opacity: 0.5;
  }
`;

const MoviesGrid = styled.div`
  background: #b744f714;
  padding: 24px;
  border-radius: 4px;
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
  position: relative;
  text-align: center;
  padding: 64px 24px;
  color: #888;
`;

const EmptyTitle = styled.h3`
  font-size: 24px;
  margin: 0 0 16px 0;
  color: #fff;
`;

const EmptyText = styled.p`
  font-size: 16px;
  margin: 0;
`;

const ResultsContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const ResultsInfo = styled.div`
  color: #888;
  font-size: 14px;
`;

const FilterTag = styled.div`
  display: inline-flex;
  align-items: center;
  background: #8e4ec6;
  border: 1px solid #8e4ec6;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 14px;
  color: #ffffff;
`;

const RemoveFilterButton = styled.button`
  background: none;
  border: none;
  color: #ff6666;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-left: 8px;
  padding: 0;

  &:hover {
    color: #ff8888;
  }
`;

export const MovieSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const searchMoviesUseCase = useSearchMoviesUseCase();
  const getGenresUseCase = useGetGenresUseCase();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [shouldRoll, setShouldRoll] = useState(false);
  const filtersRef = useRef<HTMLDivElement>(null);
  const pageContainerRef = useRef<HTMLDivElement>(null);

  const { movieSearchInfo, actions } = useMovieSearchViewModel(
    searchMoviesUseCase,
    getGenresUseCase
  );

  useEffect(() => {
    const loadData = async () => {
      if (movieSearchInfo.genres.length === 0) {
        await actions.loadGenres();
      }
      if (movieSearchInfo.movies.length === 0 && !movieSearchInfo.loading) {
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
    actions.searchMovies({ ...movieSearchInfo.filters, query, page: 1 });
    if (query.toLowerCase().trim() === "cubos") {
      setShouldRoll(true);
    }
  };

  const handleApplyFilters = (newFilters: any) => {
    actions.updateFilters(newFilters);
    actions.searchMovies({ ...newFilters, page: 1 });
    setIsFiltersOpen(false);
  };

  const handleRemoveFilter = (
    filterKey: keyof typeof movieSearchInfo.filters
  ) => {
    const newFilters = { ...movieSearchInfo.filters, [filterKey]: undefined };
    actions.updateFilters(newFilters);
    actions.searchMovies({ ...newFilters, page: 1 });
  };

  const handlePageChange = (page: number) => {
    actions.changePage(page);
  };

  const handleResetFilters = () => {
    actions.resetFilters();
    actions.searchMovies({ page: 1, sortBy: "popularity.desc" });
  };

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "popularity.desc", label: "Mais Popular" },
    { value: "popularity.asc", label: "Menos Popular" },
    { value: "vote_average.desc", label: "Melhor Avaliado" },
    { value: "vote_average.asc", label: "Pior Avaliado" },
    { value: "primary_release_date.desc", label: "Mais Recente" },
    { value: "primary_release_date.asc", label: "Mais Antigo" },
    { value: "title.asc", label: "Título A-Z" },
    { value: "title.desc", label: "Título Z-A" },
  ];

  const getFilterLabel = (
    key: keyof typeof movieSearchInfo.filters,
    value: any
  ) => {
    if (key === "genre") {
      const genre = movieSearchInfo.genres.find(
        (g) => g.id === parseInt(value)
      );
      return genre ? genre.name : "Gênero desconhecido";
    }
    if (key === "year") return value.toString();
    if (key === "sortBy") {
      const sortOption = sortOptions.find((option) => option.value === value);
      return sortOption ? sortOption.label : value;
    }
    if (key === "minRating") return `Nota mínima: ${value}`;
    return value;
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
            value={movieSearchInfo.filters.query || ""}
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
              filters={movieSearchInfo.filters}
              genres={movieSearchInfo.genres}
              onApplyFilters={handleApplyFilters}
              onReset={handleResetFilters}
            />
          </div>
        )}

        {movieSearchInfo.error && (
          <ErrorMessage>{movieSearchInfo.error}</ErrorMessage>
        )}

        {movieSearchInfo.pagination.totalResults > 0 && (
          <ResultsContainer>
            <ResultsInfo>
              {movieSearchInfo.pagination.totalResults.toLocaleString("pt-BR")}{" "}
              filmes encontrados
            </ResultsInfo>
            {Object.entries(movieSearchInfo.filters)
              .filter(
                ([key, value]) =>
                  key !== "page" &&
                  key !== "query" &&
                  value !== undefined &&
                  value !== "popularity.desc"
              )
              .map(([key, value]) => (
                <FilterTag key={key}>
                  {getFilterLabel(
                    key as keyof typeof movieSearchInfo.filters,
                    value
                  )}
                  <RemoveFilterButton
                    onClick={() =>
                      handleRemoveFilter(
                        key as keyof typeof movieSearchInfo.filters
                      )
                    }
                    aria-label={`Remover filtro ${getFilterLabel(
                      key as keyof typeof movieSearchInfo.filters,
                      value
                    )}`}
                  >
                    <X stroke="#fff" size={16} />
                  </RemoveFilterButton>
                </FilterTag>
              ))}
          </ResultsContainer>
        )}

        {movieSearchInfo.loading ? (
          <LoadingSpinner />
        ) : movieSearchInfo.movies.length > 0 ? (
          <>
            <MoviesGrid>
              {movieSearchInfo.movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  genres={movieSearchInfo.genres}
                  onClick={handleMovieClick}
                />
              ))}
            </MoviesGrid>

            <Pagination
              currentPage={movieSearchInfo.pagination.currentPage}
              totalPages={Math.min(movieSearchInfo.pagination.totalPages, 500)}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          !movieSearchInfo.loading && (
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
