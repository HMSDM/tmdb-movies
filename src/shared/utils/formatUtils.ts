export const formatDate = (dateString: string): string => {
  if (!dateString) return "Data não disponível";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return "Data inválida";
  }
};

export const formatYear = (dateString: string): string => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    return date.getFullYear().toString();
  } catch {
    return "";
  }
};

export const formatRuntime = (minutes: number | null): string => {
  if (!minutes) return "Duração não disponível";

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }
  return `${remainingMinutes}m`;
};

export const translateStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    Released: "Lançado",
    "Post Production": "Pós-produção",
    "In Production": "Em produção",
    Planned: "Planejado",
    Canceled: "Cancelado",
    Rumored: "Rumor",
  };

  return statusMap[status] || status;
};

export const translateLanguage = (languageCode: string): string => {
  const languageMap: Record<string, string> = {
    en: "Inglês",
    pt: "Português",
    es: "Espanhol",
    fr: "Francês",
    de: "Alemão",
    it: "Italiano",
    ja: "Japonês",
    zh: "Chinês",
    ru: "Russo",
    ko: "Coreano",
  };

  return languageMap[languageCode] || languageCode;
};

export const formatCurrency = (amount: number): string => {
  if (!amount || amount === 0) return "Não informado";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const formatMovieBudget = (value: number): string => {
  if (!value || value === 0) return "$0";

  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }

  if (value >= 1_000_000) {
    return `$${Math.round(value / 1_000_000)}M`;
  }

  return `$${value.toLocaleString()}`;
};

export const calculateProfit = (revenue: number, budget: number): string => {
  const profit = revenue - budget;

  if (profit > 0) {
    return `+${formatMovieBudget(profit)}`;
  } else if (profit < 0) {
    return `${formatMovieBudget(profit)}`;
  }
  return formatMovieBudget(profit);
};

export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

export const formatVoteCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};
