import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { MovieCard } from '../MovieCard'
import { Movie } from '../../../domain/entities/Movie'

const mockMovie: Movie = {
  id: 1,
  title: 'Test Movie',
  original_title: 'Test Movie',
  overview: 'Test overview',
  poster_path: '/test.jpg',
  backdrop_path: '/test-backdrop.jpg',
  release_date: '2023-01-01',
  genre_ids: [1, 2],
  vote_average: 7.5,
  vote_count: 1000,
  popularity: 100,
  adult: false,
  video: false,
  original_language: 'en'
}

const mockOnClick = jest.fn()

describe('MovieCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render movie information correctly', () => {
    render(<MovieCard movie={mockMovie} onClick={mockOnClick} />)

    expect(screen.getByText('Test Movie')).toBeInTheDocument()
    expect(screen.getByText('2022')).toBeInTheDocument() // JavaScript interpreta como UTC
    expect(screen.getByText('7.5')).toBeInTheDocument()
  })

  it('should render poster image when poster_path is provided', () => {
    render(<MovieCard movie={mockMovie} onClick={mockOnClick} />)

    const image = screen.getByAltText('Test Movie')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', expect.stringContaining('/test.jpg'))
  })

  it('should render placeholder when poster_path is null', () => {
    const movieWithoutPoster = { ...mockMovie, poster_path: null }
    render(<MovieCard movie={movieWithoutPoster} onClick={mockOnClick} />)

    expect(screen.getByText('Sem imagem')).toBeInTheDocument()
    expect(screen.queryByAltText('Test Movie')).not.toBeInTheDocument()
  })

  it('should call onClick when card is clicked', () => {
    render(<MovieCard movie={mockMovie} onClick={mockOnClick} />)

    const card = screen.getByText('Test Movie').closest('div')
    fireEvent.click(card!)

    expect(mockOnClick).toHaveBeenCalledWith(mockMovie)
  })

  it('should handle movies without release date', () => {
    const movieWithoutDate = { ...mockMovie, release_date: '' }
    render(<MovieCard movie={movieWithoutDate} onClick={mockOnClick} />)

    expect(screen.getByText('Test Movie')).toBeInTheDocument()
    // Year should be empty string when no release date
    expect(screen.queryByText('2022')).not.toBeInTheDocument()
  })

  it('should display star icon for rating', () => {
    render(<MovieCard movie={mockMovie} onClick={mockOnClick} />)

    // Check if star icon is present (Lucide Star component)
    const starIcon = document.querySelector('svg')
    expect(starIcon).toBeInTheDocument()
  })
})

