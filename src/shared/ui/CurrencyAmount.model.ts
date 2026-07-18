export const formatChaosCurrencyValue = (value: number, language: string) => {
  return Number(value.toFixed(1)).toLocaleString(language);
};

export const shouldUseChaosCurrencyValue = (
  resolvedDivineValue: number,
  canUseChaos: boolean,
) => canUseChaos && Math.abs(resolvedDivineValue) <= 1;
