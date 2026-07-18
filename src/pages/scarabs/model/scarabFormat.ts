export const formatChaosValue = (
  value: number | null | undefined,
  language: string,
  fallback: string,
  options?: { signed?: boolean; suffix?: string },
) => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return fallback;
  }

  const rounded = Math.abs(value) >= 10 ? value.toFixed(0) : value.toFixed(2);
  const sign = options?.signed && value > 0 ? '+' : '';

  return `${sign}${Number(rounded).toLocaleString(language)}${options?.suffix ?? ''}`;
};

export const formatPercentValue = (
  value: number | null | undefined,
  language: string,
  fallback: string,
) => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return fallback;
  }

  const sign = value > 0 ? '+' : '';

  return `${sign}${value.toLocaleString(language, {
    maximumFractionDigits: 1,
    minimumFractionDigits: Math.abs(value) < 10 ? 1 : 0,
  })}%`;
};

export const formatInteger = (value: number, language: string) =>
  Math.round(value).toLocaleString(language);
