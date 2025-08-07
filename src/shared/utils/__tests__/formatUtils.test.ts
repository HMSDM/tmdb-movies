import {
  formatDate,
  formatYear,
  formatRuntime,
  formatCurrency,
  formatRating,
  formatVoteCount
} from '../formatUtils'

describe('formatUtils', () => {
  describe('formatDate', () => {
    it('should format valid date string', () => {
      const result = formatDate('2023-12-25')
      expect(result).toContain('dezembro')
      expect(result).toContain('2023')
    })

    it('should handle empty string', () => {
      expect(formatDate('')).toBe('Data não disponível')
    })

    it('should handle invalid date', () => {
      const result = formatDate('invalid-date')
      expect(result).toBe('Data inválida')
    })
  })

  describe('formatYear', () => {
    it('should extract year from date string', () => {
      const result = formatYear('2023-12-25')
      expect(result).toBe('2023')
    })

    it('should handle empty string', () => {
      expect(formatYear('')).toBe('')
    })

    it('should handle invalid date', () => {
      expect(formatYear('invalid-date')).toBe('')
    })
  })

  describe('formatRuntime', () => {
    it('should format runtime with hours and minutes', () => {
      expect(formatRuntime(125)).toBe('2h 5min')
    })

    it('should format runtime with only minutes', () => {
      expect(formatRuntime(45)).toBe('45min')
    })

    it('should handle null runtime', () => {
      expect(formatRuntime(null)).toBe('Duração não disponível')
    })

    it('should handle zero runtime', () => {
      expect(formatRuntime(0)).toBe('Duração não disponível')
    })
  })

  describe('formatCurrency', () => {
    it('should format currency amount', () => {
      const result = formatCurrency(1000000)
      expect(result).toContain('1.000.000')
      expect(result).toContain('US$')
    })

    it('should handle zero amount', () => {
      expect(formatCurrency(0)).toBe('Não informado')
    })

    it('should handle null amount', () => {
      expect(formatCurrency(null as any)).toBe('Não informado')
    })
  })

  describe('formatRating', () => {
    it('should format rating to one decimal place', () => {
      expect(formatRating(7.856)).toBe('7.9')
    })

    it('should format whole number rating', () => {
      expect(formatRating(8)).toBe('8.0')
    })
  })

  describe('formatVoteCount', () => {
    it('should format large vote count with M suffix', () => {
      expect(formatVoteCount(1500000)).toBe('1.5M')
    })

    it('should format medium vote count with K suffix', () => {
      expect(formatVoteCount(1500)).toBe('1.5K')
    })

    it('should format small vote count as is', () => {
      expect(formatVoteCount(500)).toBe('500')
    })
  })
})

