import {
  getImageUrl,
  getPosterUrl,
  getBackdropUrl,
  getThumbnailUrl
} from '../imageUtils'

describe('imageUtils', () => {
  describe('getImageUrl', () => {
    it('should return full image URL with default size', () => {
      const path = '/example.jpg'
      const expected = 'https://image.tmdb.org/t/p/w500/example.jpg'
      expect(getImageUrl(path)).toBe(expected)
    })

    it('should return full image URL with custom size', () => {
      const path = '/example.jpg'
      const expected = 'https://image.tmdb.org/t/p/w300/example.jpg'
      expect(getImageUrl(path, 'w300')).toBe(expected)
    })

    it('should return placeholder for null path', () => {
      expect(getImageUrl(null)).toBe('/placeholder-movie.jpg')
    })

    it('should return placeholder for empty path', () => {
      expect(getImageUrl('')).toBe('/placeholder-movie.jpg')
    })
  })

  describe('getPosterUrl', () => {
    it('should return poster URL with w500 size', () => {
      const path = '/poster.jpg'
      const expected = 'https://image.tmdb.org/t/p/w500/poster.jpg'
      expect(getPosterUrl(path)).toBe(expected)
    })

    it('should return placeholder for null path', () => {
      expect(getPosterUrl(null)).toBe('/placeholder-movie.jpg')
    })
  })

  describe('getBackdropUrl', () => {
    it('should return backdrop URL with w1280 size', () => {
      const path = '/backdrop.jpg'
      const expected = 'https://image.tmdb.org/t/p/w1280/backdrop.jpg'
      expect(getBackdropUrl(path)).toBe(expected)
    })

    it('should return placeholder for null path', () => {
      expect(getBackdropUrl(null)).toBe('/placeholder-movie.jpg')
    })
  })

  describe('getThumbnailUrl', () => {
    it('should return thumbnail URL with w300 size', () => {
      const path = '/thumbnail.jpg'
      const expected = 'https://image.tmdb.org/t/p/w300/thumbnail.jpg'
      expect(getThumbnailUrl(path)).toBe(expected)
    })

    it('should return placeholder for null path', () => {
      expect(getThumbnailUrl(null)).toBe('/placeholder-movie.jpg')
    })
  })
})

