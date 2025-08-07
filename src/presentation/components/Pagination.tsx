import styled from "styled-components";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin: 32px 0;
`;

const PageButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== "active",
})<{ active?: boolean }>`
  background: ${(props) => (props.active ? "#ffd700" : "#2a2a2a")};
  color: ${(props) => (props.active ? "#000" : "#fff")};
  border: 1px solid ${(props) => (props.active ? "#ffd700" : "#444")};
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 40px;

  &:hover:not(:disabled) {
    background: ${(props) => (props.active ? "#ffd700" : "#444")};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const NavButton = styled(PageButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
`;

const PageInfo = styled.span`
  color: #888;
  font-size: 14px;
  margin: 0 16px;
`;

const Ellipsis = styled.span`
  color: #888;
  padding: 8px 4px;
`;

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <PaginationContainer>
      <NavButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft size={16} />
      </NavButton>

      {visiblePages.map((page, index) =>
        page === "..." ? (
          <Ellipsis key={`ellipsis-${index}`}>...</Ellipsis>
        ) : (
          <PageButton
            key={page}
            active={page === currentPage}
            onClick={() => onPageChange(page as number)}
          >
            {page}
          </PageButton>
        )
      )}

      <NavButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight size={16} />
      </NavButton>

      <PageInfo>
        Página {currentPage} de {totalPages}
      </PageInfo>
    </PaginationContainer>
  );
};
