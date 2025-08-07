import { SearchMoviesUseCase } from "../SearchMoviesUseCase";
import { MovieRepository } from "../../repositories/MovieRepository";
import { Movie } from "../../entities/Movie";
import { PaginatedResponse, MovieFilters } from "../../../shared/types";

const mockMovieRepository: jest.Mocked<MovieRepository> = {
  searchMovies: jest.fn(),
  discoverMovies: jest.fn(),
  getMovieDetails: jest.fn(),
  getGenres: jest.fn(),
  getPopularMovies: jest.fn(),
};

const mockMovie: Movie = {
  id: 1,
  title: "Test Movie",
  original_title: "Test Movie",
  overview: "Test overview",
  poster_path: "/test.jpg",
  backdrop_path: "/test-backdrop.jpg",
  release_date: "2023-01-01",
  genre_ids: [1, 2],
  vote_average: 7.5,
  vote_count: 1000,
  popularity: 100,
  adult: false,
  video: false,
  original_language: "en",
};

const mockResponse: PaginatedResponse<Movie> = {
  page: 1,
  results: [mockMovie],
  total_pages: 10,
  total_results: 100,
};

describe("SearchMoviesUseCase", () => {
  let useCase: SearchMoviesUseCase;

  beforeEach(() => {
    useCase = new SearchMoviesUseCase(mockMovieRepository);
    jest.clearAllMocks();
  });

  it("should call searchMovies when query is provided", async () => {
    const filters: MovieFilters = {
      query: "test movie",
      page: 1,
    };

    mockMovieRepository.searchMovies.mockResolvedValue(mockResponse);

    const result = await useCase.execute(filters);

    expect(mockMovieRepository.searchMovies).toHaveBeenCalledWith(filters);
    expect(mockMovieRepository.discoverMovies).not.toHaveBeenCalled();
    expect(result).toEqual(mockResponse);
  });

  it("should call discoverMovies when no query is provided", async () => {
    const filters: MovieFilters = {
      page: 1,
      genre: "1",
    };

    mockMovieRepository.discoverMovies.mockResolvedValue(mockResponse);

    const result = await useCase.execute(filters);

    expect(mockMovieRepository.discoverMovies).toHaveBeenCalledWith(filters);
    expect(mockMovieRepository.searchMovies).not.toHaveBeenCalled();
    expect(result).toEqual(mockResponse);
  });

  it("should call discoverMovies when query is empty string", async () => {
    const filters: MovieFilters = {
      query: "",
      page: 1,
    };

    mockMovieRepository.discoverMovies.mockResolvedValue(mockResponse);

    const result = await useCase.execute(filters);

    expect(mockMovieRepository.discoverMovies).toHaveBeenCalledWith(filters);
    expect(mockMovieRepository.searchMovies).not.toHaveBeenCalled();
    expect(result).toEqual(mockResponse);
  });

  it("should call discoverMovies when query is only whitespace", async () => {
    const filters: MovieFilters = {
      query: "   ",
      page: 1,
    };

    mockMovieRepository.discoverMovies.mockResolvedValue(mockResponse);

    const result = await useCase.execute(filters);

    expect(mockMovieRepository.discoverMovies).toHaveBeenCalledWith(filters);
    expect(mockMovieRepository.searchMovies).not.toHaveBeenCalled();
    expect(result).toEqual(mockResponse);
  });

  it("should propagate errors from repository", async () => {
    const filters: MovieFilters = {
      query: "test",
      page: 1,
    };

    const error = new Error("Repository error");
    mockMovieRepository.searchMovies.mockRejectedValue(error);

    await expect(useCase.execute(filters)).rejects.toThrow("Repository error");
  });
});
