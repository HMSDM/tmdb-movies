import { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto 32px;
`;

const SearchInput = styled.input`
  width: 100%;
  background: #2a2a2a;
  border: 2px solid #444;
  border-radius: 8px;
  color: #ffffff;
  padding: 16px 48px 16px 48px;
  font-size: 16px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #ffd700;
  }

  &::placeholder {
    color: #888;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  pointer-events: none;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.2s ease;

  &:hover {
    color: #fff;
  }
`;

// Custom debounce hook
const useDebounce = (callback: (value: string) => void, delay: number) => {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (value: string) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      const id = setTimeout(() => {
        callback(value);
      }, delay);
      setTimeoutId(id);
    },
    [callback, delay, timeoutId]
  );

  return debouncedCallback;
};

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onSearch,
  placeholder = "Pesquisar filmes...",
}) => {
  const [inputValue, setInputValue] = useState(value);

  // Update input value when prop value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Debounced search function
  const debouncedSearch = useDebounce(onSearch, 500);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    debouncedSearch(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(inputValue);
    }
  };

  const handleClear = () => {
    setInputValue("");
    onSearch("");
  };

  return (
    <SearchContainer>
      <SearchIcon>
        <Search size={20} />
      </SearchIcon>

      <SearchInput
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />

      {inputValue && (
        <ClearButton onClick={handleClear}>
          <X size={20} />
        </ClearButton>
      )}
    </SearchContainer>
  );
};
