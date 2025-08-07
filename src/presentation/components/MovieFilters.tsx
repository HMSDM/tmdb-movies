import styled from "styled-components";
import { Genre } from "../../domain/entities/Movie";
import { MovieFilters as Filters, SortOption } from "../../shared/types";
import { useState } from "react";

interface MovieFiltersProps {
  filters: Filters;
  genres: Genre[];
  onApplyFilters: (filters: Partial<Filters>) => void;
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

const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const ApplyButton = styled.button`
  background: #8e4ec6;
  border: none;
  border-radius: 4px;
  color: #ffffff;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.4s ease;

  &:hover {
    background-color: #b744f714;
  }
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

const ratingOptions: { value: number; label: string }[] = [
  { value: 0, label: "Qualquer nota" },
  { value: 1, label: "1+" },
  { value: 2, label: "2+" },
  { value: 3, label: "3+" },
  { value: 4, label: "4+" },
  { value: 5, label: "5+" },
  { value: 6, label: "6+" },
  { value: 7, label: "7+" },
  { value: 8, label: "8+" },
  { value: 9, label: "9+" },
];

export const MovieFilters: React.FC<MovieFiltersProps> = ({
  filters,
  genres,
  onApplyFilters,
  onReset,
}) => {
  const currentYear = new Date().getFullYear();
  const [tempFilters, setTempFilters] = useState<Partial<Filters>>(filters);

  const handleFilterChange = (newFilter: Partial<Filters>) => {
    setTempFilters((prev) => ({ ...prev, ...newFilter }));
  };

  const handleApply = () => {
    onApplyFilters(tempFilters);
  };

  const handleReset = () => {
    setTempFilters({ sortBy: "popularity.desc" });
    onReset();
  };

  return (
    <FiltersContainer>
      <FiltersGrid>
        <FilterGroup>
          <Label>Gênero</Label>
          <Select
            value={tempFilters.genre || ""}
            onChange={(e: any) =>
              handleFilterChange({ genre: e.target.value || undefined })
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
            value={tempFilters.year || ""}
            onChange={(e: any) =>
              handleFilterChange({
                year: e.target.value ? parseInt(e.target.value) : undefined,
              })
            }
          />
        </FilterGroup>

        <FilterGroup>
          <Label>Ordenar por</Label>
          <Select
            value={tempFilters.sortBy || "popularity.desc"}
            onChange={(e: any) =>
              handleFilterChange({ sortBy: e.target.value as SortOption })
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
          <Select
            value={tempFilters.minRating || 0}
            onChange={(e: any) =>
              handleFilterChange({
                minRating: parseFloat(e.target.value) || undefined,
              })
            }
          >
            {ratingOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FilterGroup>
      </FiltersGrid>

      <ButtonContainer>
        <ApplyButton onClick={handleApply}>Aplicar Filtros</ApplyButton>
        <ResetButton onClick={handleReset}>Limpar Filtros</ResetButton>
      </ButtonContainer>
    </FiltersContainer>
  );
};
