import { render, screen, fireEvent } from "@testing-library/react";
import { Pagination } from "../Pagination";

const mockOnPageChange = jest.fn();

describe("Pagination", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not render when totalPages is 1 or less", () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it("should render pagination controls when totalPages > 1", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText("Página 1 de 5")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("should disable previous button on first page", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const prevButton = screen.getAllByRole("button")[0];
    expect(prevButton).toBeDisabled();
  });

  it("should disable next button on last page", () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const buttons = screen.getAllByRole("button");
    const nextButton = buttons[buttons.length - 1];
    expect(nextButton).toBeDisabled();
  });

  it("should call onPageChange when page button is clicked", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const page3Button = screen.getByText("3");
    fireEvent.click(page3Button);

    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it("should call onPageChange when next button is clicked", () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const buttons = screen.getAllByRole("button");
    const nextButton = buttons[buttons.length - 1];
    fireEvent.click(nextButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it("should call onPageChange when previous button is clicked", () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const prevButton = screen.getAllByRole("button")[0];
    fireEvent.click(prevButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it("should show ellipsis for large page ranges", () => {
    render(
      <Pagination
        currentPage={10}
        totalPages={20}
        onPageChange={mockOnPageChange}
      />
    );

    const ellipsis = screen.getAllByText("...");
    expect(ellipsis.length).toBeGreaterThan(0);
  });

  it("should highlight current page", () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const currentPageButton = screen.getByText("3");
    expect(currentPageButton).toBeInTheDocument();
    // The active styling is applied via styled-components,
    // so we can't easily test the visual styling in unit tests
  });
});
