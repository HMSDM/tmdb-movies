export const formatDate = (dateString: string): string => {
  if (!dateString) return 'Data não disponível'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return 'Data inválida'
  }
}

export const formatYear = (dateString: string): string => {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    return date.getFullYear().toString()
  } catch {
    return ''
  }
}

export const formatRuntime = (minutes: number | null): string => {
  if (!minutes) return 'Duração não disponível'
  
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (hours > 0) {
    return `${hours}h ${remainingMinutes}min`
  }
  return `${remainingMinutes}min`
}

export const formatCurrency = (amount: number): string => {
  if (!amount || amount === 0) return 'Não informado'
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

export const formatRating = (rating: number): string => {
  return rating.toFixed(1)
}

export const formatVoteCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}

