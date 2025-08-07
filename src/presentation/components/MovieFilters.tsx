import styled from "styled-components";
import { Genre } from "../../domain/entities/Movie";
import { MovieFilters as Filters, SortOption } from "../../shared/types";

interface MovieFiltersProps {
  filters: Filters;
  genres: Genre[];
  onFiltersChange: (filters: Partial<Filters>) => void;
  onReset: () => void;
}

const FiltersContainer = styled.div`
  background: #1a1a1a;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
  position: absolute;
  top: 100px;
  left: 24px;
  right: 24px;
  z-index: 10;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
`;

const Select = styled.select`
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 4px;
  color: #ffffff;
  padding: 8px 12px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #666;
  }

  option {
    background: #2a2a2a;
    color: #ffffff;
  }
`;

const Input = styled.input`
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 4px;
  color: #ffffff;
  padding: 8px 12px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #666;
  }

  &::placeholder {
    color: #888;
  }
`;

const RangeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RangeInput = styled.input`
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: #444;
  outline: none;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #ffd700;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #ffd700;
    cursor: pointer;
    border: none;
  }
`;

const RangeValue = styled.span`
  color: #888;
  font-size: 12px;
  text-align: center;
`;

const ResetButton = styled.button`
  background: #444;
  border: none;
  border-radius: 4px;
  color: #ffffff;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #555;
  }
`;

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

export const MovieFilters: React.FC<MovieFiltersProps> = ({
  filters,
  genres,
  onFiltersChange,
  onReset,
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <FiltersContainer>
      <FiltersGrid>
        <FilterGroup>
          <Label>Gênero</Label>
          <Select
            value={filters.genre || ""}
            onChange={(e: any) =>
              onFiltersChange({ genre: e.target.value || undefined })
            }
          >
            <option value="">Todos os gêneros</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </Select>
        </FilterGroup>

        <FilterGroup>
          <Label>Ano</Label>
          <Input
            type="number"
            placeholder="Ex: 2023"
            min="1900"
            max={currentYear}
            value={filters.year || ""}
            onChange={(e: any) =>
              onFiltersChange({
                year: e.target.value ? parseInt(e.target.value) : undefined,
              })
            }
          />
        </FilterGroup>

        <FilterGroup>
          <Label>Ordenar por</Label>
          <Select
            value={filters.sortBy || "popularity.desc"}
            onChange={(e: any) =>
              onFiltersChange({ sortBy: e.target.value as SortOption })
            }
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FilterGroup>

        <FilterGroup>
          <Label>Nota mínima</Label>
          <RangeContainer>
            <RangeInput
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={filters.minRating || 0}
              onChange={(e: any) =>
                onFiltersChange({
                  minRating: parseFloat(e.target.value) || undefined,
                })
              }
            />
            <RangeValue>
              {filters.minRating ? `${filters.minRating}+` : "Qualquer nota"}
            </RangeValue>
          </RangeContainer>
        </FilterGroup>
      </FiltersGrid>

      <ResetButton onClick={onReset}>Limpar Filtros</ResetButton>
    </FiltersContainer>
  );
};
